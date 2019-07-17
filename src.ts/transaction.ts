'use strict';

import sha256 from 'js-sha256';
import BN from 'bn.js';

import { Uint128, SendMoneyTransaction, CreateAccountTransaction,
    SignedTransaction, DeployContractTransaction, FunctionCallTransaction,
    StakeTransaction, SwapKeyTransaction, AddKeyTransaction,
    DeleteKeyTransaction, AccessKey,
    google} from './protos';
import { base_decode } from './utils/serialize';
import { Signature } from './utils/key_pair';
import { Signer } from './signer';

const TRANSACTION_FIELD_MAP = new Map<Function, string>([
    [CreateAccountTransaction, 'createAccount'],
    [DeployContractTransaction, 'deployContract'],
    [FunctionCallTransaction, 'functionCall'],
    [SendMoneyTransaction, 'sendMoney'],
    [StakeTransaction, 'stake'],
    [SwapKeyTransaction, 'swapKey'],
    [AddKeyTransaction, 'addKey'],
    [DeleteKeyTransaction, 'deleteKey'],
]);

export type AllTransactions = SendMoneyTransaction | CreateAccountTransaction | DeployContractTransaction | FunctionCallTransaction | StakeTransaction | SwapKeyTransaction | AddKeyTransaction | DeleteKeyTransaction;

function bigInt(num: BN): Uint128 {
    const number = new Uint8Array(new BN(num).toArray('le', 16));
    return new Uint128({ number });
}

export function bignumHex2Dec(num: string): string {
    return new BN(num, 16).toString(10);
}

export function createAccount(nonce: number, originator: string, newAccountId: string, publicKey: string, amount: BN): CreateAccountTransaction {
    return new CreateAccountTransaction({nonce, originator, newAccountId, publicKey: base_decode(publicKey), amount: bigInt(amount)});
}

export function deployContract(nonce: number, contractId: string, wasmByteArray: Uint8Array): DeployContractTransaction {
    return new DeployContractTransaction({nonce, contractId, wasmByteArray});
}

export function functionCall(nonce: number, originator: string, contractId: string, methodName: string, args: Uint8Array, amount: BN): FunctionCallTransaction {
    return new FunctionCallTransaction({nonce, originator, contractId, methodName: Buffer.from(methodName), args, amount: bigInt(amount) });
}

export function sendMoney(nonce: number, originator: string, receiver: string, amount: BN): SendMoneyTransaction {
    return new SendMoneyTransaction({ nonce, originator, receiver, amount: bigInt(amount) });
}

export function stake(nonce: number, originator: string, amount: BN, publicKey: string): StakeTransaction {
    return new StakeTransaction({ nonce, originator, amount: bigInt(amount), publicKey, blsPublicKey: null });
}

export function swapKey(nonce: number, originator: string, curKey: string, newKey: string): SwapKeyTransaction {
    return new SwapKeyTransaction({ nonce, originator, curKey: base_decode(curKey), newKey: base_decode(newKey) });
}

export function createAccessKey(contractId?: string, methodName?: string, balanceOwner?: string, amount?: BN): AccessKey {
    return new AccessKey({
        contractId: contractId ? new google.protobuf.StringValue({ value: contractId }) : null,
        methodName: methodName ? new google.protobuf.BytesValue({ value: Buffer.from(methodName) }) : null,
        balanceOwner: balanceOwner ? new google.protobuf.StringValue({ value: balanceOwner }) : null,
        amount: bigInt(amount || new BN(0)),
    });
}

export function addKey(nonce: number, originator: string, newKey: string, accessKey: AccessKey): AddKeyTransaction {
    return new AddKeyTransaction({ nonce, originator, newKey: base_decode(newKey), accessKey});
}

export function deleteKey(nonce: number, originator: string, curKey: string): DeleteKeyTransaction {
    return new DeleteKeyTransaction({ nonce, originator, curKey: base_decode(curKey) });
}

export function signedTransaction(transaction: AllTransactions, signature: Signature): SignedTransaction {
    const fieldName = TRANSACTION_FIELD_MAP.get(transaction.constructor);
    return new SignedTransaction({
        signature: signature.signature,
        publicKey: google.protobuf.BytesValue.create({ value: base_decode(signature.publicKey) }),
        [fieldName]: transaction,
    });
}

export async function signTransaction(signer: Signer, transaction: any, accountId?: string, networkId?: string): Promise<[Uint8Array, SignedTransaction]> {
    const protoClass = transaction.constructor;
    const message = protoClass.encode(transaction).finish();
    const hash = new Uint8Array(sha256.sha256.array(message));
    const signature = await signer.signHash(hash, accountId, networkId);
    return [hash, signedTransaction(transaction, signature)];
}
