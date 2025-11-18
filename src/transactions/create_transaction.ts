import { PublicKey } from '../crypto';

import { Action } from './actions';
import { Transaction } from './schema';

export interface CreateTransactionParams {
    /** The NEAR account ID of the transaction signer. */
    signerId: string;
    /** The public key associated with the signer. */
    publicKey: PublicKey;
    /** The NEAR account ID of the transaction receiver. */
    receiverId: string;
    /** The nonce value for the transaction, represented as a BN, string, or number. */
    nonce: bigint | string | number;
    /** An array of transaction actions to be performed. */
    actions: Action[];
    /** The hash of the block where the transaction will be included. */
    blockHash: Uint8Array;
}

/**
 * Creates a new transaction object with the provided parameters.
 * @param params Transaction creation parameters
 * @returns A new transaction object initialized with the provided parameters.
 */
export function createTransaction(params: CreateTransactionParams): Transaction {
    const { signerId, publicKey, receiverId, nonce, actions, blockHash } = params;
    const txNonce = typeof nonce === 'bigint' ? nonce : BigInt(nonce);
    return new Transaction({
        signerId,
        publicKey,
        nonce: txNonce,
        receiverId,
        actions,
        blockHash,
    });
}
