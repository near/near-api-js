import { PublicKey } from '@near-js/crypto';
import { actionCreators } from '@near-js/transactions';
import { type FinalExecutionOutcome, type FunctionCallPermissionView, TypedError } from '@near-js/types';
import { Logger } from '@near-js/utils';

import type { SignAndSendTransactionOptions } from './account';
import { AccountMultisig } from './account_multisig';
import type { Connection } from './connection';
import { MULTISIG_CHANGE_METHODS, MULTISIG_CONFIRM_METHODS, MULTISIG_DEPOSIT, MULTISIG_GAS } from './constants';
import { MultisigStateStatus } from './types';

const { addKey, deleteKey, deployContract, fullAccessKey, functionCall, functionCallAccessKey } = actionCreators;

type sendCodeFunction = () => Promise<any>;
type getCodeFunction = (method: any) => Promise<string>;
type verifyCodeFunction = (securityCode: any) => Promise<any>;

export class Account2FA extends AccountMultisig {
    /********************************
    Account2FA has options object where you can provide callbacks for:
    - sendCode: how to send the 2FA code in case you don't use NEAR Contract Helper
    - getCode: how to get code from user (use this to provide custom UI/UX for prompt of 2FA code)
    - onResult: the tx result after it's been confirmed by NEAR Contract Helper
    ********************************/
    public sendCode: sendCodeFunction;
    public getCode: getCodeFunction;
    public verifyCode: verifyCodeFunction;
    public onConfirmResult: (any) => any;
    public helperUrl = 'https://helper.testnet.near.org';

    constructor(connection: Connection, accountId: string, options: any) {
        super(connection, accountId, options);
        this.helperUrl = options.helperUrl || this.helperUrl;
        this.storage = options.storage;
        this.sendCode = options.sendCode || this.sendCodeDefault;
        this.getCode = options.getCode || this.getCodeDefault;
        this.verifyCode = options.verifyCode || this.verifyCodeDefault;
        this.onConfirmResult = options.onConfirmResult;
    }

