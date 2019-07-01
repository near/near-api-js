'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// We use BN for only single purpose of encoding BigInt into Byte Array (and it's already used by tweetnacl so not an additional dependencies).
const bn_js_1 = __importDefault(require("bn.js"));
const protos_1 = require("./protos");
const serialize_1 = require("./utils/serialize");
const TRANSACTION_FIELD_MAP = {
    [protos_1.CreateAccountTransaction.name]: 'createAccount',
    [protos_1.DeployContractTransaction.name]: 'deployContract',
    [protos_1.FunctionCallTransaction.name]: 'functionCall',
    [protos_1.SendMoneyTransaction.name]: 'sendMoney',
    [protos_1.StakeTransaction.name]: 'stake',
    [protos_1.SwapKeyTransaction.name]: 'swapKey',
    [protos_1.AddKeyTransaction.name]: 'addKey',
    [protos_1.DeleteKeyTransaction.name]: 'deleteKey',
};
function bigInt(num) {
    const number = new Uint8Array((new bn_js_1.default(num.toString())).toArray('le', 16));
    return new protos_1.Uint128({ number });
}
function fromUint128(num) {
    return BigInt(`0x${num}`);
}
exports.fromUint128 = fromUint128;
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
        amount: bigInt(amount || BigInt(0)),
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
    const fieldName = TRANSACTION_FIELD_MAP[transaction.constructor.name];
    return new protos_1.SignedTransaction({
        signature: signature.signature,
        publicKey: protos_1.google.protobuf.BytesValue.create({ value: serialize_1.base_decode(signature.publicKey) }),
        [fieldName]: transaction,
    });
}
exports.signedTransaction = signedTransaction;
async function signTransaction(signer, transaction, accountId, networkId) {
    const protoClass = transaction.constructor;
    const txHash = protoClass.encode(transaction).finish();
    const signature = await signer.signMessage(txHash, accountId, networkId);
    return [txHash, signedTransaction(transaction, signature)];
}
exports.signTransaction = signTransaction;
