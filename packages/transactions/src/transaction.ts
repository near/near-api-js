import { PublicKey } from '@near-js/crypto';
import { Assignable } from '@near-js/types';
import BN from 'bn.js';

import { Action } from './actions.js';
import { Signature } from './signature.js';

/* TODO move these classes to @near-js/types after removing the methods that rely on the borsch schema */

export class Transaction extends Assignable {
    signerId: string;
    publicKey: PublicKey;
    nonce: BN;
    receiverId: string;
    actions: Action[];
    blockHash: Uint8Array;
}

export class SignedTransaction extends Assignable {
    transaction: Transaction;
    signature: Signature;
}
