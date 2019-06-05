import { Uint128 } from './protos/uint128_pb';
import { SendMoneyTransaction, CreateAccountTransaction, SignedTransaction } from './protos/signed_transaction_pb'

function bigInt(num: bigint): Uint128 {
    let x = new Uint128();
    x.setNumber(Buffer.from(num.toString(16), 'hex'));
    return x;
}

export function sendMoney(nonce: number, originator: string, receiver: string, amount: bigint): SendMoneyTransaction {
    let tx = new SendMoneyTransaction();
    tx.setNonce(nonce);
    tx.setOriginator(originator);
    tx.setReceiver(receiver);
    tx.setAmount(bigInt(amount));
    return tx;
}

export function createAccount(originator: string, newAccountId: string, publicKey: string, amount: bigint): CreateAccountTransaction {
    let tx = new CreateAccountTransaction();
    tx.setOriginator(originator);
    tx.setNewAccountId(newAccountId);
    tx.setPublicKey(publicKey);
    tx.setAmount(bigInt(amount));
    return tx;
}

export function signedTransaction(transaction: SendMoneyTransaction, signature: Uint8Array): SignedTransaction {
    let signedTx = new SignedTransaction();
    signedTx.setSignature(signature);
    switch (transaction.constructor) {
        case SendMoneyTransaction: signedTx.setSendMoney(transaction); break;
    }
    return signedTx;
}
