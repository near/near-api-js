import { Signer } from '@near-js/signers';
import sha256 from 'js-sha256';
import BN from 'bn.js';

import { Action } from './actions';
import { createTransaction } from './create_transaction';
import { encodeTransaction } from './serialization';
import { Signature } from './signature';
import { SignedTransaction, Transaction } from './transaction';

/**
 * Signs a given transaction from an account with given keys, applied to the given network
 * @param transaction The Transaction object to sign
 * @param signer The {Signer} object that assists with signing keys
 * @param accountId The human-readable NEAR account name
 * @param networkId The targeted network. (ex. default, betanet, etc…)
 */
async function signTransactionObject(transaction: Transaction, signer: Signer, accountId?: string, networkId?: string): Promise<[Uint8Array, SignedTransaction]> {
    const message = encodeTransaction(transaction);
    const hash = new Uint8Array(sha256.sha256.array(message));
    const signature = await signer.signMessage(message, accountId, networkId);
    const signedTx = new SignedTransaction({
        transaction,
        signature: new Signature({ keyType: transaction.publicKey.keyType, data: signature.signature })
    });
    return [hash, signedTx];
}

export async function signTransaction(transaction: Transaction, signer: Signer, accountId?: string, networkId?: string): Promise<[Uint8Array, SignedTransaction]>;
export async function signTransaction(receiverId: string, nonce: BN, actions: Action[], blockHash: Uint8Array, signer: Signer, accountId?: string, networkId?: string): Promise<[Uint8Array, SignedTransaction]>;
export async function signTransaction(...args): Promise<[Uint8Array, SignedTransaction]> {
    if (args[0].constructor === Transaction) {
        const [ transaction, signer, accountId, networkId ] = args;
        return signTransactionObject(transaction, signer, accountId, networkId);
    } else {
        const [ receiverId, nonce, actions, blockHash, signer, accountId, networkId ] = args;
        const publicKey = await signer.getPublicKey(accountId, networkId);
        const transaction = createTransaction(accountId, publicKey, receiverId, nonce, actions, blockHash);
        return signTransactionObject(transaction, signer, accountId, networkId);
    }
}
