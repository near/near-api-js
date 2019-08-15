'use strict';

import sha256 from 'js-sha256';
import BN from 'bn.js';

import { base_decode, serialize } from './utils/serialize';
import { Signer } from './signer';

export class Assignable {
    constructor(properties: any) {
        Object.keys(properties).map((key: any) => {
            (this as any)[key] = properties[key];
        });
    }
}

export class AccessKey extends Assignable { 
    contractId: string; methodName: Uint8Array; balanceOwner: string; amount: BN 
}

export function createAccessKey(contractId?: string, methodName?: string, balanceOwner?: string, amount?: BN): AccessKey {
    return new AccessKey({
        contractId,
        methodName,
        balanceOwner,
        amount: amount || new BN(0),
    });
}

export class IAction extends Assignable {}

class CreateAccount extends IAction {}
class DeployContract extends IAction { code: Uint8Array }
class FunctionCall extends IAction { methodName: string; args: Uint8Array; gas: BN; deposit: BN }
class Transfer extends IAction { deposit: BN }
class Stake extends IAction { stake: BN; publicKey: PublicKey }
class AddKey extends IAction { publicKey: PublicKey; accessKey: AccessKey }
class DeleteKey extends IAction { publicKey: PublicKey }
class DeleteAccount extends IAction { beneficiaryId: string }

export function createAccount(): Action {
    return new Action({createAccount: new CreateAccount({}) });
}

export function deployContract(code: Uint8Array): Action {
    return new Action({ deployContract: new DeployContract({code}) });
}

export function functionCall(methodName: string, args: Uint8Array, gas: number, deposit: BN): Action {
    return new Action({functionCall: new FunctionCall({methodName, args, gas, deposit }) });
}

export function transfer(deposit: BN): Action {
    return new Action({transfer: new Transfer({ deposit }) });
}

export function stake(stake: BN, publicKey: string): Action {
    return new Action({stake: new Stake({ stake, publicKey: new PublicKey(publicKey) }) });
}

export function addKey(publicKey: string, accessKey: AccessKey): Action {
    return new Action({addKey: new AddKey({ publicKey: new PublicKey(publicKey), accessKey}) });
}

export function deleteKey(publicKey: string): Action {
    return new Action({deleteKey: new DeleteKey({ publicKey: new PublicKey(publicKey) }) });
}

export function deleteAccount(beneficiaryId: string): Action {
    return new Action({deleteAccount: new DeleteAccount({ beneficiaryId }) });
}

enum KeyType {
    ED25519 = 0,
}

class PublicKey {
    keyType: KeyType;
    data: Uint8Array;

    constructor(publicKey: string) {
        this.keyType = KeyType.ED25519;
        this.data = base_decode(publicKey);
    }
}

class Transaction extends Assignable {
    signerId: string;
    publicKey: PublicKey;
    nonce: number;
    receiverId: string;
    actions: Array<Action>;
}

export class SignedTransaction extends Assignable {
    transaction: Transaction;
    signature: Uint8Array;

    encode(): Uint8Array {
        return serialize(SCHEMA, this);
    }
}

export class Action {
    action: string;
    createAccount: CreateAccount;
    deployContract: DeployContract;
    functionCall: FunctionCall;
    transfer: Transfer;
    stake: Stake;
    addKey: AddKey;
    deleteKey: DeleteKey;
    deleteAccount: DeleteAccount;

    constructor(properties: any) {
        if (Object.keys(properties).length != 1) {
            throw new Error("Action can only take single value");
        }
        Object.keys(properties).map((key: string) => {
            (this as any)[key] = properties[key];
            this.action = key;
        });
    }
}

const SCHEMA = {
    'SignedTransaction': {kind: 'struct', fields: [['transaction', Transaction], ['signature', [32]]]},
    'Transaction': {
        kind: 'struct', fields: [['signerId', 'string'], ['publicKey', PublicKey], ['nonce', 'u64'], ['receiverId', 'string'], ['actions', [Action]]] },
    'PublicKey': {
            kind: 'struct', fields: [['keyType', 'u8'], ['data', [32]]] },
    'AccessKey': { kind: 'struct', fields: [
        ['amount', 'u128'],
        ['balanceOwner', { kind: 'option', type: 'string' }], 
        ['contractId', {kind: 'option', type: 'string'}], 
        ['methodName', {kind: 'option', type: ['u8']}], 
    ]},
    'Action': {kind: 'enum', field: 'action', values: [
        ['createAccount', CreateAccount], 
        ['deployContract', DeployContract],
        ['functionCall', functionCall],
        ['transfer', transfer],
        ['stake', stake],
        ['addKey', addKey],
        ['deleteKey', deleteKey],
        ['deleteAccount', deleteAccount],
    ]},
    'CreateAccount': { kind: 'struct', fields: [] },
    'DeployContract': { kind: 'struct', fields: [['code', ['u8']]] },
    'FunctionCall': { kind: 'struct', fields: [['methodName', 'string'], ['args', ['u8']], ['gas', 'u64'], ['deposit', 'u128']] },
    'Transfer': { kind: 'struct', fields: [['deposit', 'u128']] },
    'Stake': { kind: 'struct', fields: [['stake', 'u128'], ['publicKey', PublicKey]] },
    'AddKey': { kind: 'struct', fields: [['publicKey', PublicKey], ['accessKey', AccessKey]] },
    'DeleteKey': { kind: 'struct', fields: [['publicKey', PublicKey]] },
    'DeleteAccount': { kind: 'struct', fields: [['beneficiaryId', 'string']] },
}

export async function signTransaction(receiverId: string, nonce: number, actions: Action[], signer: Signer, accountId?: string, networkId?: string): Promise<[Uint8Array, SignedTransaction]> {
    const publicKey = new PublicKey(await signer.getPublicKey(accountId, networkId));
    const transaction = new Transaction({ signerId: accountId, publicKey, nonce, receiverId, actions });
    const message = serialize(SCHEMA, transaction);
    const hash = new Uint8Array(sha256.sha256.array(message));
    const signature = await signer.signHash(hash, accountId, networkId);
    const signedTx = new SignedTransaction({transaction, signature: signature.signature });
    return [hash, signedTx];
}
