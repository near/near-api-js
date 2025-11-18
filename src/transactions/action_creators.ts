import type { PublicKey } from '../crypto';

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
    type GlobalContractDeployMode,
    type GlobalContractIdentifier,
    SignedDelegate,
    Stake,
    Transfer,
    UseGlobalContract,
} from './actions';
import type { DelegateAction } from './delegate';
import type { Signature } from './signature';

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

export interface FunctionCallAccessKeyParams {
    /** The NEAR account ID of the function call receiver. */
    receiverId: string;
    /** An array of method names allowed for function calls. */
    methodNames: string[];
    /** An optional allowance (maximum amount) for the function call. Default: Unlimited. */
    allowance?: bigint;
}

/**
 * Creates an access key with function call permission for a specific receiver and method names.
 * @param params Function call access key parameters
 * @returns A new access key with function call permission.
 */
function functionCallAccessKey(params: FunctionCallAccessKeyParams): AccessKey {
    const { receiverId, methodNames, allowance } = params;
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
    const isUint8Array =
        args.byteLength !== undefined && args.byteLength === args.length;
    return isUint8Array ? args : Buffer.from(JSON.stringify(args));
}

export interface FunctionCallParams {
    /** The name of the method to call */
    methodName: string;
    /** Arguments to pass to method. Can be either plain JS object which gets serialized as JSON automatically or `Uint8Array` instance which represents bytes passed as is. */
    args: Uint8Array | object;
    /** Max amount of gas that method call can use. Default: 0n */
    gas?: bigint;
    /** Amount of NEAR (in yoctoNEAR) to send together with the call. Default: 0n */
    deposit?: bigint;
    /** Convert input arguments into bytes array. Default: stringifyJsonOrBytes */
    stringify?: (args: any) => Buffer;
}

/**
 * Constructs {@link Action} instance representing contract method call.
 *
 * @param params Function call parameters
 */
function functionCall(params: FunctionCallParams): Action {
    const {
        methodName,
        args,
        gas = 0n,
        deposit = 0n,
        stringify = stringifyJsonOrBytes
    } = params;
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

export interface StakeParams {
    /** The amount to be staked. Default: 0n */
    stake?: bigint;
    /** The public key associated with the staking action. */
    publicKey: PublicKey;
}

/**
 * Creates a new action for staking tokens, specifying the stake amount and public key.
 * @param params Stake parameters
 * @returns A new action for staking tokens.
 */
function stake(params: StakeParams): Action {
    const { stake = 0n, publicKey } = params;
    return new Action({ stake: new Stake({ stake, publicKey }) });
}

export interface AddKeyParams {
    /** The public key to be added. */
    publicKey: PublicKey;
    /** The access key associated with the added public key. */
    accessKey: AccessKey;
}

/**
 * Creates a new action for adding a public key with a specified access key.
 * @param params Add key parameters
 * @returns A new action for adding a public key.
 */
function addKey(params: AddKeyParams): Action {
    const { publicKey, accessKey } = params;
    return new Action({ addKey: new AddKey({ publicKey, accessKey }) });
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
 * @param delegateAction The delegate action to be performed.
 * @param signature The signature associated with the delegate action.
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

export interface DeployGlobalContractParams {
    /** The Uint8Array representing the contract code. */
    code: Uint8Array;
    /** The mode to deploy global contract (CodeHash or AccountId). */
    deployMode: GlobalContractDeployMode;
}

/**
 * Creates a new action for deploying a global contract with provided code and mode.
 * @param params Deploy global contract parameters
 * @returns A new action for deploying a global contract.
 */
function deployGlobalContract(params: DeployGlobalContractParams): Action {
    const { code, deployMode } = params;
    return new Action({ deployGlobalContract: new DeployGlobalContract({ code, deployMode }) });
}

/**
 * Creates a new action for using a previously deployed global contract.
 * @param contractIdentifier The global contract identifier (hash or account id).
 * @returns A new action for using a global contract.
 */
function useGlobalContract(
    contractIdentifier: GlobalContractIdentifier,
): Action {
    return new Action({ useGlobalContract: new UseGlobalContract({ contractIdentifier }) });
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
    signedDelegate,
    stake,
    transfer,
    deployGlobalContract,
    useGlobalContract
};
