import BN from 'bn.js';
import { Signer } from './signer';
export declare class Assignable {
    constructor(properties: any);
}
export declare class AccessKey extends Assignable {
    contractId: string;
    methodName: Uint8Array;
    balanceOwner: string;
    amount: BN;
}
export declare function createAccessKey(contractId?: string, methodName?: string, balanceOwner?: string, amount?: BN): AccessKey;
export declare class IAction extends Assignable {
}
declare class CreateAccount extends IAction {
}
declare class DeployContract extends IAction {
    code: Uint8Array;
}
declare class FunctionCall extends IAction {
    methodName: string;
    args: Uint8Array;
    gas: BN;
    deposit: BN;
}
declare class Transfer extends IAction {
    deposit: BN;
}
declare class Stake extends IAction {
    stake: BN;
    publicKey: PublicKey;
}
declare class AddKey extends IAction {
    publicKey: PublicKey;
    accessKey: AccessKey;
}
declare class DeleteKey extends IAction {
    publicKey: PublicKey;
}
declare class DeleteAccount extends IAction {
    beneficiaryId: string;
}
export declare function createAccount(): Action;
export declare function deployContract(code: Uint8Array): Action;
export declare function functionCall(methodName: string, args: Uint8Array, gas: number, deposit: BN): Action;
export declare function transfer(deposit: BN): Action;
export declare function stake(stake: BN, publicKey: string): Action;
export declare function addKey(publicKey: string, accessKey: AccessKey): Action;
export declare function deleteKey(publicKey: string): Action;
export declare function deleteAccount(beneficiaryId: string): Action;
declare enum KeyType {
    ED25519 = 0
}
declare class PublicKey {
    keyType: KeyType;
    data: Uint8Array;
    constructor(publicKey: string);
}
declare class Transaction extends Assignable {
    signerId: string;
    publicKey: PublicKey;
    nonce: number;
    receiverId: string;
    actions: Array<Action>;
}
export declare class SignedTransaction extends Assignable {
    transaction: Transaction;
    signature: Uint8Array;
    encode(): Uint8Array;
}
export declare class Action {
    action: string;
    createAccount: CreateAccount;
    deployContract: DeployContract;
    functionCall: FunctionCall;
    transfer: Transfer;
    stake: Stake;
    addKey: AddKey;
    deleteKey: DeleteKey;
    deleteAccount: DeleteAccount;
    constructor(properties: any);
}
export declare function signTransaction(receiverId: string, nonce: number, actions: Action[], signer: Signer, accountId?: string, networkId?: string): Promise<[Uint8Array, SignedTransaction]>;
export {};
