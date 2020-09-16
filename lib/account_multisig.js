'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultisigContract = exports.AccountMultisig = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const account_1 = require("./account");
const contract_1 = require("./contract");
const format_1 = require("./utils/format");
const transaction_1 = require("./transaction");
const MULTISIG_DEPOSIT = new bn_js_1.default('0');
const MULTISIG_ALLOWANCE = process.env.WALLET_2FA_ALLOWANCE || format_1.parseNearAmount('1');
const MULTISIG_GAS = new bn_js_1.default(process.env.WALLET_2FA_ALLOWANCE || '100000000000000');
const METHOD_NAMES_LAK = ['add_request', 'add_request_and_confirm', 'delete_request', 'confirm'];
const VIEW_METHODS = ['get_request_nonce', 'list_request_ids'];
class AccountMultisig extends account_1.Account {
    constructor(connection, accountId) {
        super(connection, accountId);
        this.contract = getContract(this);
    }
    async signAndSendTransaction(receiverId, actions) {
        const { accountId } = this;
        const args = new Uint8Array(new TextEncoder().encode(JSON.stringify({
            request: {
                receiver_id: receiverId,
                actions: convertActions(actions, accountId, receiverId)
            }
        })));
        return super.signAndSendTransaction(accountId, [
            transaction_1.functionCall('add_request_and_confirm', args, MULTISIG_GAS, MULTISIG_DEPOSIT)
        ]);
    }
}
exports.AccountMultisig = AccountMultisig;
// define function multisig contract functions for TypeScript
class MultisigContract extends contract_1.Contract {
    get_request_nonce() {
        return this.get_request_nonce();
    }
    list_request_ids() {
        return this.list_request_ids();
    }
}
exports.MultisigContract = MultisigContract;
// helpers
const getContract = (account) => {
    return new MultisigContract(account, account.accountId, {
        viewMethods: VIEW_METHODS,
        changeMethods: METHOD_NAMES_LAK,
    });
};
const convertPKForContract = (pk) => {
    if (typeof pk !== 'string') {
        pk = pk.toString();
    }
    return pk.replace('ed25519:', '');
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
                method_names: METHOD_NAMES_LAK,
            };
        }
        if (accessKey.permission.enum === 'functionCall') {
            const { receiverId: receiver_id, methodNames: method_names, allowance, } = action.accessKey.permission.functionCall;
            action.permission = { receiver_id, allowance, method_names };
        }
    }
    return action;
});
