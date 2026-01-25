import type { PublicKey } from '../crypto/index.js';

import {
    AccessKey,
    AccessKeyPermission,
    Action,
    AddKey,
    CreateAccount,
    DeleteAccount,
    DeleteKey,
    DeployContract,
    DeployGlobalContract,
    FullAccessPermission,
    FunctionCall,
    FunctionCallPermission,
    GlobalContractDeployMode,
    GlobalContractIdentifier,
    SignedDelegate,
    Stake,
    Transfer,
    UseGlobalContract,
} from './actions.js';
import type { DelegateAction } from './delegate.js';
import type { Signature } from './signature.js';

/**
 * Creates a full access key with full access permissions.
 * @returns A new full access key.
 */
function fullAccessKey(): AccessKey {
    return new AccessKey({
        nonce: 0n,
        permission: new AccessKeyPermission({
            fullAccess: new FullAccessPermission(),
        }),
    });
}

/**
 * Creates an access key with function call permission for a specific receiver and method names.
 * @param receiverId The NEAR account ID of the function call receiver.
 * @param methodNames An array of method names allowed for function calls.
 * @param allowance An optional allowance (maximum amount) for the function call. Default: Unlimited.
 * @returns A new access key with function call permission.
 */
function functionCallAccessKey(receiverId: string, methodNames: string[], allowance?: bigint): AccessKey {
    return new AccessKey({
        nonce: 0n,
        permission: new AccessKeyPermission({
            functionCall: new FunctionCallPermission({
                receiverId,
                allowance,
                methodNames,
            }),
        }),
    });
}

/**
 * Creates a new action for creating a new NEAR account.
 * @returns A new action for creating a new account.
 */
function createAccount(): Action {
    return new Action({ createAccount: new CreateAccount() });
}

/**
 * Creates a new action for deploying a contract with the provided code.
 * @param code The Uint8Array representing the code of the contract.
 * @returns A new action for deploying a contract.
 */
function deployContract(code: Uint8Array): Action {
    return new Action({ deployContract: new DeployContract({ code }) });
}

/**
 * Converts an input argument to a Buffer, handling cases for both JSON and Uint8Array.
 * @param args The input argument, either JSON object or Uint8Array.
 * @returns A Buffer representation of the input argument.
 */
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
 */
function functionCall(
    methodName: string,
    args: Uint8Array | object,
    gas = 0n,
    deposit = 0n,
    stringify = stringifyJsonOrBytes
): Action {
    return new Action({
        functionCall: new FunctionCall({
            methodName,
            args: stringify(args),
            gas,
            deposit,
        }),
    });
}

/**
 * Creates a new action for transferring funds, optionally specifying a deposit amount.
 * @param deposit The amount to be deposited along with the transfer. Default: 0.
 * @returns A new action for transferring funds.
 */
function transfer(deposit = 0n): Action {
    return new Action({ transfer: new Transfer({ deposit }) });
}

/**
 * Creates a new action for staking tokens, specifying the stake amount and public key.
 * @param stake The amount to be staked. Default: 0.
 * @param publicKey The public key associated with the staking action.
 * @returns A new action for staking tokens.
 */
function stake(stake = 0n, publicKey: PublicKey): Action {
    return new Action({ stake: new Stake({ stake, publicKey }) });
}

/**
 * Creates a new action for adding a public key with a specified access key.
 * @param publicKey The public key to be added.
 * @param accessKey The access key associated with the added public key.
 * @returns A new action for adding a public key.
 */
function addKey(publicKey: PublicKey, accessKey: AccessKey): Action {
    return new Action({ addKey: new AddKey({ publicKey, accessKey }) });
}

/**
 * Creates a new action for adding a full access key.
 * @param publicKey The public key to be added.
 * @returns A new action for adding a full access key.
 */
function addFullAccessKey(publicKey: PublicKey): Action {
    return addKey(publicKey, fullAccessKey());
}

/** * Creates a new action for adding a function call access key.
 * @param publicKey The public key to be added.
 * @param receiverId The NEAR account ID of the function call receiver.
 * @param methodNames An array of method names allowed for function calls.
 * @param allowance An optional allowance (maximum amount) for the function call.
 * @returns A new action for adding a function call access key.
 */
function addFunctionCallAccessKey(
    publicKey: PublicKey,
    receiverId: string,
    methodNames: string[],
    allowance?: bigint
): Action {
    return addKey(publicKey, functionCallAccessKey(receiverId, methodNames, allowance));
}

/**
 * Creates a new action for deleting a public key.
 * @param publicKey The public key to be deleted.
 * @returns A new action for deleting a public key.
 */
function deleteKey(publicKey: PublicKey): Action {
    return new Action({ deleteKey: new DeleteKey({ publicKey }) });
}

/**
 * Creates a new action for deleting an account with the specified beneficiary ID.
 * @param beneficiaryId The NEAR account ID of the beneficiary.
 * @returns A new action for deleting an account.
 */
function deleteAccount(beneficiaryId: string): Action {
    return new Action({ deleteAccount: new DeleteAccount({ beneficiaryId }) });
}

/**
 * Creates a new action for a signed delegation, specifying the delegate action and signature.
 * @param options Signed delegate options
 * @param options.delegateAction The delegate action to be performed.
 * @param options.signature The signature associated with the delegate action.
 * @returns A new action for a signed delegation.
 */
function signedDelegate({
    delegateAction,
    signature,
}: {
    delegateAction: DelegateAction;
    signature: Signature;
}): Action {
    return new Action({
        signedDelegate: new SignedDelegate({ delegateAction, signature }),
    });
}

/**
 * Creates a new action for deploying a global contract with provided code and mode.
 * @param code The Uint8Array representing the contract code.
 * @param deployMode The mode to deploy global contract (CodeHash or AccountId).
 * @returns A new action for deploying a global contract.
 */
function deployGlobalContract(code: Uint8Array, deployMode: 'codeHash' | 'accountId'): Action {
    const mode =
        deployMode === 'codeHash'
            ? new GlobalContractDeployMode({ CodeHash: null })
            : new GlobalContractDeployMode({ AccountId: null });

    return new Action({ deployGlobalContract: new DeployGlobalContract({ code, deployMode: mode }) });
}

/**
 * Creates a new action for using a previously deployed global contract.
 * @param contractIdentifier The global contract identifier (hash or account id).
 * @returns A new action for using a global contract.
 */
function useGlobalContract(contractIdentifier: { accountId: string } | { codeHash: string | Uint8Array }): Action {
    const identifier =
        'accountId' in contractIdentifier
            ? new GlobalContractIdentifier({
                  AccountId: contractIdentifier.accountId,
              })
            : new GlobalContractIdentifier({
                  CodeHash:
                      typeof contractIdentifier.codeHash === 'string'
                          ? Buffer.from(contractIdentifier.codeHash, 'hex')
                          : contractIdentifier.codeHash,
              });
    return new Action({ useGlobalContract: new UseGlobalContract({ contractIdentifier: identifier }) });
}

export const actions = {
    addFullAccessKey,
    addFunctionCallAccessKey,
    createAccount,
    deleteAccount,
    deleteKey,
    deployContract,
    fullAccessKey,
    functionCall,
    functionCallAccessKey,
    signedDelegate,
    stake,
    transfer,
    deployGlobalContract,
    useGlobalContract,
};
