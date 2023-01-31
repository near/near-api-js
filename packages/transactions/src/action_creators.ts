import { PublicKey } from '@near-js/crypto';
import BN from 'bn.js';

import {
    AccessKey,
    AccessKeyPermission,
    Action,
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
} from './actions.js';

function fullAccessKey(): AccessKey {
    return new AccessKey({
        permission: new AccessKeyPermission({
            fullAccess: new FullAccessPermission({}),
        })
    });
}

function functionCallAccessKey(receiverId: string, methodNames: string[], allowance?: BN): AccessKey {
    return new AccessKey({
        permission: new AccessKeyPermission({
            functionCall: new FunctionCallPermission({ receiverId, allowance, methodNames }),
        })
    });
}

function createAccount(): Action {
    return new Action({ createAccount: new CreateAccount({}) });
}

function deployContract(code: Uint8Array): Action {
    return new Action({ deployContract: new DeployContract({ code }) });
}

export function stringifyJsonOrBytes(args: any): Buffer {
    const isUint8Array = args.byteLength !== undefined && args.byteLength === args.length;
    return isUint8Array ? args : Buffer.from(JSON.stringify(args));
}

/**
 * Constructs {@link Action} instance representing contract method call.
 *
 * @param methodName the name of the method to call
 * @param args arguments to pass to method. Can be either plain JS object which gets serialized as JSON automatically
 *  or `Uint8Array` instance which represents bytes passed as is.
 * @param gas max amount of gas that method call can use
 * @param deposit amount of NEAR (in yoctoNEAR) to send together with the call
 * @param stringify Convert input arguments into bytes array.
 * @param jsContract  Is contract from JS SDK, skips stringification of arguments.
 */
function functionCall(methodName: string, args: Uint8Array | object, gas: BN, deposit: BN, stringify = stringifyJsonOrBytes, jsContract = false): Action {
    if(jsContract){
        return new Action({ functionCall: new FunctionCall({ methodName, args, gas, deposit }) });
    }

    return new Action({
        functionCall: new FunctionCall({
            methodName,
            args: stringify(args),
            gas,
            deposit,
        }),
    });
}

function transfer(deposit: BN): Action {
    return new Action({ transfer: new Transfer({ deposit }) });
}

function stake(stake: BN, publicKey: PublicKey): Action {
    return new Action({ stake: new Stake({ stake, publicKey }) });
}

function addKey(publicKey: PublicKey, accessKey: AccessKey): Action {
    return new Action({ addKey: new AddKey({ publicKey, accessKey}) });
}

function deleteKey(publicKey: PublicKey): Action {
    return new Action({ deleteKey: new DeleteKey({ publicKey }) });
}

function deleteAccount(beneficiaryId: string): Action {
    return new Action({ deleteAccount: new DeleteAccount({ beneficiaryId }) });
}

export const actionCreators = {
    addKey,
    createAccount,
    deleteAccount,
    deleteKey,
    deployContract,
    fullAccessKey,
    functionCall,
    functionCallAccessKey,
    stake,
    transfer,
};
