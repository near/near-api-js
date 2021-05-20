'use strict';

import BN from 'bn.js';
import depd from 'depd';
import { Account, SignAndSendTransactionOptions } from './account';
import { Connection } from './connection';
import { parseNearAmount } from './utils/format';
import { PublicKey } from './utils/key_pair';
import { Action, addKey, deleteKey, deployContract, functionCall, functionCallAccessKey } from './transaction';
import { FinalExecutionOutcome } from './providers';
import { fetchJson } from './utils/web';
import { FunctionCallPermissionView } from './providers/provider';

export const MULTISIG_STORAGE_KEY = '__multisigRequest';
export const MULTISIG_ALLOWANCE = new BN(parseNearAmount('1'));
// TODO: Different gas value for different requests (can reduce gas usage dramatically)
export const MULTISIG_GAS = new BN('100000000000000');
export const MULTISIG_DEPOSIT = new BN('0');
export const MULTISIG_CHANGE_METHODS = ['add_request', 'add_request_and_confirm', 'delete_request', 'confirm'];
export const MULTISIG_CONFIRM_METHODS = ['confirm'];

type sendCodeFunction = () => Promise<any>;
type getCodeFunction = (method: any) => Promise<string>;
type verifyCodeFunction = (securityCode: any) => Promise<any>;

// in memory request cache for node w/o localStorage
const storageFallback = {
    [MULTISIG_STORAGE_KEY]: null
};

export class AccountMultisig extends Account {
    public storage: any;
    public onAddRequestResult: Function;

    constructor(connection: Connection, accountId: string, options: any) {
        super(connection, accountId);
        this.storage = options.storage;
        this.onAddRequestResult = options.onAddRequestResult;
    }

    async signAndSendTransactionWithAccount(receiverId: string, actions: Action[]): Promise<FinalExecutionOutcome> {
        return super.signAndSendTransaction({ receiverId, actions });
    }

    protected signAndSendTransaction(...args: any[]): Promise<FinalExecutionOutcome> {
        if(typeof args[0] === 'string') {
            return this._signAndSendTransaction({ receiverId: args[0], actions: args[1] });
        }

        return this._signAndSendTransaction(args[0]);
    }

