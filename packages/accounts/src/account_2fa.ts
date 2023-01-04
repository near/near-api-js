'use strict';

import { PublicKey } from '@near-js/keypairs';
import { FinalExecutionOutcome, TypedError, FunctionCallPermissionView } from '@near-js/types';
import { fetchJson } from '@near-js/providers';
import { addKey, deleteKey, deployContract, fullAccessKey, functionCall, functionCallAccessKey } from '@near-js/transactions';
import BN from 'bn.js';

import { SignAndSendTransactionOptions } from './account';
import { AccountMultisig } from './account_multisig';
import { Connection } from './connection';
import {
    MULTISIG_CHANGE_METHODS,
    MULTISIG_CONFIRM_METHODS,
    MULTISIG_DEPOSIT,
    MULTISIG_GAS,
} from './constants';
import { MultisigStateStatus } from './types';

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
     * @see {@link providers/json-rpc-provider!JsonRpcProvider#sendTransaction | JsonRpcProvider.sendTransaction}
     */
    async signAndSendTransaction({ receiverId, actions }: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome> {
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

    async deployMultisig(contractBytes: Uint8Array) {
        const { accountId } = this;

        const seedOrLedgerKey = (await this.getRecoveryMethods()).data
            .filter(({ kind, publicKey }) => (kind === 'phrase' || kind === 'ledger') && publicKey !== null)
            .map((rm) => rm.publicKey);

        const fak2lak = (await this.getAccessKeys())
            .filter(({ public_key, access_key: { permission } }) => permission === 'FullAccess' && !seedOrLedgerKey.includes(public_key))
            .map((ak) => ak.public_key)
            .map(toPK);

        const confirmOnlyKey = toPK((await this.postSignedJson('/2fa/getAccessKey', { accountId })).publicKey);

        const newArgs = Buffer.from(JSON.stringify({ 'num_confirmations': 2 }));

        const actions = [
            ...fak2lak.map((pk) => deleteKey(pk)),
            ...fak2lak.map((pk) => addKey(pk, functionCallAccessKey(accountId, MULTISIG_CHANGE_METHODS, null))),
            addKey(confirmOnlyKey, functionCallAccessKey(accountId, MULTISIG_CONFIRM_METHODS, null)),
            deployContract(contractBytes),
        ];
        const newFunctionCallActionBatch = actions.concat(functionCall('new', newArgs, MULTISIG_GAS, MULTISIG_DEPOSIT));
        console.log('deploying multisig contract for', accountId);

        const { stateStatus: multisigStateStatus } = await this.checkMultisigCodeAndStateStatus(contractBytes);
        switch (multisigStateStatus) {
            case MultisigStateStatus.STATE_NOT_INITIALIZED:
                return await super.signAndSendTransactionWithAccount(accountId, newFunctionCallActionBatch);
            case MultisigStateStatus.VALID_STATE:
                return await super.signAndSendTransactionWithAccount(accountId, actions);
            case MultisigStateStatus.INVALID_STATE:
                throw new TypedError(`Can not deploy a contract to account ${this.accountId} on network ${this.connection.networkId}, the account has existing state.`, 'ContractHasExistingState');
            default:
                throw new TypedError(`Can not deploy a contract to account ${this.accountId} on network ${this.connection.networkId}, the account state could not be verified.`, 'ContractStateUnknown');
        }
    }

    async disableWithFAK({ contractBytes, cleanupContractBytes }: { contractBytes: Uint8Array; cleanupContractBytes?: Uint8Array }) {
        let cleanupActions = [];
        if(cleanupContractBytes) {
            await this.deleteAllRequests().catch(e => e);
            cleanupActions = await this.get2faDisableCleanupActions(cleanupContractBytes);
        }
        const keyConversionActions = await this.get2faDisableKeyConversionActions();

        const actions = [
            ...cleanupActions,
            ...keyConversionActions,
            deployContract(contractBytes)
        ];

        const accessKeyInfo = await this.findAccessKey(this.accountId, actions);

        if(accessKeyInfo && accessKeyInfo.accessKey && accessKeyInfo.accessKey.permission !== 'FullAccess') {
            throw new TypedError('No full access key found in keystore. Unable to bypass multisig', 'NoFAKFound');
        }

        return this.signAndSendTransactionWithAccount(this.accountId, actions);
    }

    async get2faDisableCleanupActions(cleanupContractBytes: Uint8Array) {
        const currentAccountState: { key: Buffer; value: Buffer }[] = await this.viewState('').catch(error => {
            const cause = error.cause && error.cause.name;
            if (cause == 'NO_CONTRACT_CODE') {
                return [];
            }
            throw cause == 'TOO_LARGE_CONTRACT_STATE'
                ? new TypedError(`Can not deploy a contract to account ${this.accountId} on network ${this.connection.networkId}, the account has existing state.`, 'ContractHasExistingState')
                : error;
        });

        const currentAccountStateKeys = currentAccountState.map(({ key }) => key.toString('base64'));
        return currentAccountState.length ? [
            deployContract(cleanupContractBytes),
            functionCall('clean', { keys: currentAccountStateKeys }, MULTISIG_GAS, new BN('0'))
        ] : [];
    }

    async get2faDisableKeyConversionActions() {
        const { accountId } = this;
        const accessKeys = await this.getAccessKeys();
        const lak2fak = accessKeys
            .filter(({ access_key }) => access_key.permission !== 'FullAccess')
            .filter(({ access_key }) => {
                const perm = (access_key.permission as FunctionCallPermissionView).FunctionCall;
                return perm.receiver_id === accountId &&
                    perm.method_names.length === 4 &&
                    perm.method_names.includes('add_request_and_confirm');
            });
        const confirmOnlyKey = PublicKey.from((await this.postSignedJson('/2fa/getAccessKey', { accountId })).publicKey);
        return [
            deleteKey(confirmOnlyKey),
            ...lak2fak.map(({ public_key }) => deleteKey(PublicKey.from(public_key))),
            ...lak2fak.map(({ public_key }) => addKey(PublicKey.from(public_key), fullAccessKey()))
        ];
    }

    /**
     * This method converts LAKs back to FAKs, clears state and deploys an 'empty' contract (contractBytes param)
     * @param [contractBytes]{@link https://github.com/near/near-wallet/blob/master/packages/frontend/src/wasm/main.wasm?raw=true}
     * @param [cleanupContractBytes]{@link https://github.com/near/core-contracts/blob/master/state-cleanup/res/state_cleanup.wasm?raw=true}
     */
    async disable(contractBytes: Uint8Array, cleanupContractBytes: Uint8Array) {
        const { stateStatus } = await this.checkMultisigCodeAndStateStatus();
        if(stateStatus !== MultisigStateStatus.VALID_STATE && stateStatus !== MultisigStateStatus.STATE_NOT_INITIALIZED) {
            throw new TypedError(`Can not deploy a contract to account ${this.accountId} on network ${this.connection.networkId}, the account state could not be verified.`, 'ContractStateUnknown');
        }

        let deleteAllRequestsError;
        await this.deleteAllRequests().catch(e => deleteAllRequestsError = e);

        const cleanupActions = await this.get2faDisableCleanupActions(cleanupContractBytes).catch(e => {
            if(e.type === 'ContractHasExistingState') {
                throw deleteAllRequestsError || e;
            }
            throw e;
        });

        const actions = [
            ...cleanupActions,
            ...(await this.get2faDisableKeyConversionActions()),
            deployContract(contractBytes),
        ];
        console.log('disabling 2fa for', this.accountId);
        return await this.signAndSendTransaction({
            receiverId: this.accountId,
            actions
        });
    }

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
        throw new Error('There is no getCode callback provided. Please provide your own in AccountMultisig constructor options. It has a parameter method where method.kind is "email" or "phone".');
    }

    async promptAndVerify() {
        const method = await this.get2faMethod();
        const securityCode = await this.getCode(method);
        try {
            const result = await this.verifyCode(securityCode);

            // TODO: Parse error from result for real (like in normal account.signAndSendTransaction)
            return result;
        } catch (e) {
            console.warn('Error validating security code:', e);
            if (e.toString().includes('invalid 2fa code provided') || e.toString().includes('2fa code not valid')) {
                return await this.promptAndVerify();
            }

            throw e;
        }
    }

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
            requestId
        });
    }

    async getRecoveryMethods() {
        const { accountId } = this;
        return {
            accountId,
            data: await this.postSignedJson('/account/recoveryMethods', { accountId })
        };
    }

    async get2faMethod() {
        let { data } = await this.getRecoveryMethods();
        if (data && data.length) {
            data = data.find((m) => m.kind.indexOf('2fa-') === 0);
        }
        if (!data) return null;
        const { kind, detail } = data;
        return { kind, detail };
    }

    async signatureFor() {
        const { accountId } = this;
        const block = await this.connection.provider.block({ finality: 'final' });
        const blockNumber = block.header.height.toString();
        const signed = await this.connection.signer.signMessage(Buffer.from(blockNumber), accountId, this.connection.networkId);
        const blockNumberSignature = Buffer.from(signed.signature).toString('base64');
        return { blockNumber, blockNumberSignature };
    }

    async postSignedJson(path, body) {
        return await fetchJson(this.helperUrl + path, JSON.stringify({
            ...body,
            ...(await this.signatureFor())
        }));
    }
}

// helpers
const toPK = (pk) => PublicKey.from(pk);