    /**
     * Sign a transaction to preform a list of actions and broadcast it using the RPC API.
     * @see {@link "@near-js/providers".json-rpc-provider.JsonRpcProvider.sendTransaction | JsonRpcProvider.sendTransaction}
     *
     * @param options Options for the transaction.
     * @param options.receiverId The NEAR account ID of the transaction receiver.
     * @param options.actions The list of actions to be included in the transaction.
     * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the transaction.
     */
    async signAndSendTransaction({
        receiverId,
        actions,
    }: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome> {
        await super.signAndSendTransaction({ receiverId, actions });
        // TODO: Should following override onRequestResult in superclass instead of doing custom signAndSendTransaction?
        await this.sendCode();
        const result = await this.promptAndVerify();
        if (this.onConfirmResult) {
            await this.onConfirmResult(result);
        }
        return result;
    }

    // default helpers for CH deployments of multisig

    /**
     * Deploy a multisig contract with 2FA and handle the deployment process.
     * @param contractBytes - The bytecode of the multisig contract.
     * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the deployment.
     */
    async deployMultisig(contractBytes: Uint8Array) {
        const { accountId } = this;

        const seedOrLedgerKey = (await this.getRecoveryMethods()).data
            // @ts-ignore
            .filter(({ kind, publicKey }) => (kind === 'phrase' || kind === 'ledger') && publicKey !== null)
            .map((rm) => rm.publicKey);

        const fak2lak = (await this.getAccessKeys())
            .filter(
                ({ public_key, access_key: { permission } }) =>
                    permission === 'FullAccess' && !seedOrLedgerKey.includes(public_key),
            )
            .map((ak) => ak.public_key)
            .map(toPK);

        // @ts-ignore
        const confirmOnlyKey = toPK((await this.postSignedJson('/2fa/getAccessKey', { accountId })).publicKey);

        const newArgs = Buffer.from(JSON.stringify({ num_confirmations: 2 }));

        const actions = [
            ...fak2lak.map((pk) => deleteKey(pk)),
            ...fak2lak.map((pk) => addKey(pk, functionCallAccessKey(accountId, MULTISIG_CHANGE_METHODS, null))),
            addKey(confirmOnlyKey, functionCallAccessKey(accountId, MULTISIG_CONFIRM_METHODS, null)),
            deployContract(contractBytes),
        ];
        const newFunctionCallActionBatch = actions.concat(functionCall('new', newArgs, MULTISIG_GAS, MULTISIG_DEPOSIT));
        Logger.log('deploying multisig contract for', accountId);

        const { stateStatus: multisigStateStatus } = await this.checkMultisigCodeAndStateStatus(contractBytes);
        switch (multisigStateStatus) {
            case MultisigStateStatus.STATE_NOT_INITIALIZED:
                return await super.signAndSendTransactionWithAccount(accountId, newFunctionCallActionBatch);
            case MultisigStateStatus.VALID_STATE:
                return await super.signAndSendTransactionWithAccount(accountId, actions);
            case MultisigStateStatus.INVALID_STATE:
                throw new TypedError(
                    `Can not deploy a contract to account ${this.accountId} on network ${this.connection.networkId}, the account has existing state.`,
                    'ContractHasExistingState',
                );
            default:
                throw new TypedError(
                    `Can not deploy a contract to account ${this.accountId} on network ${this.connection.networkId}, the account state could not be verified.`,
                    'ContractStateUnknown',
                );
        }
    }

    /**
     * Disable 2FA with the option to clean up contract state.
     * @param options Options for disabling 2FA.
     * @param options.contractBytes The bytecode of the contract to deploy.
     * @param options.cleanupContractBytes The bytecode of the cleanup contract (optional).
     * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the operation.
     */
    async disableWithFAK({
        contractBytes,
        cleanupContractBytes,
    }: { contractBytes: Uint8Array; cleanupContractBytes?: Uint8Array }) {
        let cleanupActions = [];
        if (cleanupContractBytes) {
            await this.deleteAllRequests().catch((e) => e);
            cleanupActions = await this.get2faDisableCleanupActions(cleanupContractBytes);
        }
        const keyConversionActions = await this.get2faDisableKeyConversionActions();

        const actions = [...cleanupActions, ...keyConversionActions, deployContract(contractBytes)];

        const accessKeyInfo = await this.findAccessKey(this.accountId, actions);

        if (accessKeyInfo?.accessKey && accessKeyInfo.accessKey.permission !== 'FullAccess') {
            throw new TypedError('No full access key found in keystore. Unable to bypass multisig', 'NoFAKFound');
        }

        return this.signAndSendTransactionWithAccount(this.accountId, actions);
    }

    /**
     * Retrieves cleanup actions for disabling 2FA.
     * @param cleanupContractBytes - The bytecode of the cleanup contract.
     * @returns {Promise<Action[]>} - A promise that resolves to an array of cleanup actions.
     */
    async get2faDisableCleanupActions(cleanupContractBytes: Uint8Array) {
        const currentAccountState: { key: Buffer; value: Buffer }[] = await this.viewState('').catch((error) => {
            const cause = error.cause?.name;
            if (cause === 'NO_CONTRACT_CODE') {
                return [];
            }
            throw cause === 'TOO_LARGE_CONTRACT_STATE'
                ? new TypedError(
                      `Can not deploy a contract to account ${this.accountId} on network ${this.connection.networkId}, the account has existing state.`,
                      'ContractHasExistingState',
                  )
                : error;
        });

        const currentAccountStateKeys = currentAccountState.map(({ key }) => key.toString('base64'));
        return currentAccountState.length
            ? [
                  deployContract(cleanupContractBytes),
                  functionCall('clean', { keys: currentAccountStateKeys }, MULTISIG_GAS, 0n),
              ]
            : [];
    }

    /**
     * Retrieves key conversion actions for disabling 2FA.
     * @returns {Promise<Action[]>} - A promise that resolves to an array of key conversion actions.
     */
    async get2faDisableKeyConversionActions() {
        const { accountId } = this;
        const accessKeys = await this.getAccessKeys();
        const lak2fak = accessKeys
            .filter(({ access_key }) => access_key.permission !== 'FullAccess')
            .filter(({ access_key }) => {
                const perm = (access_key.permission as FunctionCallPermissionView).FunctionCall;
                return (
                    perm.receiver_id === accountId &&
                    perm.method_names.length === 4 &&
                    perm.method_names.includes('add_request_and_confirm')
                );
            });
        // @ts-ignore
        const confirmOnlyKey = PublicKey.from(
            (await this.postSignedJson('/2fa/getAccessKey', { accountId })).publicKey,
        );
        return [
            deleteKey(confirmOnlyKey),
            ...lak2fak.map(({ public_key }) => deleteKey(PublicKey.from(public_key))),
            ...lak2fak.map(({ public_key }) => addKey(PublicKey.from(public_key), fullAccessKey())),
        ];
    }

    /**
     * This method converts LAKs back to FAKs, clears state and deploys an 'empty' contract (contractBytes param)
     * @param [contractBytes]{@link https://github.com/near/near-wallet/blob/master/packages/frontend/src/wasm/main.wasm?raw=true}
     * @param [cleanupContractBytes]{@link https://github.com/near/core-contracts/blob/master/state-manipulation/res/state_cleanup.wasm?raw=true}
     * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the operation.
     */
    async disable(contractBytes: Uint8Array, cleanupContractBytes: Uint8Array) {
        const { stateStatus } = await this.checkMultisigCodeAndStateStatus();
        if (
            stateStatus !== MultisigStateStatus.VALID_STATE &&
            stateStatus !== MultisigStateStatus.STATE_NOT_INITIALIZED
        ) {
            throw new TypedError(
                `Can not deploy a contract to account ${this.accountId} on network ${this.connection.networkId}, the account state could not be verified.`,
                'ContractStateUnknown',
            );
        }

        let deleteAllRequestsError;
        await this.deleteAllRequests().catch((e) => (deleteAllRequestsError = e));

        const cleanupActions = await this.get2faDisableCleanupActions(cleanupContractBytes).catch((e) => {
            if (e.type === 'ContractHasExistingState') {
                throw deleteAllRequestsError || e;
            }
            throw e;
        });

        const actions = [
            ...cleanupActions,
            ...(await this.get2faDisableKeyConversionActions()),
            deployContract(contractBytes),
        ];
        Logger.log('disabling 2fa for', this.accountId);
        return await this.signAndSendTransaction({
            receiverId: this.accountId,
            actions,
        });
    }

    /**
     * Default implementation for sending the 2FA code.
     * @returns {Promise<string>} - A promise that resolves to the request ID.
     */
    async sendCodeDefault() {
        const { accountId } = this;
        const { requestId } = this.getRequest();
        const method = await this.get2faMethod();
        await this.postSignedJson('/2fa/send', {
            accountId,
            method,
            requestId,
        });
        return requestId;
    }

    async getCodeDefault(): Promise<string> {
        throw new Error(
            'There is no getCode callback provided. Please provide your own in AccountMultisig constructor options. It has a parameter method where method.kind is "email" or "phone".',
        );
    }

    /**
     * Prompts the user to enter and verify the 2FA code.
     * @returns {Promise<any>} - A promise that resolves to the verification result.
     */
    async promptAndVerify() {
        const method = await this.get2faMethod();
        const securityCode = await this.getCode(method);
        try {
            const result = await this.verifyCode(securityCode);

            // TODO: Parse error from result for real (like in normal account.signAndSendTransaction)
            return result;
        } catch (e) {
            Logger.warn('Error validating security code:', e);
            if (e.toString().includes('invalid 2fa code provided') || e.toString().includes('2fa code not valid')) {
                return await this.promptAndVerify();
            }

            throw e;
        }
    }

    /**
     * Verify the 2FA code using the default method.
     * @param securityCode - The security code to verify.
     * @returns {Promise<any>} A promise that resolves to the verification result.
     */
    async verifyCodeDefault(securityCode: string) {
        const { accountId } = this;
        const request = this.getRequest();
        if (!request) {
            throw new Error('no request pending');
        }
        const { requestId } = request;
        return await this.postSignedJson('/2fa/verify', {
            accountId,
            securityCode,
            requestId,
        });
    }

    /**
     * Retrieves recovery methods for the account.
     * @returns {Promise<{ accountId: string, data: any }>} - A promise that resolves to recovery methods data.
     */
    async getRecoveryMethods() {
        const { accountId } = this;
        return {
            accountId,
            data: await this.postSignedJson('/account/recoveryMethods', {
                accountId,
            }),
        };
    }

    /**
     * Gets the 2FA method (kind and detail).
     * @returns {Promise<{ kind: string, detail: string }>} A promise that resolves to the 2FA method.
     */
    async get2faMethod() {
        let { data } = await this.getRecoveryMethods();
        // @ts-ignore
        if (data?.length) {
            // @ts-ignore
            data = data.find((m) => m.kind.indexOf('2fa-') === 0);
        }
        if (!data) return null;
        // @ts-ignore
        const { kind, detail } = data;
        return { kind, detail };
    }

    /**
     * Generates a signature for the latest finalized block.
     * @returns {Promise<{ blockNumber: string, blockNumberSignature: string }>} - A promise that resolves to the signature information.
     */
    async signatureFor() {
        const { accountId } = this;
        const block = await this.connection.provider.block({
            finality: 'final',
        });
        const blockNumber = block.header.height.toString();
        const signed = await this.connection.signer.signMessage(
            Buffer.from(blockNumber),
            accountId,
            this.connection.networkId,
        );
        const blockNumberSignature = Buffer.from(signed.signature).toString('base64');
        return { blockNumber, blockNumberSignature };
    }

    /**
     * Sends a signed JSON request to a specified path.
     * @param path - The path for the request.
     * @param body - The request body.
     * @returns {Promise<any>} - A promise that resolves to the response from the helper.
     */
    async postSignedJson(path, body) {
        return await fetch(this.helperUrl + path, {
            body: JSON.stringify({
                ...body,
                ...(await this.signatureFor()),
            }),
            method: 'POST',
        });
    }
}

// helpers
const toPK = (pk) => PublicKey.from(pk);