    private async _signAndSendTransaction({ receiverId, actions }: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome> {
        const { accountId } = this;

        const args = Buffer.from(JSON.stringify({
            request: {
                receiver_id: receiverId,
                actions: convertActions(actions, accountId, receiverId)
            }
        }));

        let result;
        try {
            result = await super.signAndSendTransaction({
                receiverId: accountId,
                actions: [
                    functionCall('add_request_and_confirm', args, MULTISIG_GAS, MULTISIG_DEPOSIT)
                ]
            });
        } catch(e) {
            if (e.toString().includes('Account has too many active requests. Confirm or delete some')) {
                await this.deleteUnconfirmedRequests();
                return await this.signAndSendTransaction(receiverId, actions);
            }
            throw e;
        }

        // TODO: Are following even needed? Seems like it throws on error already
        if (!result.status) {
            throw new Error('Request failed');
        }
        const status: any = { ...result.status };
        if (!status.SuccessValue || typeof status.SuccessValue !== 'string') {
            throw new Error('Request failed');
        }

        this.setRequest({
            accountId,
            actions,
            requestId: parseInt(Buffer.from(status.SuccessValue, 'base64').toString('ascii'), 10)
        });

        if (this.onAddRequestResult) {
            await this.onAddRequestResult(result);
        }

        // NOTE there is no await on purpose to avoid blocking for 2fa
        this.deleteUnconfirmedRequests();

        return result;
    }

    async deleteUnconfirmedRequests () {
        // TODO: Delete in batch, don't delete unexpired
        // TODO: Delete in batch, don't delete unexpired (can reduce gas usage dramatically)
        const request_ids = await this.getRequestIds();
        const { requestId } = this.getRequest();
        for (const requestIdToDelete of request_ids) {
            if (requestIdToDelete == requestId) {
                continue;
            }
            try {
                await super.signAndSendTransaction({
                    receiverId: this.accountId, 
                    actions: [functionCall('delete_request', { request_id: requestIdToDelete }, MULTISIG_GAS, MULTISIG_DEPOSIT)]
                });
            } catch(e) {
                console.warn('Attempt to delete an earlier request before 15 minutes failed. Will try again.');
            }
        }
    }

    // helpers

    async getRequestIds(): Promise<string> {
        // TODO: Read requests from state to allow filtering by expiration time
        // TODO: https://github.com/near/core-contracts/blob/305d1db4f4f2cf5ce4c1ef3479f7544957381f11/multisig/src/lib.rs#L84
        return this.viewFunction(this.accountId, 'list_request_ids');
    }

    getRequest() {
        if (this.storage) {
            return JSON.parse(this.storage.getItem(MULTISIG_STORAGE_KEY) || '{}');
        }
        return storageFallback[MULTISIG_STORAGE_KEY];
    }
    
    setRequest(data) {
        if (this.storage) {
            return this.storage.setItem(MULTISIG_STORAGE_KEY, JSON.stringify(data));
        }
        storageFallback[MULTISIG_STORAGE_KEY] = data;
    }
}

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
    public onConfirmResult: Function;
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
     * @see {@link JsonRpcProvider.sendTransaction}
     */
    signAndSendTransaction({ receiverId, actions }: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome>
    /**
     * @deprecated
     * Sign a transaction to preform a list of actions and broadcast it using the RPC API.
     * @see {@link JsonRpcProvider.sendTransaction}
     * 
     * @param receiverId NEAR account receiving the transaction
     * @param actions list of actions to perform as part of the transaction
     */
    signAndSendTransaction(receiverId: string, actions: Action[]): Promise<FinalExecutionOutcome>
    async signAndSendTransaction(...args: any): Promise<FinalExecutionOutcome> {
        if(typeof args[0] === 'string') {
            const deprecate = depd('Account.signAndSendTransaction(receiverId, actions');
            deprecate('use `Account2FA.signAndSendTransaction(SignAndSendTransactionOptions)` instead');
            return this.__signAndSendTransaction({ receiverId: args[0], actions: args[1] });
        } else {
            return this.__signAndSendTransaction(args[0]);
        }
    }

    private async __signAndSendTransaction({ receiverId, actions }: SignAndSendTransactionOptions) {
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
        if ((await this.state()).code_hash === '11111111111111111111111111111111') {
            actions.push(functionCall('new', newArgs, MULTISIG_GAS, MULTISIG_DEPOSIT),);
        }
        console.log('deploying multisig contract for', accountId);
        return await super.signAndSendTransactionWithAccount(accountId, actions);
    }

    async disable(contractBytes: Uint8Array) {
        const { accountId } = this;
        const accessKeys = await this.getAccessKeys();
        const lak2fak = accessKeys
            .filter(({ access_key }) => access_key.permission !== 'FullAccess')
            .filter(({ access_key }) => {
                const perm = (access_key.permission as FunctionCallPermissionView).FunctionCall;
                return  perm.receiver_id === accountId &&
                    perm.method_names.length === 4 &&
                    perm.method_names.includes('add_request_and_confirm');
            });
        const confirmOnlyKey = PublicKey.from((await this.postSignedJson('/2fa/getAccessKey', { accountId })).publicKey);
        const actions = [
            deleteKey(confirmOnlyKey),
            ...lak2fak.map(({ public_key }) => deleteKey(PublicKey.from(public_key))),
            ...lak2fak.map(({ public_key }) => addKey(PublicKey.from(public_key), null)),
            deployContract(contractBytes),
        ];
        console.log('disabling 2fa for', accountId);
        return await this.signAndSendTransaction({
            receiverId: accountId,
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

    async getCodeDefault(method: any): Promise<string> {
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
const convertPKForContract = (pk) => pk.toString().replace('ed25519:', '');

const convertActions = (actions, accountId, receiverId) => actions.map((a) => {
    const type = a.enum;
    const { gas, publicKey, methodName, args, deposit, accessKey, code } = a[type];
    const action = {
        type: type[0].toUpperCase() + type.substr(1),
        gas: (gas && gas.toString()) || undefined,
        public_key: (publicKey && convertPKForContract(publicKey)) || undefined,
        method_name: methodName,
        args: (args && Buffer.from(args).toString('base64')) || undefined,
        code: (code && Buffer.from(code).toString('base64')) || undefined,
        amount: (deposit && deposit.toString()) || undefined,
        deposit: (deposit && deposit.toString()) || '0',
        permission: undefined,
    };
    if (accessKey) {
        if (receiverId === accountId && accessKey.permission.enum !== 'fullAccess') {
            action.permission = {
                receiver_id: accountId,
                allowance: MULTISIG_ALLOWANCE.toString(),
                method_names: MULTISIG_CHANGE_METHODS,
            };
        }
        if (accessKey.permission.enum === 'functionCall') {
            const { receiverId: receiver_id, methodNames: method_names, allowance } = accessKey.permission.functionCall;
            action.permission = {
                receiver_id,
                allowance: (allowance && allowance.toString()) || undefined,
                method_names
            };
        }
    }
    return action;
});
