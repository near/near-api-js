import { Signer } from './signer';
import { Transaction, PublicKey } from './protos';
declare enum KeyType {
    ED25519 = 0
}
declare class PublicKey {
    keyType: KeyType;
    data: Uint8Array;
    constructor(publicKey: string);
}
interface Action {
}
declare class Transaction {
    signerId: string;
    publicKey: PublicKey;
    nonce: number;
    receiverId: string;
    actions: Array<Action>;
    constructor(signedId: string, publicKey: string, nonce: number, receiverId: string, actions: Array<Action>);
}
declare class SignedTransaction {
    transaction: Transaction;
    signature: Uint8Array;
    constructor(transaction: Transaction, signature: Uint8Array);
}
export declare function signTransaction(receiverId: string, nonce: number, actions: Action[], signer: Signer, accountId?: string, networkId?: string): Promise<[Uint8Array, SignedTransaction]>;
export {};
