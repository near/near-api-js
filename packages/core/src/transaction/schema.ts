import BN from 'bn.js';
import { deserialize, serialize } from 'borsh';

import { KeyType, PublicKey } from '../key_pair';
import { Assignable } from '../types';
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
    Stake,
    Transfer,
} from './actions';

export class Signature extends Assignable {
    keyType: KeyType;
    data: Uint8Array;
}

export class Transaction extends Assignable {
    signerId: string;
    publicKey: PublicKey;
    nonce: BN;
    receiverId: string;
    actions: Action[];
    blockHash: Uint8Array;

    encode(): Uint8Array {
        return serialize(SCHEMA, this);
    }

    static decode(bytes: Buffer): Transaction {
        return deserialize(SCHEMA, Transaction, bytes);
    }
}

export class SignedTransaction extends Assignable {
    transaction: Transaction;
    signature: Signature;

    encode(): Uint8Array {
        return serialize(SCHEMA, this);
    }

    static decode(bytes: Buffer): SignedTransaction {
        return deserialize(SCHEMA, SignedTransaction, bytes);
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
]);
