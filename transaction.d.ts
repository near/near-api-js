import { SendMoneyTransaction, SignedTransaction } from './protos/signed_transaction_pb';
import { CreateAccountTransaction } from './signed_transaction_pb';
export declare function sendMoney(nonce: number, originator: string, receiver: string, amount: bigint): SendMoneyTransaction;
export declare function createAccount(originator: string, newAccountId: string, publicKey: string, amount: bigint): CreateAccountTransaction;
export declare function signedTransaction(transaction: SendMoneyTransaction, signature: Uint8Array): SignedTransaction;
