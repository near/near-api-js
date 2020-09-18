'use strict';

import BN from 'bn.js';
import { Account } from './account';
import { Contract } from './contract';
import { Connection } from './connection';
import { parseNearAmount } from './utils/format';
import { PublicKey } from './utils/key_pair';
import { Action, addKey, deleteKey, deployContract, functionCall, functionCallAccessKey } from './transaction';
import { FinalExecutionOutcome } from './providers';

const NETWORK_ID = process.env.REACT_APP_NETWORK_ID || 'default'
const CONTRACT_HELPER_URL = process.env.CONTRACT_HELPER_URL || 'https://helper.testnet.near.org';

export const MULTISIG_ALLOWANCE = new BN(process.env.MULTISIG_ALLOWANCE || parseNearAmount('1'));
export const MULTISIG_GAS = new BN(process.env.MULTISIG_GAS || '100000000000000');
export const MULTISIG_DEPOSIT = new BN('0');
export const MULTISIG_CHANGE_METHODS = ['add_request', 'add_request_and_confirm', 'delete_request', 'confirm'];
export const MULTISIG_VIEW_METHODS = ['get_request_nonce', 'list_request_ids'];
export const MULTISIG_CONFIRM_METHODS = ['confirm'];

interface MultisigContract {
    get_request_nonce(): any,
    list_request_ids(): any,
};
export class AccountMultisig extends Account {
    public contract: MultisigContract;
    public pendingRequest: any;

    constructor(connection: Connection, accountId: string) {
        super(connection, accountId);
        this.contract = <MultisigContract>getContract(this);
    }

    async getRequestNonce(): Promise<String> {
        return this.contract.get_request_nonce();
    }

    async getRequestIds(): Promise<String> {
        return this.contract.list_request_ids();
    }

    async signAndSendTransaction(receiverId: string, actions: Action[]): Promise<FinalExecutionOutcome> {
        const { accountId } = this;

        const args = new Uint8Array(new TextEncoder().encode(JSON.stringify({
            request: {
                receiver_id: receiverId,
                actions: convertActions(actions, accountId, receiverId)
            }
        })));
        
        return super.signAndSendTransaction(accountId, [
            functionCall('add_request_and_confirm', args, MULTISIG_GAS, MULTISIG_DEPOSIT)
        ]);
    }

    async deployMultisig(contractBytes: Uint8Array) {
        const { accountId } = this
        // replace account keys & recovery keys with limited access keys; DO NOT replace seed phrase keys
        const accountKeys = (await this.getAccessKeys()).map((ak) => ak.public_key)
        const seedPhraseKeys = (await this.getRecoveryMethods()).data
            .filter(({ kind, publicKey }) => kind === 'phrase' && publicKey !== null && accountKeys.includes(publicKey))
            .map((rm) => rm.publicKey)
        const fak2lak = accountKeys.filter((k) => !seedPhraseKeys.includes(k)).map(toPK)
        const confirmOnlyKey = toPK((await this.postSignedJson('/2fa/getAccessKey', { accountId })).publicKey)
        const newArgs = new Uint8Array(new TextEncoder().encode(JSON.stringify({ 'num_confirmations': 2 })));

        console.log(fak2lak, confirmOnlyKey, contractBytes.buffer.byteLength)

        console.log(MULTISIG_GAS.toArray('le', 8))

        const actions = [
            ...fak2lak.map((pk) => deleteKey(pk)),
            ...fak2lak.map((pk) => addKey(pk, functionCallAccessKey(accountId, MULTISIG_CHANGE_METHODS, null))),
            addKey(confirmOnlyKey, functionCallAccessKey(accountId, MULTISIG_CONFIRM_METHODS, null)),
            deployContract(contractBytes),
            functionCall('new', newArgs, MULTISIG_GAS, MULTISIG_DEPOSIT),
        ]

        console.log(actions)
        
        console.log('deploying multisig contract for', accountId)
        return await super.signAndSendTransaction(accountId, actions);
    }

    // helpers for CH

    async sendRequest(requestId = -1) {
        const { accountId } = this;
        const method = await this.get2faMethod();
        this.pendingRequest = { accountId, requestId };
        await this.postSignedJson('/2fa/send', {
            accountId,
            method,
            requestId,
        });
    }

    async verifyRequest(securityCode: String) {
        const { accountId } = this;
        if (!this.pendingRequest) {
            throw new Error('no request pending')
        }
        const { requestId } = this.pendingRequest
        await this.postSignedJson('/2fa/verify', {
            accountId,
            securityCode,
            requestId
        });
    }

    async getRecoveryMethods() {
        const { accountId } = this
        return {
            accountId,
            data: await this.postSignedJson('/account/recoveryMethods', { accountId })
        }
    }

    async get2faMethod() {
        const { accountId } = this;
        let res = await this.postSignedJson('/account/recoveryMethods', { accountId });
        if (res && res.length) {
            res = res.find((m) => m.kind.indexOf('2fa-') === 0);
        } else {
            throw new Error('Not a 2FA account');
        }
        const { kind, detail } = res;
        return { kind, detail };
    }

    async signatureFor() {
        const { accountId } = this;
        const blockNumber = String((await this.connection.provider.status()).sync_info.latest_block_height);
        const signer = this.connection.signer;
        const signed = await signer.signMessage(Buffer.from(blockNumber), accountId, NETWORK_ID);
        const blockNumberSignature = Buffer.from(signed.signature).toString('base64');
        return { blockNumber, blockNumberSignature };
    }

    async postSignedJson(path, body) {
        const response = await fetch(CONTRACT_HELPER_URL + path, {
            method: 'POST',
            body: JSON.stringify({
                ...body,
                ...(await this.signatureFor())
            }),
            headers: { 'Content-type': 'application/json; charset=utf-8' }
        });

        if (!response.ok) {
            throw new Error(response.status + ': ' + await response.text());
        }
        if (response.status === 204) {
            return null;
        }
        return await response.json();
    }
}

// helpers
const toPK = (pk) => PublicKey.from(pk)
const convertPKForContract = (pk) => pk.toString().replace('ed25519:', '');

const getContract = (account): unknown => {
    return new Contract(account, account.accountId, {
        viewMethods: MULTISIG_VIEW_METHODS,
        changeMethods: MULTISIG_CHANGE_METHODS,
    });
};

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
        permission: null,
        accessKey: null,
    };
    if (accessKey) {
        if (receiverId === accountId && accessKey.permission.enum !== 'fullAccess') {
            action.permission = {
                receiver_id: accountId,
                allowance: MULTISIG_ALLOWANCE,
                method_names: MULTISIG_CHANGE_METHODS,
            };
        }
        if (accessKey.permission.enum === 'functionCall') {
            console.log(accessKey)
            const { receiverId: receiver_id, methodNames: method_names, allowance } = accessKey.permission.functionCall;
            action.permission = { receiver_id, allowance, method_names };
        }
    }
    return action;
});