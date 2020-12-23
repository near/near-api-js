'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account2FA = exports.AccountMultisig = exports.MULTISIG_CONFIRM_METHODS = exports.MULTISIG_VIEW_METHODS = exports.MULTISIG_CHANGE_METHODS = exports.MULTISIG_DEPOSIT = exports.MULTISIG_GAS = exports.MULTISIG_ALLOWANCE = exports.MULTISIG_STORAGE_KEY = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const account_1 = require("./account");
const contract_1 = require("./contract");
const format_1 = require("./utils/format");
const key_pair_1 = require("./utils/key_pair");
const transaction_1 = require("./transaction");
const web_1 = require("./utils/web");
exports.MULTISIG_STORAGE_KEY = '__multisigRequest';
exports.MULTISIG_ALLOWANCE = new bn_js_1.default(format_1.parseNearAmount('1'));
exports.MULTISIG_GAS = new bn_js_1.default('100000000000000');
exports.MULTISIG_DEPOSIT = new bn_js_1.default('0');
exports.MULTISIG_CHANGE_METHODS = ['add_request', 'add_request_and_confirm', 'delete_request', 'confirm'];
exports.MULTISIG_VIEW_METHODS = ['get_request_nonce', 'list_request_ids'];
exports.MULTISIG_CONFIRM_METHODS = ['confirm'];
;
// in memory request cache for node w/o localStorage
let storageFallback = {
    [exports.MULTISIG_STORAGE_KEY]: null
};
class AccountMultisig extends account_1.Account {
    constructor(connection, accountId, options) {
        super(connection, accountId);
        this.storage = options.storage;
        this.onAddRequestResult = options.onAddRequestResult;
        this.contract = getContract(this);
    }
    async signAndSendTransactionWithAccount(receiverId, actions) {
        return super.signAndSendTransaction(receiverId, actions);
    }
    async signAndSendTransaction(receiverId, actions) {
        const { accountId } = this;
        if (this.isDeleteAction(actions)) {
            return await super.signAndSendTransaction(accountId, actions);
        }
        await this.deleteUnconfirmedRequests();
        const requestId = await this.getRequestNonce();
        this.setRequest({ accountId, requestId, actions });
        const args = Buffer.from(JSON.stringify({
            request: {
                receiver_id: receiverId,
                actions: convertActions(actions, accountId, receiverId)
            }
        }));
        const result = await super.signAndSendTransaction(accountId, [
            transaction_1.functionCall('add_request_and_confirm', args, exports.MULTISIG_GAS, exports.MULTISIG_DEPOSIT)
        ]);
        if (this.onAddRequestResult) {
            await this.onAddRequestResult(result);
        }
        return result;
    }
    async signAndSendTransactions(transactions) {
        for (let { receiverId, actions } of transactions) {
            await this.signAndSendTransaction(receiverId, actions);
        }
    }
    async deleteUnconfirmedRequests() {
        const { contract } = this;
        const request_ids = await this.getRequestIds();
        for (const request_id of request_ids) {
            try {
                await contract.delete_request({ request_id });
            }
            catch (e) {
                console.warn("Attempt to delete an earlier request before 15 minutes failed. Will try again.");
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
        if (this.storage) {
            return JSON.parse(this.storage.getItem(exports.MULTISIG_STORAGE_KEY) || `{}`);
        }
        return storageFallback[exports.MULTISIG_STORAGE_KEY];
    }
    setRequest(data) {
        if (this.storage) {
            return this.storage.setItem(exports.MULTISIG_STORAGE_KEY, JSON.stringify(data));
        }
        storageFallback[exports.MULTISIG_STORAGE_KEY] = data;
    }
}
exports.AccountMultisig = AccountMultisig;
class Account2FA extends AccountMultisig {
    constructor(connection, accountId, options) {
        super(connection, accountId, options);
        this.helperUrl = 'https://helper.testnet.near.org';
        this.helperUrl = options.helperUrl || this.helperUrl;
        this.storage = options.storage;
        this.sendCode = options.sendCode || this.sendCodeDefault;
        this.getCode = options.getCode || this.getCodeDefault;
        this.verifyCode = options.verifyCode || this.verifyCodeDefault;
        this.onConfirmResult = options.onConfirmResult;
        this.contract = getContract(this);
    }
    async signAndSendTransaction(receiverId, actions) {
        await super.signAndSendTransaction(receiverId, actions);
        await this.sendCode();
        const result = await this.promptAndVerify();
        if (this.onConfirmResult) {
            await this.onConfirmResult(result);
        }
        return result;
    }
    // default helpers for CH deployments of multisig
    async deployMultisig(contractBytes) {
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
            ...fak2lak.map((pk) => transaction_1.deleteKey(pk)),
            ...fak2lak.map((pk) => transaction_1.addKey(pk, transaction_1.functionCallAccessKey(accountId, exports.MULTISIG_CHANGE_METHODS, null))),
            transaction_1.addKey(confirmOnlyKey, transaction_1.functionCallAccessKey(accountId, exports.MULTISIG_CONFIRM_METHODS, null)),
            transaction_1.deployContract(contractBytes),
        ];
        if ((await this.state()).code_hash === '11111111111111111111111111111111') {
            actions.push(transaction_1.functionCall('new', newArgs, exports.MULTISIG_GAS, exports.MULTISIG_DEPOSIT));
        }
        console.log('deploying multisig contract for', accountId);
        return await super.signAndSendTransactionWithAccount(accountId, actions);
    }
    async disable(contractBytes) {
        const { accountId } = this;
        const accessKeys = await this.getAccessKeys();
        const lak2fak = accessKeys.filter(({ access_key }) => access_key && access_key.permission && access_key.permission.FunctionCall &&
            access_key.permission.FunctionCall.receiver_id === accountId &&
            access_key.permission.FunctionCall.method_names &&
            access_key.permission.FunctionCall.method_names.length === 4 &&
            access_key.permission.FunctionCall.method_names.includes('add_request_and_confirm'));
        const confirmOnlyKey = key_pair_1.PublicKey.from((await this.postSignedJson('/2fa/getAccessKey', { accountId })).publicKey);
        const actions = [
            transaction_1.deleteKey(confirmOnlyKey),
            ...lak2fak.map(({ public_key }) => transaction_1.deleteKey(public_key)),
            ...lak2fak.map(({ public_key }) => transaction_1.addKey(public_key, null)),
            transaction_1.deployContract(contractBytes),
        ];
        console.log('disabling 2fa for', accountId);
        return await this.signAndSendTransaction(accountId, actions);
    }
    async sendCodeDefault() {
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
    async getCodeDefault(method) {
        throw new Error('There is no getCode callback provided. Please provide your own in AccountMultisig constructor options. It has a parameter method where method.kind is "email" or "phone".');
    }
    async promptAndVerify() {
        const method = await this.get2faMethod();
        const securityCode = await this.getCode(method);
        try {
            const { success, res: result } = await this.verifyCode(securityCode);
            if (!success || result === false) {
                throw new Error('Request failed with error: ' + JSON.stringify(result));
            }
            return typeof result === 'string' && result.length === 0 ? 'true' : result;
        }
        catch (e) {
            console.warn('Error validating security code:', e);
            // TODO: Check if any other errors should be handled as non-recoverable
            if (e.toString().includes('2fa code expired')) {
                throw e;
            }
            return await this.promptAndVerify();
        }
    }
    async verifyCodeDefault(securityCode) {
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
        const block = await this.connection.provider.block({ finality: 'final' });
        const blockNumber = block.header.height.toString();
        const signed = await this.connection.signer.signMessage(Buffer.from(blockNumber), accountId, this.connection.networkId);
        const blockNumberSignature = Buffer.from(signed.signature).toString('base64');
        return { blockNumber, blockNumberSignature };
    }
    async postSignedJson(path, body) {
        return await web_1.fetchJson(this.helperUrl + path, JSON.stringify({
            ...body,
            ...(await this.signatureFor())
        }));
    }
}
exports.Account2FA = Account2FA;
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
        deposit: (deposit && deposit.toString()) || '0',
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
