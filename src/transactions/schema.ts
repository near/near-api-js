import { deserialize, type Schema, serialize } from 'borsh';
import { PublicKey } from '../crypto/index.js';

import type { Action, SignedDelegate } from './actions.js';
import type { DelegateAction } from './delegate.js';
import { DelegateActionPrefix } from './prefix.js';
import type { Signature } from './signature.js';

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
    if ('signature' in transaction) {
        if (!isTransactionV1(transaction.transaction)) return serialize(SCHEMA.SignedTransaction, transaction);
        return serialize(SCHEMA.SignedTransactionV1, {
            transaction: toTransactionV1(transaction.transaction),
            signature: transaction.signature,
        });
    }
    if (!isTransactionV1(transaction)) return serialize(SCHEMA.Transaction, transaction);
    return serialize(SCHEMA.TransactionV1, toTransactionV1(transaction));
}

/**
 * Borsh-decode a Transaction instance from a buffer
 * @param bytes Uint8Array data to be decoded
 */
export function decodeTransaction(bytes: Uint8Array) {
    if (bytes[0] !== TRANSACTION_V1_PREFIX) {
        return new Transaction(deserialize(SCHEMA.Transaction, bytes) as Transaction);
    }
    return fromTransactionV1(deserialize(SCHEMA.TransactionV1, bytes) as TransactionV1Schema);
}

/**
 * Borsh-decode a SignedTransaction instance from a buffer
 * @param bytes Uint8Array data to be decoded
 */
export function decodeSignedTransaction(bytes: Uint8Array) {
    if (bytes[0] !== TRANSACTION_V1_PREFIX) {
        return new SignedTransaction(deserialize(SCHEMA.SignedTransaction, bytes) as SignedTransaction);
    }
    const { transaction, signature } = deserialize(SCHEMA.SignedTransactionV1, bytes) as {
        transaction: TransactionV1Schema;
        signature: Signature;
    };
    return new SignedTransaction({ transaction: fromTransactionV1(transaction), signature });
}

/**
 * `Transaction::V1` is prefixed with a single 0x01 byte, `Transaction::V0` has no prefix.
 * V0 starts with the u32 length of the signer id, which is never 1 since account ids have at least 2 characters.
 */
const TRANSACTION_V1_PREFIX = 1;

export type NonceMode = 'monotonic' | 'strict';

type TransactionV1Schema = Omit<Transaction, 'nonce' | 'nonceIndex' | 'nonceMode' | 'encode'> & {
    version: number;
    nonce: { nonce: { nonce: bigint } } | { gasKeyNonce: { nonce: bigint; nonceIndex: number } };
    nonceMode: { monotonic: object } | { strict: object };
};

function isTransactionV1(transaction: Transaction): boolean {
    return transaction.nonceIndex !== undefined || transaction.nonceMode !== undefined;
}

function toTransactionV1({
    signerId,
    publicKey,
    nonce,
    nonceIndex,
    nonceMode = 'monotonic',
    receiverId,
    blockHash,
    actions,
}: Transaction): TransactionV1Schema {
    return {
        version: TRANSACTION_V1_PREFIX,
        signerId,
        publicKey,
        nonce: nonceIndex === undefined ? { nonce: { nonce } } : { gasKeyNonce: { nonce, nonceIndex } },
        receiverId,
        blockHash,
        actions,
        nonceMode: nonceMode === 'strict' ? { strict: {} } : { monotonic: {} },
    };
}

function fromTransactionV1({ nonce, nonceMode, version: _version, ...rest }: TransactionV1Schema): Transaction {
    return new Transaction({
        ...rest,
        ...('gasKeyNonce' in nonce ? nonce.gasKeyNonce : nonce.nonce),
        nonceMode: 'strict' in nonceMode ? 'strict' : 'monotonic',
    });
}

export class Transaction {
    signerId: string;
    publicKey: PublicKey;
    nonce: bigint;
    receiverId: string;
    actions: Action[];
    blockHash: Uint8Array;
    /** Gas key nonce lane, setting it (or `nonceMode`) encodes the transaction as `TransactionV1` */
    nonceIndex?: number;
    nonceMode?: NonceMode;

