'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountMultisig = exports.MULTISIG_CONFIRM_METHODS = exports.MULTISIG_VIEW_METHODS = exports.MULTISIG_CHANGE_METHODS = exports.MULTISIG_DEPOSIT = exports.MULTISIG_GAS = exports.MULTISIG_ALLOWANCE = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const account_1 = require("./account");
const contract_1 = require("./contract");
const format_1 = require("./utils/format");
const key_pair_1 = require("./utils/key_pair");
const transaction_1 = require("./transaction");
const NETWORK_ID = process.env.REACT_APP_NETWORK_ID || 'default';
const CONTRACT_HELPER_URL = process.env.CONTRACT_HELPER_URL || 'https://helper.testnet.near.org';
exports.MULTISIG_ALLOWANCE = new bn_js_1.default(process.env.MULTISIG_ALLOWANCE || format_1.parseNearAmount('1'));
exports.MULTISIG_GAS = new bn_js_1.default(process.env.MULTISIG_GAS || '100000000000000');
exports.MULTISIG_DEPOSIT = new bn_js_1.default('0');
exports.MULTISIG_CHANGE_METHODS = ['add_request', 'add_request_and_confirm', 'delete_request', 'confirm'];
exports.MULTISIG_VIEW_METHODS = ['get_request_nonce', 'list_request_ids'];
exports.MULTISIG_CONFIRM_METHODS = ['confirm'];
;
class AccountMultisig extends account_1.Account {
    constructor(connection, accountId) {
        super(connection, accountId);
        this.contract = getContract(this);
    }
    async addKey(publicKey, contractId, methodName, amount) {
        if (contractId) {
            return super.addKey(publicKey, contractId, exports.MULTISIG_CHANGE_METHODS.join(), exports.MULTISIG_ALLOWANCE);
        }
        return super.addKey(publicKey);
    }
    async signAndSendTransaction(receiverId, actions) {
        const { accountId } = this;
        if (this.isDeleteAction(actions)) {
            return await super.signAndSendTransaction(accountId, actions);
        }
        await this.deleteUnconfirmedRequests();
        const requestId = await this.getRequestNonce();
        this.setRequest({ accountId, requestId, actions });
        const args = new Uint8Array(new TextEncoder().encode(JSON.stringify({
            request: {
                receiver_id: receiverId,
                actions: convertActions(actions, accountId, receiverId)
            }
        })));
        return await super.signAndSendTransaction(accountId, [
            transaction_1.functionCall('add_request_and_confirm', args, exports.MULTISIG_GAS, exports.MULTISIG_DEPOSIT)
        ]);
    }
    async signAndSendTransactions(transactions) {
        for (let { receiverId, actions } of transactions) {
            await this.signAndSendTransaction(receiverId, actions);
        }
    }
    async deployMultisig(contractBytes) {
        const { accountId } = this;
        // replace account keys & recovery keys with limited access keys; DO NOT replace seed phrase keys
        const accountKeys = (await this.getAccessKeys()).map((ak) => ak.public_key);
        const seedPhraseKeys = (await this.getRecoveryMethods()).data
            .filter(({ kind, publicKey }) => kind === 'phrase' && publicKey !== null && accountKeys.includes(publicKey))
            .map((rm) => rm.publicKey);
        const fak2lak = accountKeys.filter((k) => !seedPhraseKeys.includes(k)).map(toPK);
        const confirmOnlyKey = toPK((await this.postSignedJson('/2fa/getAccessKey', { accountId })).publicKey);
        const newArgs = new Uint8Array(new TextEncoder().encode(JSON.stringify({ 'num_confirmations': 2 })));
        const actions = [
            ...fak2lak.map((pk) => transaction_1.deleteKey(pk)),
            ...fak2lak.map((pk) => transaction_1.addKey(pk, transaction_1.functionCallAccessKey(accountId, exports.MULTISIG_CHANGE_METHODS, null))),
            transaction_1.addKey(confirmOnlyKey, transaction_1.functionCallAccessKey(accountId, exports.MULTISIG_CONFIRM_METHODS, null)),
            transaction_1.deployContract(contractBytes),
            transaction_1.functionCall('new', newArgs, exports.MULTISIG_GAS, exports.MULTISIG_DEPOSIT),
        ];
        console.log('deploying multisig contract for', accountId);
        return await super.signAndSendTransaction(accountId, actions);
    }
    async deleteUnconfirmedRequests() {
        const { contract } = this;
        const request_ids = await this.getRequestIds();
        for (const request_id of request_ids) {
            try {
                await contract.delete_request({ request_id });
            }
            catch (e) {
                console.warn(e);
            }
        }
    }
    // helpers
    async getRequestNonce() {
        return this.contract.get_request_nonce();
    }
    async getRequestIds() {
        return this.contract.list_request_ids();
    }
    isDeleteAction(actions) {
        return actions && actions[0] && actions[0].functionCall && actions[0].functionCall.methodName === 'delete_request';
    }
    getRequest() {
        return JSON.parse(localStorage.getItem(`__multisigRequest`) || `{}`);
    }
    setRequest(data) {
        localStorage.setItem(`__multisigRequest`, JSON.stringify(data));
    }
    // default helpers for CH
    async sendRequestCode() {
        const { accountId } = this;
        const { requestId, actions } = this.getRequest();
        if (this.isDeleteAction(actions)) {
            return;
        }
        const method = await this.get2faMethod();
        await this.postSignedJson('/2fa/send', {
            accountId,
            method,
            requestId,
        });
        return requestId;
    }
    async verifyRequestCode(securityCode) {
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
        if (!data)
            return null;
        const { kind, detail } = data;
        return { kind, detail };
    }
    async signatureFor() {
        const { accountId } = this;
        const blockNumber = String((await this.connection.provider.status()).sync_info.latest_block_height);
        const signed = await this.connection.signer.signMessage(Buffer.from(blockNumber), accountId, NETWORK_ID);
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
exports.AccountMultisig = AccountMultisig;
// helpers
const toPK = (pk) => key_pair_1.PublicKey.from(pk);
const convertPKForContract = (pk) => pk.toString().replace('ed25519:', '');
const getContract = (account) => {
    return new contract_1.Contract(account, account.accountId, {
        viewMethods: exports.MULTISIG_VIEW_METHODS,
        changeMethods: exports.MULTISIG_CHANGE_METHODS,
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
        deposit: (deposit && deposit.toString()) || undefined,
        permission: undefined,
    };
    if (accessKey) {
        if (receiverId === accountId && accessKey.permission.enum !== 'fullAccess') {
            action.permission = {
                receiver_id: accountId,
                allowance: exports.MULTISIG_ALLOWANCE.toString(),
                method_names: exports.MULTISIG_CHANGE_METHODS,
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
