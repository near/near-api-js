'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_sha256_1 = __importDefault(require("js-sha256"));
const bn_js_1 = __importDefault(require("bn.js"));
const protos_1 = require("./protos");
const serialize_1 = require("./utils/serialize");
const TRANSACTION_FIELD_MAP = new Map([
    [protos_1.CreateAccountTransaction, 'createAccount'],
    [protos_1.DeployContractTransaction, 'deployContract'],
    [protos_1.FunctionCallTransaction, 'functionCall'],
    [protos_1.SendMoneyTransaction, 'sendMoney'],
    [protos_1.StakeTransaction, 'stake'],
    [protos_1.SwapKeyTransaction, 'swapKey'],
    [protos_1.AddKeyTransaction, 'addKey'],
    [protos_1.DeleteKeyTransaction, 'deleteKey'],
]);
function bigInt(num) {
    const number = new Uint8Array(new bn_js_1.default(num).toArray('le', 16));
    return new protos_1.Uint128({ number });
}
function bignumHex2Dec(num) {
    return new bn_js_1.default(num, 16).toString(10);
}
exports.bignumHex2Dec = bignumHex2Dec;
function createAccount(nonce, originator, newAccountId, publicKey, amount) {
    return new protos_1.CreateAccountTransaction({ nonce, originator, newAccountId, publicKey: serialize_1.base_decode(publicKey), amount: bigInt(amount) });
}
exports.createAccount = createAccount;
function deployContract(nonce, contractId, wasmByteArray) {
    return new protos_1.DeployContractTransaction({ nonce, contractId, wasmByteArray });
}
exports.deployContract = deployContract;
function functionCall(nonce, originator, contractId, methodName, args, amount) {
    return new protos_1.FunctionCallTransaction({ nonce, originator, contractId, methodName: Buffer.from(methodName), args, amount: bigInt(amount) });
}
exports.functionCall = functionCall;
function sendMoney(nonce, originator, receiver, amount) {
    return new protos_1.SendMoneyTransaction({ nonce, originator, receiver, amount: bigInt(amount) });
}
exports.sendMoney = sendMoney;
function stake(nonce, originator, amount, publicKey) {
    return new protos_1.StakeTransaction({ nonce, originator, amount: bigInt(amount), publicKey, blsPublicKey: null });
}
exports.stake = stake;
function swapKey(nonce, originator, curKey, newKey) {
    return new protos_1.SwapKeyTransaction({ nonce, originator, curKey: serialize_1.base_decode(curKey), newKey: serialize_1.base_decode(newKey) });
}
exports.swapKey = swapKey;
function createAccessKey(contractId, methodName, balanceOwner, amount) {
    return new protos_1.AccessKey({
        contractId: contractId ? new protos_1.google.protobuf.StringValue({ value: contractId }) : null,
        methodName: methodName ? new protos_1.google.protobuf.BytesValue({ value: Buffer.from(methodName) }) : null,
        balanceOwner: balanceOwner ? new protos_1.google.protobuf.StringValue({ value: balanceOwner }) : null,
        amount: bigInt(amount || new bn_js_1.default(0)),
    });
}
exports.createAccessKey = createAccessKey;
function addKey(nonce, originator, newKey, accessKey) {
    return new protos_1.AddKeyTransaction({ nonce, originator, newKey: serialize_1.base_decode(newKey), accessKey });
}
exports.addKey = addKey;
function deleteKey(nonce, originator, curKey) {
    return new protos_1.DeleteKeyTransaction({ nonce, originator, curKey: serialize_1.base_decode(curKey) });
}
exports.deleteKey = deleteKey;
function signedTransaction(transaction, signature) {
    const fieldName = TRANSACTION_FIELD_MAP.get(transaction.constructor);
    return new protos_1.SignedTransaction({
        signature: signature.signature,
        publicKey: protos_1.google.protobuf.BytesValue.create({ value: serialize_1.base_decode(signature.publicKey) }),
        [fieldName]: transaction,
    });
}
exports.signedTransaction = signedTransaction;
async function signTransaction(signer, transaction, accountId, networkId) {
    const protoClass = transaction.constructor;
    const message = protoClass.encode(transaction).finish();
    const hash = new Uint8Array(js_sha256_1.default.sha256.array(message));
    const signature = await signer.signHash(hash, accountId, networkId);
    return [hash, signedTransaction(transaction, signature)];
}
exports.signTransaction = signTransaction;
