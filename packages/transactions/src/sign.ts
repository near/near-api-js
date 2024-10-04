import { Signer } from '@near-js/signers';
import { sha256 } from '@noble/hashes/sha256';

import {Action, ISignedDelegate, SignedDelegate} from './actions.js';
import { createTransaction } from './create_transaction.js';
import type { DelegateAction } from './delegate.js';
import {
  encodeDelegateAction,
  encodeTransaction,
  ISignedTransaction,
  ITransaction,
  SignedTransaction, Transaction
} from './schema.js';
import {createSignature, ISignatureTx} from './ISignatureTx';
// can't use import type here because we're referencing the variants
import { KeyType } from '@near-js/crypto';
import { IDelegateAction } from "./types.js";

interface MessageSigner {
    sign(message: Uint8Array): Promise<Uint8Array>;
}

interface SignDelegateOptions {
    delegateAction: IDelegateAction;
    signer: MessageSigner;
}

export interface SignedDelegateWithHash {
    hash: Uint8Array;
    signedDelegateAction: SignedDelegate;
}

/**
 * Signs a given transaction from an account with given keys, applied to the given network
 * @param transaction The Transaction object to sign
 * @param signer The {Signer} object that assists with signing keys
 * @param accountId The human-readable NEAR account name
 * @param networkId The targeted network. (ex. default, betanet, etc…)
 */
async function signTransactionObject(transaction: Transaction, signer: Signer, accountId?: string, networkId?: string): Promise<[Uint8Array, SignedTransaction]> {
    const message = encodeTransaction(transaction);
    const hash = new Uint8Array(sha256(message));
    const signature = await signer.signMessage(message, accountId, networkId);
    const keyType = transaction.publicKey.ed25519Key ? KeyType.ED25519 : KeyType.SECP256K1;
    const signedTx = new SignedTransaction({
        transaction,
        signature: createSignature({ keyType, data: signature.signature })
    });
    return [hash, signedTx];
}

export async function signTransaction(transaction: Transaction, signer: Signer, accountId?: string, networkId?: string): Promise<[Uint8Array, SignedTransaction]>;

export async function signTransaction(receiverId: string, nonce: bigint, actions: Action[], blockHash: Uint8Array, signer: Signer, accountId?: string, networkId?: string): Promise<[Uint8Array, SignedTransaction]>;

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

/**
 * Sign a delegate action
 * @options SignDelegate options
 * @param options.delegateAction Delegate action to be signed by the meta transaction sender
 * @param options.signer Signer instance for the meta transaction sender
 */
export async function signDelegateAction({ delegateAction, signer }: SignDelegateOptions): Promise<SignedDelegateWithHash> {
    const message = encodeDelegateAction(delegateAction);
    const signature = await signer.sign(message);

    const keyType = delegateAction.publicKey.ed25519Key ? KeyType.ED25519 : KeyType.SECP256K1;
    const delegateSignature = createSignature({
      keyType,
      data: signature,
    })
    const signedDelegateAction: ISignedDelegate = {
        delegateAction,
        signature: delegateSignature
    };

    return {
        hash: new Uint8Array(sha256(message)),
        signedDelegateAction,
    };
}
