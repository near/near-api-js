import { b } from '@zorsh/zorsh';
import type { PublicKey } from '../crypto/index.js';

import type { Action, SignedDelegate } from './actions.js';
import type { DelegateAction } from './delegate.js';
import { DelegateActionPrefix } from './prefix.js';
import type { Signature } from './signature.js';

/**
 * Recursively converts numeric values to BigInt for zorsh serialization.
 * Only converts specific monetary/counter fields (deposit, stake, gas, nonce, etc.).
 * Preserves enum values like keyType which should remain as regular numbers.
 */
function ensureBigInt(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'bigint') return obj;
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'boolean') return obj;
    if (obj instanceof Uint8Array) return obj;

    if (Array.isArray(obj)) {
        return obj.map(ensureBigInt);
    }

    if (typeof obj === 'object') {
        // Preserve the prototype chain for class instances
        const result: any = Object.create(Object.getPrototypeOf(obj));
        for (const [key, value] of Object.entries(obj)) {
            // Exclude keyType from BigInt conversion (it's an enum value: 0 or 1)
            if (key === 'keyType') {
                result[key] = value;
            }
            // Convert specific monetary/counter fields to BigInt
            else if (['deposit', 'stake', 'gas', 'nonce', 'allowance', 'maxBlockHeight'].includes(key)) {
                if (value === undefined) {
                    // zorsh expects null for optional fields, not undefined
                    result[key] = null;
                } else if (value === null) {
                    result[key] = null;
                } else if (typeof value === 'number' || typeof value === 'bigint') {
                    result[key] = BigInt(value);
                } else {
                    result[key] = value;
                }
            }
            // Recurse for everything else
            else {
                result[key] = ensureBigInt(value);
            }
        }
        return result;
    }

    // For primitive numbers at the top level, convert to BigInt
    if (typeof obj === 'number') {
        return BigInt(obj);
    }

    return obj;
}

/**
 * Borsh-encode a delegate action for inclusion as an action within a meta transaction
 * NB per NEP-461 this requires a Borsh-serialized prefix specific to delegate actions, ensuring
 *  signed delegate actions may never be identical to signed transactions with the same fields
 * @param delegateAction Delegate action to be signed by the meta transaction sender
 */
export function encodeDelegateAction(delegateAction: DelegateAction) {
    return new Uint8Array([
        ...SCHEMA.DelegateActionPrefix.serialize(new DelegateActionPrefix()),
        ...SCHEMA.DelegateAction.serialize(ensureBigInt(delegateAction)),
    ]);
}

/**
 * Borsh-encode a signed delegate for validation and execution by a relayer
 * @param signedDelegate Signed delegate to be executed in a meta transaction
 */
export function encodeSignedDelegate(signedDelegate: SignedDelegate) {
    return SCHEMA.SignedDelegate.serialize(ensureBigInt(signedDelegate));
}

/**
 * Borsh-encode a transaction or signed transaction into a serialized form.
 * @param transaction The transaction or signed transaction object to be encoded.
 * @returns A serialized representation of the input transaction.
 */
export function encodeTransaction(transaction: Transaction | SignedTransaction) {
    const schema = 'signature' in transaction ? SCHEMA.SignedTransaction : SCHEMA.Transaction;
    return schema.serialize(ensureBigInt(transaction));
}

/**
 * Borsh-decode a Transaction instance from a buffer
 * @param bytes Uint8Array data to be decoded
 */
export function decodeTransaction(bytes: Uint8Array) {
    return new Transaction(SCHEMA.Transaction.deserialize(bytes) as Transaction);
}

/**
 * Borsh-decode a SignedTransaction instance from a buffer
 * @param bytes Uint8Array data to be decoded
 */
export function decodeSignedTransaction(bytes: Uint8Array) {
    return new SignedTransaction(SCHEMA.SignedTransaction.deserialize(bytes) as SignedTransaction);
}

export class Transaction {
    signerId: string;
    publicKey: PublicKey;
    nonce: bigint;
    receiverId: string;
    actions: Action[];
    blockHash: Uint8Array;

    constructor({
        signerId,
        publicKey,
        nonce,
        receiverId,
        actions,
        blockHash,
    }: {
        signerId: string;
        publicKey: PublicKey;
        nonce: bigint;
        receiverId: string;
        actions: Action[];
        blockHash: Uint8Array;
    }) {
        this.signerId = signerId;
        this.publicKey = publicKey;
        this.nonce = nonce;
        this.receiverId = receiverId;
        this.actions = actions;
        this.blockHash = blockHash;
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
        this.transaction = transaction;
        this.signature = signature;
    }

    encode(): Uint8Array {
        return encodeTransaction(this);
    }

    static decode(bytes: Uint8Array): SignedTransaction {
        return decodeSignedTransaction(bytes);
    }
}

// Define schemas using zorsh builder API
const Ed25519SignatureSchema = b.struct({
    data: b.bytes(64),
});

const Secp256k1SignatureSchema = b.struct({
    data: b.bytes(65),
});

const SignatureSchema = b.enum({
    ed25519Signature: Ed25519SignatureSchema,
    secp256k1Signature: Secp256k1SignatureSchema,
});

const Ed25519DataSchema = b.struct({
    data: b.bytes(32),
});

const Secp256k1DataSchema = b.struct({
    data: b.bytes(64),
});

const PublicKeySchema = b.enum({
    ed25519Key: Ed25519DataSchema,
    secp256k1Key: Secp256k1DataSchema,
});

