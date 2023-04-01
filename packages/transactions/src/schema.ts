import { PublicKey } from '@near-js/crypto';
import { Assignable } from '@near-js/types';
import { deserialize, serialize } from 'borsh';
import BN from 'bn.js';

import {
    Action,
    AccessKey,
    AccessKeyPermission,
    AddKey,
    CreateAccount,
    DeleteAccount,
    DeleteKey,
    DeployContract,
    FullAccessPermission,
    FunctionCall,
    FunctionCallPermission,
    SignedDelegate,
    Stake,
    Transfer,
} from './actions';
import { DelegateAction } from './delegated';
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
        ...serialize(SCHEMA, new DelegateActionPrefix()),
        ...serialize(SCHEMA, delegateAction),
    ]);
}

export function encodeTransaction(transaction: Transaction | SignedTransaction) {
    return serialize(SCHEMA, transaction);
}

/**
 * Borsh-decode a Transaction instance from a buffer
 * @param bytes Buffer data to be decoded
 */
export function decodeTransaction(bytes: Buffer) {
    return deserialize(SCHEMA, Transaction, bytes);
}

/**
 * Borsh-decode a SignedTransaction instance from a buffer
 * @param bytes Buffer data to be decoded
 */
export function decodeSignedTransaction(bytes: Buffer) {
    return deserialize(SCHEMA, SignedTransaction, bytes);
}

export class Transaction extends Assignable {
    signerId: string;
    publicKey: PublicKey;
    nonce: BN;
    receiverId: string;
    actions: Action[];
    blockHash: Uint8Array;

    encode() {
        return encodeTransaction(this);
    }

    static decode(bytes: Buffer) {
        return decodeTransaction(bytes);
    }
}

export class SignedTransaction extends Assignable {
    transaction: Transaction;
    signature: Signature;

    encode() {
        return encodeTransaction(this);
    }

    static decode(bytes: Buffer) {
        return decodeSignedTransaction(bytes);
    }
}

type Class<T = any> = new (...args: any[]) => T;

export const SCHEMA = new Map<Class, any>([
    [Signature, {kind: 'struct', fields: [
        ['keyType', 'u8'],
        ['data', [64]]
    ]}],
    [SignedTransaction, {kind: 'struct', fields: [
        ['transaction', Transaction],
        ['signature', Signature]
    ]}],
    [Transaction, { kind: 'struct', fields: [
        ['signerId', 'string'],
        ['publicKey', PublicKey],
        ['nonce', 'u64'],
        ['receiverId', 'string'],
        ['blockHash', [32]],
        ['actions', [Action]]
    ]}],
    [PublicKey, { kind: 'struct', fields: [
        ['keyType', 'u8'],
        ['data', [32]]
    ]}],
    [AccessKey, { kind: 'struct', fields: [
        ['nonce', 'u64'],
        ['permission', AccessKeyPermission],
    ]}],
    [AccessKeyPermission, {kind: 'enum', field: 'enum', values: [
        ['functionCall', FunctionCallPermission],
        ['fullAccess', FullAccessPermission],
    ]}],
    [FunctionCallPermission, {kind: 'struct', fields: [
        ['allowance', {kind: 'option', type: 'u128'}],
        ['receiverId', 'string'],
        ['methodNames', ['string']],
    ]}],
    [FullAccessPermission, {kind: 'struct', fields: []}],
    [Action, {kind: 'enum', field: 'enum', values: [
        ['createAccount', CreateAccount],
        ['deployContract', DeployContract],
        ['functionCall', FunctionCall],
        ['transfer', Transfer],
        ['stake', Stake],
        ['addKey', AddKey],
        ['deleteKey', DeleteKey],
        ['deleteAccount', DeleteAccount],
        ['signedDelegate', DeleteAccount],
    ]}],
    [CreateAccount, { kind: 'struct', fields: [] }],
    [DeployContract, { kind: 'struct', fields: [
        ['code', ['u8']]
    ]}],
    [FunctionCall, { kind: 'struct', fields: [
        ['methodName', 'string'],
        ['args', ['u8']],
        ['gas', 'u64'],
        ['deposit', 'u128']
    ]}],
    [Transfer, { kind: 'struct', fields: [
        ['deposit', 'u128']
    ]}],
    [Stake, { kind: 'struct', fields: [
        ['stake', 'u128'],
        ['publicKey', PublicKey]
    ]}],
    [AddKey, { kind: 'struct', fields: [
        ['publicKey', PublicKey],
        ['accessKey', AccessKey]
    ]}],
    [DeleteKey, { kind: 'struct', fields: [
        ['publicKey', PublicKey]
    ]}],
    [DeleteAccount, { kind: 'struct', fields: [
        ['beneficiaryId', 'string']
    ]}],
    [DelegateAction, { kind: 'struct', fields: [
        ['senderId', 'string'],
        ['receiverId', 'string'],
        ['actions', [Action]],
        ['nonce', 'u64'],
        ['maxBlockHeight', 'u64'],
        ['publicKey', PublicKey],
    ]}],
    [DelegateActionPrefix, { kind: 'struct', fields: [
        ['prefix', 'u32'],
    ]}],
    [SignedDelegate, { kind: 'struct', fields: [
        ['delegateAction', DelegateAction],
        ['signature', Signature],
    ]}],
]);
