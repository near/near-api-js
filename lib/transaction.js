'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_sha256_1 = __importDefault(require("js-sha256"));
// import { Uint128, Action, AccessKey, PublicKey, SignedTransaction, Transaction, google } from './protos';
const serialize_1 = require("./utils/serialize");
// export type Action = Action;
// function bigInt(num: BN): Uint128 {
//     const number = new Uint8Array(new BN(num).toArray('le', 16));
//     return new Uint128({ number });
// }
// function toPublicKey(publicKey: string): PublicKey {
//     return new PublicKey({ keyType: PublicKey.KeyType.ED25519, data: base_decode(publicKey) })
// }
// export function bignumHex2Dec(num: string): string {
//     return new BN(num, 16).toString(10);
// }
// export function createAccount(): Action {
//     return new Action({ createAccount: new Action.CreateAccount() });
// }
// export function deployContract(code: Uint8Array): Action {
//     return new Action({ deployContract: new Action.DeployContract({code}) });
// }
// export function functionCall(methodName: string, args: Uint8Array, gas: number, deposit: BN): Action {
//     return new Action({ functionCall: new Action.FunctionCall({methodName, args, gas, deposit: bigInt(deposit) }) });
// }
// export function transfer(deposit: BN): Action {
//     return new Action({ transfer: new Action.Transfer({ deposit: bigInt(deposit) }) });
// }
// export function stake(stake: BN, publicKey: string): Action {
//     return new Action({ stake: new Action.Stake({ stake: bigInt(stake), publicKey: toPublicKey(publicKey) })});
// }
// export function createAccessKey(contractId?: string, methodName?: string, balanceOwner?: string, amount?: BN): AccessKey {
//     return new AccessKey({
//         contractId: contractId ? new google.protobuf.StringValue({ value: contractId }) : null,
//         methodName: methodName ? new google.protobuf.BytesValue({ value: Buffer.from(methodName) }) : null,
//         balanceOwner: balanceOwner ? new google.protobuf.StringValue({ value: balanceOwner }) : null,
//         amount: bigInt(amount || new BN(0)),
//     });
// }
// export function addKey(publicKey: string, accessKey: AccessKey): Action {
//     console.warn(accessKey);
//     return new Action({ addKey: new Action.AddKey({ publicKey: toPublicKey(publicKey), accessKey}) });
// }
// export function deleteKey(publicKey: string): Action {
//     return new Action({ deleteKey: new Action.DeleteKey({ publicKey: toPublicKey(publicKey) }) });
// }
// export function deleteAccount(beneficiaryId: string): Action {
//     return new Action({ deleteAccount: new Action.DeleteAccount({ beneficiaryId }) });
// }
// export function transaction(signerId: string, publicKey: string, nonce: number, receiverId: string, actions: Action[]): Transaction {
//     return new Transaction({ signerId, publicKey: toPublicKey(publicKey), nonce, receiverId, actions })
// }
// export function signedTransaction(transaction: Transaction, signature: Signature): SignedTransaction {
//     return new SignedTransaction({
//         signature: signature.signature,
//         transaction
//     });
// }
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
class Transaction {
    constructor(signedId, publicKey, nonce, receiverId, actions) {
        this.signerId = signedId;
        this.publicKey = new PublicKey(publicKey);
        this.nonce = nonce;
        this.receiverId = receiverId;
        this.actions = actions;
    }
}
class SignedTransaction {
    constructor(transaction, signature) {
        this.transaction = transaction;
        this.signature = signature;
    }
}
// const SCHEMA = {
//     'SignedTransaction': [['transaction', Transaction], ['signature', [32]]],
//     'Transaction': [['signerId', 'string'], ['publicKey', PublicKey], ['nonce', 'u64'], ['receiverId', 'string'], ['actions', [Action]]],
// }
async function signTransaction(receiverId, nonce, actions, signer, accountId, networkId) {
    console.warn("WTF?" + await signer.getPublicKey(accountId, networkId));
    // const tx = transaction(accountId, await signer.getPublicKey(accountId, networkId), nonce, receiverId, actions);
    const tx = new Transaction(accountId, await signer.getPublicKey(accountId, networkId), nonce, receiverId, actions);
    // console.warn(tx.publicKey);
    // console.warn("XX: " + JSON.stringify(tx));
    // const message = Transaction.encode(tx).finish();
    const message = tx.encode();
    console.warn("11: " + new Uint8Array(message));
    // const tx2 = Transaction.decode(message);
    // console.warn(JSON.stringify(tx2));
    // const message2 = Transaction.encode(tx2).finish();
    // console.warn("33: " + base_encode(message2));
    const hash = new Uint8Array(js_sha256_1.default.sha256.array(message));
    console.warn("22: " + serialize_1.base_encode(hash));
    const signature = await signer.signHash(hash, accountId, networkId);
    const signedTx = new SignedTransaction(tx, signature);
    // console.warn(JSON.stringify(signedTx));
    return [hash, signedTx];
}
exports.signTransaction = signTransaction;