    constructor({
        signerId,
        publicKey,
        nonce,
        receiverId,
        actions,
        blockHash,
        nonceIndex,
        nonceMode,
    }: {
        signerId: string;
        publicKey: PublicKey;
        nonce: bigint;
        receiverId: string;
        actions: Action[];
        blockHash: Uint8Array;
        nonceIndex?: number;
        nonceMode?: NonceMode;
    }) {
        this.signerId = signerId;
        this.publicKey = PublicKey.from(publicKey);
        this.nonce = nonce;
        this.receiverId = receiverId;
        this.actions = actions;
        this.blockHash = blockHash;
        if (nonceIndex !== undefined) this.nonceIndex = nonceIndex;
        if (nonceMode !== undefined) this.nonceMode = nonceMode;
    }

    encode(): Uint8Array {
        return encodeTransaction(this);
    }

    static decode(bytes: Uint8Array): Transaction {
        return decodeTransaction(bytes);
    }
}

export class SignedTransaction {
    transaction: Transaction;
    signature: Signature;

    constructor({ transaction, signature }: { transaction: Transaction; signature: Signature }) {
        this.transaction = transaction instanceof Transaction ? transaction : new Transaction(transaction);
        this.signature = signature;
    }

    encode(): Uint8Array {
        return encodeTransaction(this);
    }

    static decode(bytes: Uint8Array): SignedTransaction {
        return decodeSignedTransaction(bytes);
    }
}

