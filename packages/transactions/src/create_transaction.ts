import { PublicKey } from '@near-js/crypto';

import { Action } from './actions';
import { Transaction } from './schema';

export function createTransaction(signerId: string, publicKey: PublicKey, receiverId: string, nonce: bigint | string | number, actions: Action[], blockHash: Uint8Array): Transaction {
    const txNonce = typeof nonce === 'bigint' ? nonce : BigInt(nonce);
    return new Transaction({ signerId, publicKey, nonce: txNonce, receiverId, actions, blockHash });
}
