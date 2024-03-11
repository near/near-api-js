import { PublicKey } from '@near-js/crypto';
import { Assignable } from '@near-js/types';
import { deserialize, serialize, Schema } from 'borsh';
import BN from 'bn.js';

import {
    Action,
    SignedDelegate,
} from './actions';
import { DelegateAction } from './delegate';
import { DelegateActionPrefix } from './prefix';
import { Signature } from './signature';

/**
 * Borsh-encode a delegate action for inclusion as an action within a meta transaction
 * NB per NEP-461 this requires a Borsh-serialized prefix specific to delegate actions, ensuring
 *  signed delegate actions may never be identical to signed transactions with the same fields
 * @param delegateAction Delegate action to be signed by the meta transaction sender
 */
export function encodeDelegateAction(delegateAction: DelegateAction) {
    return new Uint8Array([
        ...serialize(SCHEMA.DelegateActionPrefix, new DelegateActionPrefix()),
        ...serialize(SCHEMA.DelegateAction, delegateAction),
    ]);
}

/**
 * Borsh-encode a signed delegate for validation and execution by a relayer
 * @param signedDelegate Signed delegate to be executed in a meta transaction
 */
export function encodeSignedDelegate(signedDelegate: SignedDelegate) {
    return serialize(SCHEMA.SignedDelegate, signedDelegate);
}

/**
* Borsh-encode a transaction or signed transaction into a serialized form.
* @param transaction The transaction or signed transaction object to be encoded.
* @returns A serialized representation of the input transaction.
*/
export function encodeTransaction(transaction: Transaction | SignedTransaction) {
    const schema: Schema = transaction instanceof SignedTransaction ? SCHEMA.SignedTransaction : SCHEMA.Transaction;
    return serialize(schema, transaction);
}

/**
 * Borsh-decode a Transaction instance from a buffer
 * @param bytes Uint8Array data to be decoded
 */
export function decodeTransaction(bytes: Uint8Array) {
    return new Transaction(deserialize(SCHEMA.Transaction, bytes));
}

/**
 * Borsh-decode a SignedTransaction instance from a buffer
 * @param bytes Uint8Array data to be decoded
 */
export function decodeSignedTransaction(bytes: Uint8Array) {
    return new SignedTransaction(deserialize(SCHEMA.SignedTransaction, bytes));
}

export class Transaction extends Assignable {
    signerId: string;
    publicKey: PublicKey;
    nonce: BN;
    receiverId: string;
    actions: Action[];
    blockHash: Uint8Array;

    encode(): Uint8Array {
        return encodeTransaction(this);
    }

    static decode(bytes: Uint8Array): Transaction {
        return decodeTransaction(bytes);
    }
}

export class SignedTransaction extends Assignable {
    transaction: Transaction;
    signature: Signature;

    encode(): Uint8Array{
        return encodeTransaction(this);
    }

    static decode(bytes: Uint8Array): SignedTransaction {
        return decodeSignedTransaction(bytes);
    }
}

export const SCHEMA = new class BorshSchema {
    Signature: Schema = {
        struct: {
            keyType: 'u8',
            data: { array: { type: 'u8', len: 64 } },
        }
    };
    PublicKey: Schema = {
        struct: {
            keyType: 'u8',
            data: { array: { type: 'u8', len: 32 } },
        }
    };
    FunctionCallPermission: Schema = {
        struct: {
            allowance: { option: 'u128' },
            receiverId: 'string',
            methodNames: { array: { type: 'string' } },
        }
    };
    FullAccessPermission: Schema = {
        struct: {}
    };
    AccessKeyPermission: Schema = {
        enum: [
            { struct: { functionCall: this.FunctionCallPermission } },
            { struct: { fullAccess: this.FullAccessPermission } },
        ]
    };
    AccessKey: Schema = {
        struct: {
            nonce: 'u64',
            permission: this.AccessKeyPermission,
        }
    };
    CreateAccount: Schema = {
        struct: {}
    };
    DeployContract: Schema = {
        struct: {
            code: { array: { type: 'u8' } },
        }
    };
    FunctionCall: Schema = {
        struct: {
            methodName: 'string',
            args: { array: { type: 'u8' } },
            gas: 'u64',
            deposit: 'u128',
        }
    };
    Transfer: Schema = {
        struct: {
            deposit: 'u128',
        }
    };
    Stake: Schema = {
        struct: {
            stake: 'u128',
            publicKey: this.PublicKey,
        }
    };
    AddKey: Schema = {
        struct: {
            publicKey: this.PublicKey,
            accessKey: this.AccessKey,
        }
    };
    DeleteKey: Schema = {
        struct: {
            publicKey: this.PublicKey,
        }
    };
    DeleteAccount: Schema = {
        struct: {
            beneficiaryId: 'string',
        }
    };
    DelegateActionPrefix: Schema = {
        struct: {
            prefix: 'u32',
        }
    };
    ClassicActions: Schema = {
        enum: [
            { struct: { createAccount: this.CreateAccount } },
            { struct: { deployContract: this.DeployContract } },
            { struct: { functionCall: this.FunctionCall } },
            { struct: { transfer: this.Transfer } },
            { struct: { stake: this.Stake } },
            { struct: { addKey: this.AddKey } },
            { struct: { deleteKey: this.DeleteKey } },
            { struct: { deleteAccount: this.DeleteAccount } },
        ]
    };
    DelegateAction: Schema = {
        struct: {
            senderId: 'string',
            receiverId: 'string',
            actions: { array: { type: this.ClassicActions } },
            nonce: 'u64',
            maxBlockHeight: 'u64',
            publicKey: this.PublicKey,
        }
    };
    SignedDelegate: Schema = {
        struct: {
            delegateAction: this.DelegateAction,
            signature: this.Signature,
        }
    };
    Action: Schema = {
        enum: [
            { struct: { createAccount: this.CreateAccount } },
            { struct: { deployContract: this.DeployContract } },
            { struct: { functionCall: this.FunctionCall } },
            { struct: { transfer: this.Transfer } },
            { struct: { stake: this.Stake } },
            { struct: { addKey: this.AddKey } },
            { struct: { deleteKey: this.DeleteKey } },
            { struct: { deleteAccount: this.DeleteAccount } },
            { struct: { signedDelegate: this.SignedDelegate } },
        ]
    };
    Transaction: Schema = {
        struct: {
            signerId: 'string',
            publicKey: this.PublicKey,
            nonce: 'u64',
            receiverId: 'string',
            blockHash: { array: { type: 'u8', len: 32 } },
            actions: { array: { type: this.Action } },
        }
    };
    SignedTransaction: Schema = {
        struct: {
            transaction: this.Transaction,
            signature: this.Signature,
        }
    };
};
