import BN from 'bn.js';

import { PublicKey } from '../key_pair';
import { Action } from './actions';
import { Transaction } from './schema';

export function createTransaction(signerId: string, publicKey: PublicKey, receiverId: string, nonce: BN | string | number, actions: Action[], blockHash: Uint8Array): Transaction {
    return new Transaction({ signerId, publicKey, nonce, receiverId, actions, blockHash });
}
