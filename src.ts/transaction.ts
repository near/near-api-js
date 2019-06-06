'use strict';

import BN from "bn.js";
import { Uint128, SendMoneyTransaction, CreateAccountTransaction, 
    SignedTransaction, DeployContractTransaction, FunctionCallTransaction, 
    StakeTransaction, SwapKeyTransaction, AddKeyTransaction,
    DeleteKeyTransaction, AccessKey,
    google} from './protos';
import { base_decode } from './utils/serialize';
import { Signature } from './utils/key_pair';
import { Signer } from './signer';

const TRANSACTION_FIELD_MAP = {
    [CreateAccountTransaction.name]: 'createAccount',
    [DeployContractTransaction.name]: 'deployContract',
    [FunctionCallTransaction.name]: 'functionCall',
    [SendMoneyTransaction.name]: 'sendMoney',
    [StakeTransaction.name]: 'stake',
    [SwapKeyTransaction.name]: 'swapKey',
    [AddKeyTransaction.name]: 'addKey',
    [DeleteKeyTransaction.name]: 'deleteKey',
};

export type AllTransactions = SendMoneyTransaction | CreateAccountTransaction | DeployContractTransaction | FunctionCallTransaction | StakeTransaction | SwapKeyTransaction | AddKeyTransaction | DeleteKeyTransaction;

function bigInt(num: bigint): Uint128 {
    const number = new Uint8Array((new BN(num.toString())).toArray('le', 16));
    return new Uint128({ number });
}

export function fromUint128(num: string): bigint {
    return BigInt(`0x${num}`);
}

export function createAccount(nonce: number, originator: string, newAccountId: string, publicKey: string, amount: bigint): CreateAccountTransaction {
    return new CreateAccountTransaction({nonce, originator, newAccountId, publicKey: base_decode(publicKey), amount: bigInt(amount)});
}

export function deployContract(nonce: number, contractId: string, wasmByteArray: Uint8Array): DeployContractTransaction {
    return new DeployContractTransaction({nonce, contractId, wasmByteArray});
}

export function functionCall(nonce: number, originator: string, contractId: string, methodName: string, args: Uint8Array, amount: bigint): FunctionCallTransaction {
    return new FunctionCallTransaction({nonce, originator, contractId, methodName: Buffer.from(methodName), amount: bigInt(amount) });
}

export function sendMoney(nonce: number, originator: string, receiver: string, amount: bigint): SendMoneyTransaction {
    return new SendMoneyTransaction({ nonce, originator, receiver, amount: bigInt(amount) })
}

export function stake(nonce: number, originator: string, amount: bigint, publicKey: string): StakeTransaction {
    return new StakeTransaction({ nonce, originator, amount: bigInt(amount), publicKey, blsPublicKey: null });
}

export function swapKey(nonce: number, originator: string, curKey: string, newKey: string): SwapKeyTransaction {
    return new SwapKeyTransaction({ nonce, originator, curKey: base_decode(curKey), newKey: base_decode(newKey) });
}

export function createAccessKey(contractId?: string, methodName?: string, balanceOwner?: string, amount?: bigint): AccessKey {
    return new AccessKey({ 
        contractId: contractId ? new google.protobuf.StringValue({ value: contractId }) : null,
        methodName: methodName ? new google.protobuf.BytesValue({ value: Buffer.from(methodName) }) : null,
        balanceOwner: balanceOwner ? new google.protobuf.StringValue({ value: balanceOwner }) : null,
        amount: amount ? bigInt(amount) : null,
    });
}

export function addKey(nonce: number, originator: string, newKey: string, accessKey: AccessKey): AddKeyTransaction {
    return new AddKeyTransaction({ nonce, originator, newKey: base_decode(newKey), accessKey});
}

export function deleteKey(nonce: number, originator: string, curKey: string): DeleteKeyTransaction {
    return new DeleteKeyTransaction({ nonce, originator, curKey: base_decode(curKey) });
}

export function signedTransaction(transaction: AllTransactions, signature: Signature): SignedTransaction {
    const fieldName = TRANSACTION_FIELD_MAP[transaction.constructor.name];
    return new SignedTransaction({
        signature: signature.signature,
        publicKey: google.protobuf.BytesValue.create({ value: base_decode(signature.publicKey) }),
        [fieldName]: transaction,
    });
}

export async function signTransaction(signer: Signer, transaction: any, accountId?: string, networkId?: string): Promise<SignedTransaction> {
    const protoClass = transaction.constructor;
    let signature = await signer.signMessage(protoClass.encode(transaction).finish(), accountId, networkId);
    return signedTransaction(transaction, signature);
}
