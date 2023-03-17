import { PublicKey } from '@near-js/crypto';
import { Assignable } from '@near-js/types';
import BN from 'bn.js';

import {
    CreateAccount,
    DeployContract,
    FunctionCall,
    Transfer,
    Stake,
    AddKey,
    DeleteKey,
    DeleteAccount,
} from './actions.js';

export type NonDelegateAction =
    AddKey
    | CreateAccount
    | DeleteAccount
    | DeleteKey
    | DeployContract
    | FunctionCall
    | Stake
    | Transfer;

export class DelegateAction extends Assignable {
    senderId: string;
    receiverId: string;
    actions: Array<NonDelegateAction>;
    nonce: BN;
    maxBlockHeight: number;
    publicKey: PublicKey;
}