const FunctionCallPermissionSchema = b.struct({
    allowance: b.option(b.u128()),
    receiverId: b.string(),
    methodNames: b.vec(b.string()),
});

const FullAccessPermissionSchema = b.struct({});

const AccessKeyPermissionSchema = b.enum({
    functionCall: FunctionCallPermissionSchema,
    fullAccess: FullAccessPermissionSchema,
});

const AccessKeySchema = b.struct({
    nonce: b.u64(),
    permission: AccessKeyPermissionSchema,
});

const CreateAccountSchema = b.struct({});

const DeployContractSchema = b.struct({
    code: b.bytes(),
});

const FunctionCallSchema = b.struct({
    methodName: b.string(),
    args: b.bytes(),
    gas: b.u64(),
    deposit: b.u128(),
});

const TransferSchema = b.struct({
    deposit: b.u128(),
});

const StakeSchema = b.struct({
    stake: b.u128(),
    publicKey: PublicKeySchema,
});

const AddKeySchema = b.struct({
    publicKey: PublicKeySchema,
    accessKey: AccessKeySchema,
});

const DeleteKeySchema = b.struct({
    publicKey: PublicKeySchema,
});

const DeleteAccountSchema = b.struct({
    beneficiaryId: b.string(),
});

const GlobalContractDeployModeSchema = b.enum({
    CodeHash: b.struct({}),
    AccountId: b.struct({}),
});

const GlobalContractIdentifierSchema = b.enum({
    CodeHash: b.bytes(32),
    AccountId: b.string(),
});

const DeployGlobalContractSchema = b.struct({
    code: b.bytes(),
    deployMode: GlobalContractDeployModeSchema,
});

const UseGlobalContractSchema = b.struct({
    contractIdentifier: GlobalContractIdentifierSchema,
});

const DelegateActionPrefixSchema = b.struct({
    prefix: b.u32(),
});

/** @todo: get rid of "ClassicActions" and keep only "Action" schema to be consistent with "nearcore" */
const ClassicActionsSchema = b.enum({
    createAccount: CreateAccountSchema,
    deployContract: DeployContractSchema,
    functionCall: FunctionCallSchema,
    transfer: TransferSchema,
    stake: StakeSchema,
    addKey: AddKeySchema,
    deleteKey: DeleteKeySchema,
    deleteAccount: DeleteAccountSchema,
    signedDelegate: b.string(), // placeholder to keep the right enum order, should not be used
    deployGlobalContract: DeployGlobalContractSchema,
    useGlobalContract: UseGlobalContractSchema,
});

const DelegateActionSchema = b.struct({
    senderId: b.string(),
    receiverId: b.string(),
    actions: b.vec(ClassicActionsSchema),
    nonce: b.u64(),
    maxBlockHeight: b.u64(),
    publicKey: PublicKeySchema,
});

const SignedDelegateSchema = b.struct({
    delegateAction: DelegateActionSchema,
    signature: SignatureSchema,
});

const ActionSchema = b.enum({
    createAccount: CreateAccountSchema,
    deployContract: DeployContractSchema,
    functionCall: FunctionCallSchema,
    transfer: TransferSchema,
    stake: StakeSchema,
    addKey: AddKeySchema,
    deleteKey: DeleteKeySchema,
    deleteAccount: DeleteAccountSchema,
    signedDelegate: SignedDelegateSchema,
    deployGlobalContract: DeployGlobalContractSchema,
    useGlobalContract: UseGlobalContractSchema,
});

const TransactionSchema = b.struct({
    signerId: b.string(),
    publicKey: PublicKeySchema,
    nonce: b.u64(),
    receiverId: b.string(),
    blockHash: b.bytes(32),
    actions: b.vec(ActionSchema),
});

const SignedTransactionSchema = b.struct({
    transaction: TransactionSchema,
    signature: SignatureSchema,
});

// Export SCHEMA object for backward compatibility
export const SCHEMA = {
    Ed25519Signature: Ed25519SignatureSchema,
    Secp256k1Signature: Secp256k1SignatureSchema,
    Signature: SignatureSchema,
    Ed25519Data: Ed25519DataSchema,
    Secp256k1Data: Secp256k1DataSchema,
    PublicKey: PublicKeySchema,
    FunctionCallPermission: FunctionCallPermissionSchema,
    FullAccessPermission: FullAccessPermissionSchema,
    AccessKeyPermission: AccessKeyPermissionSchema,
    AccessKey: AccessKeySchema,
    CreateAccount: CreateAccountSchema,
    DeployContract: DeployContractSchema,
    FunctionCall: FunctionCallSchema,
    Transfer: TransferSchema,
    Stake: StakeSchema,
    AddKey: AddKeySchema,
    DeleteKey: DeleteKeySchema,
    DeleteAccount: DeleteAccountSchema,
    GlobalContractDeployMode: GlobalContractDeployModeSchema,
    GlobalContractIdentifier: GlobalContractIdentifierSchema,
    DeployGlobalContract: DeployGlobalContractSchema,
    UseGlobalContract: UseGlobalContractSchema,
    DelegateActionPrefix: DelegateActionPrefixSchema,
    ClassicActions: ClassicActionsSchema,
    DelegateAction: DelegateActionSchema,
    SignedDelegate: SignedDelegateSchema,
    Action: ActionSchema,
    Transaction: TransactionSchema,
    SignedTransaction: SignedTransactionSchema,
};
