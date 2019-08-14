'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_sha256_1 = __importDefault(require("js-sha256"));
const bn_js_1 = __importDefault(require("bn.js"));
const protos_1 = require("./protos");
const serialize_1 = require("./utils/serialize");
function bigInt(num) {
    const number = new Uint8Array(new bn_js_1.default(num).toArray('le', 16));
    return new protos_1.Uint128({ number });
}
function toPublicKey(publicKey) {
    return new protos_1.PublicKey({ keyType: protos_1.PublicKey.KeyType.ED25519, data: serialize_1.base_decode(publicKey) });
}
function bignumHex2Dec(num) {
    return new bn_js_1.default(num, 16).toString(10);
}
exports.bignumHex2Dec = bignumHex2Dec;
function createAccount() {
    return new protos_1.Action({ createAccount: new protos_1.Action.CreateAccount() });
}
exports.createAccount = createAccount;
function deployContract(code) {
    return new protos_1.Action({ deployContract: new protos_1.Action.DeployContract({ code }) });
}
exports.deployContract = deployContract;
function functionCall(methodName, args, gas, deposit) {
    return new protos_1.Action({ functionCall: new protos_1.Action.FunctionCall({ methodName, args, gas, deposit: bigInt(deposit) }) });
}
exports.functionCall = functionCall;
function transfer(deposit) {
    return new protos_1.Action({ transfer: new protos_1.Action.Transfer({ deposit: bigInt(deposit) }) });
}
exports.transfer = transfer;
function stake(stake, publicKey) {
    return new protos_1.Action({ stake: new protos_1.Action.Stake({ stake: bigInt(stake), publicKey: toPublicKey(publicKey) }) });
}
exports.stake = stake;
function createAccessKey(contractId, methodName, balanceOwner, amount) {
    return new protos_1.AccessKey({
        contractId: contractId ? new protos_1.google.protobuf.StringValue({ value: contractId }) : null,
        methodName: methodName ? new protos_1.google.protobuf.BytesValue({ value: Buffer.from(methodName) }) : null,
        balanceOwner: balanceOwner ? new protos_1.google.protobuf.StringValue({ value: balanceOwner }) : null,
        amount: bigInt(amount || new bn_js_1.default(0)),
    });
}
exports.createAccessKey = createAccessKey;
function addKey(publicKey, accessKey) {
    console.warn(accessKey);
    return new protos_1.Action({ addKey: new protos_1.Action.AddKey({ publicKey: toPublicKey(publicKey), accessKey }) });
}
exports.addKey = addKey;
function deleteKey(publicKey) {
    return new protos_1.Action({ deleteKey: new protos_1.Action.DeleteKey({ publicKey: toPublicKey(publicKey) }) });
}
exports.deleteKey = deleteKey;
function deleteAccount(beneficiaryId) {
    return new protos_1.Action({ deleteAccount: new protos_1.Action.DeleteAccount({ beneficiaryId }) });
}
exports.deleteAccount = deleteAccount;
function transaction(signerId, publicKey, nonce, receiverId, actions) {
    return new protos_1.Transaction({ signerId, publicKey: toPublicKey(publicKey), nonce, receiverId, actions });
}
exports.transaction = transaction;
function signedTransaction(transaction, signature) {
    return new protos_1.SignedTransaction({
        signature: signature.signature,
        transaction
    });
}
exports.signedTransaction = signedTransaction;
async function signTransaction(receiverId, nonce, actions, signer, accountId, networkId) {
    console.warn("WTF?" + await signer.getPublicKey(accountId, networkId));
    const tx = transaction(accountId, await signer.getPublicKey(accountId, networkId), nonce, receiverId, actions);
    console.warn(tx.publicKey);
    console.warn("XX: " + JSON.stringify(tx));
    const message = protos_1.Transaction.encode(tx).finish();
    console.warn("11: " + new Uint8Array(message));
    const tx2 = protos_1.Transaction.decode(message);
    console.warn(JSON.stringify(tx2));
    const message2 = protos_1.Transaction.encode(tx2).finish();
    console.warn("33: " + serialize_1.base_encode(message2));
    const hash = new Uint8Array(js_sha256_1.default.sha256.array(message));
    console.warn("22: " + serialize_1.base_encode(hash));
    const signature = await signer.signHash(hash, accountId, networkId);
    const signedTx = signedTransaction(tx, signature);
    console.warn(JSON.stringify(signedTx));
    return [hash, signedTx];
}
exports.signTransaction = signTransaction;
