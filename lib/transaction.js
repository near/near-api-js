'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_sha256_1 = __importDefault(require("js-sha256"));
const serialize_1 = require("./utils/serialize");
class Enum {
    constructor(properties) {
        if (Object.keys(properties).length != 1) {
            throw new Error("Enum can only take single value");
        }
        Object.keys(properties).map((key) => {
            this[key] = properties[key];
            this.enum = key;
        });
    }
}
class Assignable {
    constructor(properties) {
        Object.keys(properties).map((key) => {
            this[key] = properties[key];
        });
    }
}
class FunctionCallPermission extends Assignable {
}
exports.FunctionCallPermission = FunctionCallPermission;
class FullAccessPermission extends Assignable {
}
exports.FullAccessPermission = FullAccessPermission;
class AccessKeyPermission extends Enum {
}
exports.AccessKeyPermission = AccessKeyPermission;
class AccessKey extends Assignable {
}
exports.AccessKey = AccessKey;
function fullAccessKey() {
    return new AccessKey({ nonce: 0, permission: new AccessKeyPermission({ fullAccess: new FullAccessPermission({}) }) });
}
exports.fullAccessKey = fullAccessKey;
function functionCallAccessKey(receiverId, methodNames, allowance) {
    return new AccessKey({ nonce: 0, permission: new AccessKeyPermission({ functionCall: new FunctionCallPermission({ receiverId, allowance, methodNames }) }) });
}
exports.functionCallAccessKey = functionCallAccessKey;
class IAction extends Assignable {
}
exports.IAction = IAction;
class CreateAccount extends IAction {
}
class DeployContract extends IAction {
}
class FunctionCall extends IAction {
}
class Transfer extends IAction {
}
class Stake extends IAction {
}
class AddKey extends IAction {
}
class DeleteKey extends IAction {
}
class DeleteAccount extends IAction {
}
function createAccount() {
    return new Action({ createAccount: new CreateAccount({}) });
}
exports.createAccount = createAccount;
function deployContract(code) {
    return new Action({ deployContract: new DeployContract({ code }) });
}
exports.deployContract = deployContract;
function functionCall(methodName, args, gas, deposit) {
    return new Action({ functionCall: new FunctionCall({ methodName, args, gas, deposit }) });
}
exports.functionCall = functionCall;
function transfer(deposit) {
    return new Action({ transfer: new Transfer({ deposit }) });
}
exports.transfer = transfer;
function stake(stake, publicKey) {
    return new Action({ stake: new Stake({ stake, publicKey: new PublicKey(publicKey) }) });
}
exports.stake = stake;
function addKey(publicKey, accessKey) {
    return new Action({ addKey: new AddKey({ publicKey: new PublicKey(publicKey), accessKey }) });
}
exports.addKey = addKey;
function deleteKey(publicKey) {
    return new Action({ deleteKey: new DeleteKey({ publicKey: new PublicKey(publicKey) }) });
}
exports.deleteKey = deleteKey;
function deleteAccount(beneficiaryId) {
    return new Action({ deleteAccount: new DeleteAccount({ beneficiaryId }) });
}
exports.deleteAccount = deleteAccount;
var KeyType;
(function (KeyType) {
    KeyType[KeyType["ED25519"] = 0] = "ED25519";
})(KeyType || (KeyType = {}));
class PublicKey {
    constructor(publicKey) {
        this.keyType = KeyType.ED25519;
        this.data = serialize_1.base_decode(publicKey);
    }
}
class Transaction extends Assignable {
}
class SignedTransaction extends Assignable {
    encode() {
        return serialize_1.serialize(SCHEMA, this);
    }
}
exports.SignedTransaction = SignedTransaction;
class Action extends Enum {
}
exports.Action = Action;
const SCHEMA = {
    'SignedTransaction': { kind: 'struct', fields: [['transaction', Transaction], ['signature', [32]]] },
    'Transaction': {
        kind: 'struct', fields: [['signerId', 'string'], ['publicKey', PublicKey], ['nonce', 'u64'], ['receiverId', 'string'], ['actions', [Action]]]
    },
    'PublicKey': {
        kind: 'struct', fields: [['keyType', 'u8'], ['data', [32]]]
    },
    'AccessKey': { kind: 'struct', fields: [
            ['nonce', 'u64'],
            ['permission', AccessKeyPermission],
        ] },
    'AccessKeyPermission': { kind: 'enum', field: 'enum', values: [
            ['functionCall', FunctionCallPermission],
            ['fullAccess', FullAccessPermission],
        ] },
    'FunctionCallPermission': { kind: 'struct', fields: [
            ['allowance', { kind: 'option', type: 'u128' }],
            ['receiverId', 'string'],
            ['methodNames', ['string']],
        ] },
    'FullAccessPermission': { kind: 'struct', fields: [] },
    'Action': { kind: 'enum', field: 'enum', values: [
            ['createAccount', CreateAccount],
            ['deployContract', DeployContract],
            ['functionCall', functionCall],
            ['transfer', transfer],
            ['stake', stake],
            ['addKey', addKey],
            ['deleteKey', deleteKey],
            ['deleteAccount', deleteAccount],
        ] },
    'CreateAccount': { kind: 'struct', fields: [] },
    'DeployContract': { kind: 'struct', fields: [['code', ['u8']]] },
    'FunctionCall': { kind: 'struct', fields: [['methodName', 'string'], ['args', ['u8']], ['gas', 'u64'], ['deposit', 'u128']] },
    'Transfer': { kind: 'struct', fields: [['deposit', 'u128']] },
    'Stake': { kind: 'struct', fields: [['stake', 'u128'], ['publicKey', PublicKey]] },
    'AddKey': { kind: 'struct', fields: [['publicKey', PublicKey], ['accessKey', AccessKey]] },
    'DeleteKey': { kind: 'struct', fields: [['publicKey', PublicKey]] },
    'DeleteAccount': { kind: 'struct', fields: [['beneficiaryId', 'string']] },
};
async function signTransaction(receiverId, nonce, actions, signer, accountId, networkId) {
    const publicKey = new PublicKey(await signer.getPublicKey(accountId, networkId));
    const transaction = new Transaction({ signerId: accountId, publicKey, nonce, receiverId, actions });
    const message = serialize_1.serialize(SCHEMA, transaction);
    const hash = new Uint8Array(js_sha256_1.default.sha256.array(message));
    const signature = await signer.signHash(hash, accountId, networkId);
    const signedTx = new SignedTransaction({ transaction, signature: signature.signature });
    return [hash, signedTx];
}
exports.signTransaction = signTransaction;
