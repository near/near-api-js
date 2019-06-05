"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uint128_pb_1 = require("./protos/uint128_pb");
const signed_transaction_pb_1 = require("./protos/signed_transaction_pb");
function bigInt(num) {
    let x = new uint128_pb_1.Uint128();
    x.setNumber(Buffer.from(num.toString(16), 'hex'));
    return x;
}
function sendMoney(nonce, originator, receiver, amount) {
    let tx = new signed_transaction_pb_1.SendMoneyTransaction();
    tx.setNonce(nonce);
    tx.setOriginator(originator);
    tx.setReceiver(receiver);
    tx.setAmount(bigInt(amount));
    return tx;
}
exports.sendMoney = sendMoney;
function createAccount(originator, newAccountId, publicKey, amount) {
    let tx = new signed_transaction_pb_1.CreateAccountTransaction();
    tx.setOriginator(originator);
    tx.setNewAccountId(newAccountId);
    tx.setPublicKey(publicKey);
    tx.setAmount(bigInt(amount));
    return tx;
}
exports.createAccount = createAccount;
function signedTransaction(transaction, signature) {
    let signedTx = new signed_transaction_pb_1.SignedTransaction();
    signedTx.setSignature(signature);
    switch (transaction.constructor) {
        case signed_transaction_pb_1.SendMoneyTransaction:
            signedTx.setSendMoney(transaction);
            break;
    }
    return signedTx;
}
exports.signedTransaction = signedTransaction;
