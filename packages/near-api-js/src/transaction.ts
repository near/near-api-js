export {
    stringifyJsonOrBytes,
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
    SCHEMA,
    createTransaction,
    signTransaction,
    Signature,
    SignedTransaction,
    Transaction,
} from '@near-js/transactions';

import { PublicKey } from '@near-js/crypto';
import { AccessKey, actionCreators, stringifyJsonOrBytes } from '@near-js/transactions';
import BN from 'bn.js';

export const addKey = (publicKey: PublicKey, accessKey: AccessKey) => actionCreators.addKey(publicKey, accessKey);
export const createAccount = () => actionCreators.createAccount();
export const deleteAccount = (beneficiaryId: string) => actionCreators.deleteAccount(beneficiaryId);
export const deleteKey = (publicKey: PublicKey) => actionCreators.deleteKey(publicKey);
export const deployContract = (code: Uint8Array) => actionCreators.deployContract(code);
export const fullAccessKey = () => actionCreators.fullAccessKey();
export const functionCall = (methodName: string, args: object | Uint8Array, gas: BN, deposit: BN, stringify?: typeof stringifyJsonOrBytes, jsContract?: boolean) => actionCreators.functionCall(methodName, args, gas, deposit, stringify, jsContract);
export const functionCallAccessKey = (receiverId: string, methodNames: string[], allowance?: BN) => actionCreators.functionCallAccessKey(receiverId, methodNames, allowance);
export const stake = (stake: BN, publicKey: PublicKey) => actionCreators.stake(stake, publicKey);
export const transfer = (deposit: BN) => actionCreators.transfer(deposit);