export const SCHEMA = new (class BorshSchema {
    Ed25519Signature: Schema = {
        struct: {
            data: { array: { type: 'u8', len: 64 } },
        },
    };
    Secp256k1Signature: Schema = {
        struct: {
            data: { array: { type: 'u8', len: 65 } },
        },
    };
    MlDsa65Signature: Schema = {
        struct: {
            data: { array: { type: 'u8', len: 3309 } },
        },
    };
    Signature: Schema = {
        enum: [
            { struct: { ed25519Signature: this.Ed25519Signature } },
            { struct: { secp256k1Signature: this.Secp256k1Signature } },
            { struct: { mlDsa65Signature: this.MlDsa65Signature } },
        ],
    };
    Ed25519Data: Schema = {
        struct: {
            data: { array: { type: 'u8', len: 32 } },
        },
    };
    Secp256k1Data: Schema = {
        struct: {
            data: { array: { type: 'u8', len: 64 } },
        },
    };
    MlDsa65Data: Schema = {
        struct: {
            data: { array: { type: 'u8', len: 1952 } },
        },
    };
    PublicKey: Schema = {
        enum: [
            { struct: { ed25519Key: this.Ed25519Data } },
            { struct: { secp256k1Key: this.Secp256k1Data } },
            { struct: { mlDsa65Key: this.MlDsa65Data } },
        ],
    };
    FunctionCallPermission: Schema = {
        struct: {
            allowance: { option: 'u128' },
            receiverId: 'string',
            methodNames: { array: { type: 'string' } },
        },
    };
    FullAccessPermission: Schema = {
        struct: {},
    };
    GasKeyInfo: Schema = {
        struct: {
            balance: 'u128',
            numNonces: 'u16',
        },
    };
    GasKeyFunctionCallPermission: Schema = {
        struct: {
            gasKeyInfo: this.GasKeyInfo,
            functionCall: this.FunctionCallPermission,
        },
    };
    AccessKeyPermission: Schema = {
        enum: [
            { struct: { functionCall: this.FunctionCallPermission } },
            { struct: { fullAccess: this.FullAccessPermission } },
            { struct: { gasKeyFunctionCall: this.GasKeyFunctionCallPermission } },
            { struct: { gasKeyFullAccess: this.GasKeyInfo } },
        ],
    };
    AccessKey: Schema = {
        struct: {
            nonce: 'u64',
            permission: this.AccessKeyPermission,
        },
    };
    CreateAccount: Schema = {
        struct: {},
    };
    DeployContract: Schema = {
        struct: {
            code: { array: { type: 'u8' } },
        },
    };
    FunctionCall: Schema = {
        struct: {
            methodName: 'string',
            args: { array: { type: 'u8' } },
            gas: 'u64',
            deposit: 'u128',
        },
    };
    Transfer: Schema = {
        struct: {
            deposit: 'u128',
        },
    };
    Stake: Schema = {
        struct: {
            stake: 'u128',
            publicKey: this.PublicKey,
        },
    };
    AddKey: Schema = {
        struct: {
            publicKey: this.PublicKey,
            accessKey: this.AccessKey,
        },
    };
    DeleteKey: Schema = {
        struct: {
            publicKey: this.PublicKey,
        },
    };
    DeleteAccount: Schema = {
        struct: {
            beneficiaryId: 'string',
        },
    };
    GlobalContractDeployMode: Schema = {
        enum: [{ struct: { CodeHash: { struct: {} } } }, { struct: { AccountId: { struct: {} } } }],
    };
    GlobalContractIdentifier: Schema = {
        enum: [{ struct: { CodeHash: { array: { type: 'u8', len: 32 } } } }, { struct: { AccountId: 'string' } }],
    };
    DeployGlobalContract: Schema = {
        struct: {
            code: { array: { type: 'u8' } },
            deployMode: this.GlobalContractDeployMode,
        },
    };
    UseGlobalContract: Schema = {
        struct: {
            contractIdentifier: this.GlobalContractIdentifier,
        },
    };
    TransferToGasKey: Schema = {
        struct: {
            publicKey: this.PublicKey,
            deposit: 'u128',
        },
    };
    WithdrawFromGasKey: Schema = {
        struct: {
            publicKey: this.PublicKey,
            amount: 'u128',
        },
    };
    DelegateActionPrefix: Schema = {
        struct: {
            prefix: 'u32',
        },
    };
    /** @todo: get rid of "ClassicActions" and keep only "Action" schema to be consistent with "nearcore" */
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
            { struct: { signedDelegate: 'string' } }, // placeholder to keep the right enum order, should not be used
            { struct: { deployGlobalContract: this.DeployGlobalContract } },
            { struct: { useGlobalContract: this.UseGlobalContract } },
            { struct: { deterministicStateInit: 'string' } }, // placeholder to keep the right enum order, should not be used
            { struct: { transferToGasKey: this.TransferToGasKey } },
            { struct: { withdrawFromGasKey: this.WithdrawFromGasKey } },
        ],
    };
    DelegateAction: Schema = {
        struct: {
            senderId: 'string',
            receiverId: 'string',
            actions: { array: { type: this.ClassicActions } },
            nonce: 'u64',
            maxBlockHeight: 'u64',
            publicKey: this.PublicKey,
        },
    };
    SignedDelegate: Schema = {
        struct: {
            delegateAction: this.DelegateAction,
            signature: this.Signature,
        },
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
            { struct: { deployGlobalContract: this.DeployGlobalContract } },
            { struct: { useGlobalContract: this.UseGlobalContract } },
            { struct: { deterministicStateInit: 'string' } }, // placeholder to keep the right enum order, should not be used
            { struct: { transferToGasKey: this.TransferToGasKey } },
            { struct: { withdrawFromGasKey: this.WithdrawFromGasKey } },
        ],
    };
    Transaction: Schema = {
        struct: {
            signerId: 'string',
            publicKey: this.PublicKey,
            nonce: 'u64',
            receiverId: 'string',
            blockHash: { array: { type: 'u8', len: 32 } },
            actions: { array: { type: this.Action } },
        },
    };
    SignedTransaction: Schema = {
        struct: {
            transaction: this.Transaction,
            signature: this.Signature,
        },
    };
    TransactionNonce: Schema = {
        enum: [
            { struct: { nonce: { struct: { nonce: 'u64' } } } },
            { struct: { gasKeyNonce: { struct: { nonce: 'u64', nonceIndex: 'u16' } } } },
        ],
    };
    NonceMode: Schema = {
        enum: [{ struct: { monotonic: { struct: {} } } }, { struct: { strict: { struct: {} } } }],
    };
    /** `version` models the 0x01 prefix of `Transaction::V1` so plain borsh produces the signed bytes */
    TransactionV1: Schema = {
        struct: {
            version: 'u8',
            signerId: 'string',
            publicKey: this.PublicKey,
            nonce: this.TransactionNonce,
            receiverId: 'string',
            blockHash: { array: { type: 'u8', len: 32 } },
            actions: { array: { type: this.Action } },
            nonceMode: this.NonceMode,
        },
    };
    SignedTransactionV1: Schema = {
        struct: {
            transaction: this.TransactionV1,
            signature: this.Signature,
        },
    };
})();
