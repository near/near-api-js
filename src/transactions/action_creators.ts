import type { PublicKey } from '../crypto/index.js';
import { stringToBytes } from '../utils/index.js';

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
    DeterministicStateInitAction,
    FullAccessPermission,
    FunctionCall,
    FunctionCallPermission,
    GasKeyFunctionCallPermission,
    GasKeyInfo,
    GlobalContractDeployMode,
    SignedDelegate,
    Stake,
    Transfer,
    TransferToGasKey,
    UniversalStateInitAction,
    UseGlobalContract,
    WithdrawFromGasKey,
} from './actions.js';
import { DelegateAction } from './delegate.js';
import { globalContractIdentifier } from './global_contract_identifier.js';
import type { Signature } from './signature.js';
import { canonicalStateInitData, type DeterministicStateInit } from './state-init.js';

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
 * Creates a gas key with full access permissions. Its balance starts at 0 and is funded with {@link transferToGasKey}.
 * @param numNonces The number of independent nonce lanes (1-1024).
 * @returns A new full access gas key.
 */
function fullAccessGasKey(numNonces: number): AccessKey {
    return new AccessKey({
        nonce: 0n,
        permission: new AccessKeyPermission({
            gasKeyFullAccess: new GasKeyInfo({ balance: 0n, numNonces }),
        }),
    });
}

/**
 * Creates a gas key with function call permission for a specific receiver and method names.
 * The gas key balance acts as the allowance, so the function call allowance is always unlimited.
 * @param receiverId The NEAR account ID of the function call receiver.
 * @param methodNames An array of method names allowed for function calls.
 * @param numNonces The number of independent nonce lanes (1-1024).
 * @returns A new gas key with function call permission.
 */
function functionCallGasKey(receiverId: string, methodNames: string[], numNonces: number): AccessKey {
    return new AccessKey({
        nonce: 0n,
        permission: new AccessKeyPermission({
            gasKeyFunctionCall: new GasKeyFunctionCallPermission({
                gasKeyInfo: new GasKeyInfo({ balance: 0n, numNonces }),
                functionCall: new FunctionCallPermission({ receiverId, methodNames }),
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
 * Converts an input argument to a Uint8Array, handling cases for both JSON and Uint8Array.
 * @param args The input argument, either JSON object or Uint8Array.
 * @returns A Uint8Array representation of the input argument.
 */
export function stringifyJsonOrBytes(args: any): Uint8Array {
    if (args instanceof Uint8Array) return args;
    return stringToBytes(JSON.stringify(args));
}

/**
 * Constructs {@link Action} instance representing contract method call.
 *
 * @param methodName the name of the method to call
 * @param args arguments to pass to method. Can be either plain JS object which gets serialized as JSON automatically
 *  or `Uint8Array` instance which represents bytes passed as is.
 * @param gas - Maximum gas units, not TGas. Defaults to 0; unlike Account.callFunction, this builder does not supply 30 TGas.
 * @param deposit - Attached amount in yoctoNEAR, not decimal NEAR. Defaults to 0.
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
 * @param deposit - Amount in yoctoNEAR, not decimal NEAR. Defaults to 0.
 * @returns A new action for transferring funds.
 */
function transfer(deposit = 0n): Action {
    return new Action({ transfer: new Transfer({ deposit }) });
}

/**
 * Creates a new action for staking tokens, specifying the stake amount and public key.
 * @param stake - Target stake in yoctoNEAR, not an increment to the current stake. Defaults to 0 (unstake).
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
 * @param allowance - Gas-spending allowance in yoctoNEAR. Omit for unlimited allowance; 0 is a zero allowance.
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
 * Creates a new action for adding a full access gas key.
 * @param publicKey The public key to be added.
 * @param numNonces The number of independent nonce lanes (1-1024).
 * @returns A new action for adding a full access gas key.
 */
function addFullAccessGasKey(publicKey: PublicKey, numNonces: number): Action {
    return addKey(publicKey, fullAccessGasKey(numNonces));
}

/**
 * Creates a new action for adding a function call gas key.
 * @param publicKey The public key to be added.
 * @param receiverId The NEAR account ID of the function call receiver.
 * @param methodNames An array of method names allowed for function calls.
 * @param numNonces The number of independent nonce lanes (1-1024).
 * @returns A new action for adding a function call gas key.
 */
function addFunctionCallGasKey(
    publicKey: PublicKey,
    receiverId: string,
    methodNames: string[],
    numNonces: number
): Action {
    return addKey(publicKey, functionCallGasKey(receiverId, methodNames, numNonces));
}

/**
 * Creates a new action for funding a gas key balance. Any account may send it.
 * @param publicKey The public key of the gas key to fund.
 * @param deposit The amount (in yoctoNEAR) to transfer to the gas key.
 * @returns A new action for funding a gas key.
 */
function transferToGasKey(publicKey: PublicKey, deposit: bigint): Action {
    return new Action({ transferToGasKey: new TransferToGasKey({ publicKey, deposit }) });
}

/**
 * Creates a new action for moving balance from a gas key back to its owning account.
 * Not allowed inside a delegate action.
 * @param publicKey The public key of the gas key to withdraw from.
 * @param amount The amount (in yoctoNEAR) to withdraw.
 * @returns A new action for withdrawing from a gas key.
 */
function withdrawFromGasKey(publicKey: PublicKey, amount: bigint): Action {
    return new Action({ withdrawFromGasKey: new WithdrawFromGasKey({ publicKey, amount }) });
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
 * @param deployMode - `codeHash` for immutable publication or `accountId` for publication that the publisher can update.
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
 * Code hashes may be RPC base58 strings, 64-character hexadecimal strings, or raw bytes.
 * @returns A new action for using a global contract.
 */
function useGlobalContract(contractIdentifier: { accountId: string } | { codeHash: string | Uint8Array }): Action {
    return new Action({
        useGlobalContract: new UseGlobalContract({ contractIdentifier: globalContractIdentifier(contractIdentifier) }),
    });
}

/**
 * Builds a NEP-616 initialization action without submitting it.
 * @param stateInit - Canonical state initialization; submit the action to its derived account ID.
 * @param deposit - Storage deposit in yoctoNEAR. Defaults to 0; excess is refunded by the protocol.
 * @returns An initialization action to include in a transaction.
 */
function deterministicStateInit(stateInit: DeterministicStateInit, deposit = 0n): Action {
    return new Action({
        deterministicStateInit: new DeterministicStateInitAction({
            stateInit: { V1: { ...stateInit.V1, data: canonicalStateInitData(stateInit.V1.data) } },
            deposit,
        }),
    });
}

/**
 * Builds a protocol-88 universal initialization action without submitting it.
 * @param stateInit - Raw versioned state-init bytes, forwarded unchanged for node validation.
 * @param deposit - Deposit in yoctoNEAR. Defaults to 0.
 * @returns An initialization action; submit it to the account ID derived from the exact supplied bytes.
 */
function universalStateInit(stateInit: Uint8Array, deposit = 0n): Action {
    return new Action({ universalStateInit: new UniversalStateInitAction({ stateInit, deposit }) });
}

export const actions = {
    addFullAccessGasKey,
    addFullAccessKey,
    addFunctionCallAccessKey,
    addFunctionCallGasKey,
    createAccount,
    deleteAccount,
    deleteKey,
    deployContract,
    fullAccessGasKey,
    fullAccessKey,
    functionCall,
    functionCallAccessKey,
    functionCallGasKey,
    signedDelegate,
    stake,
    transfer,
    deployGlobalContract,
    useGlobalContract,
    transferToGasKey,
    withdrawFromGasKey,
    deterministicStateInit,
    universalStateInit,
};

/**
 * Compose a delegate action for inclusion with a meta transaction signed on the sender's behalf
 * @param options Delegate action options
 * @param options.actions The set of actions to be included in the meta transaction
 * @param options.maxBlockHeight The maximum block height for which this action can be executed as part of a transaction
 * @param options.nonce Current nonce on the access key used to sign the delegate action
 * @param options.publicKey Public key for the access key used to sign the delegate action
 * @param options.receiverId Account ID for the intended receiver of the meta transaction
 * @param options.senderId Account ID for the intended signer of the delegate action
 */
export function buildDelegateAction({
    actions,
    maxBlockHeight,
    nonce,
    publicKey,
    receiverId,
    senderId,
}: DelegateAction): DelegateAction {
    return new DelegateAction({
        senderId,
        receiverId,
        actions: actions.map((a) => {
            // @ts-expect-error type workaround
            if (!a.type && !a.params) {
                return a;
            }

            // @ts-expect-error type workaround
            switch (a.type) {
                case 'AddKey': {
                    // @ts-expect-error type workaround
                    const { publicKey, accessKey } = a.params;
                    return new Action({ addKey: new AddKey({ publicKey, accessKey }) });
                }
                case 'CreateAccount': {
                    // @ts-expect-error type workaround
                    return createAccount(a.params.createAccount);
                }
                case 'DeleteAccount': {
                    // @ts-expect-error type workaround
                    return deleteAccount(a.params.deleteAccount);
                }
                case 'DeleteKey': {
                    // @ts-expect-error type workaround
                    return deleteKey(a.params.publicKey);
                }
                case 'DeployContract': {
                    // @ts-expect-error type workaround
                    return deployContract(a.params.code);
                }
                case 'FunctionCall': {
                    // @ts-expect-error type workaround
                    const { methodName, args, gas, deposit } = a.params;
                    return functionCall(methodName, args, gas, deposit);
                }
                case 'Stake': {
                    // @ts-expect-error type workaround
                    return stake(a.params.stake, a.params.publicKey);
                }
                case 'Transfer': {
                    // @ts-expect-error type workaround
                    const { deposit } = a.params;
                    return transfer(deposit);
                }
                case 'DeployGlobalContract': {
                    // @ts-expect-error type workaround
                    const { code, deployMode } = a.params;
                    // Ensure deployMode is an instance if passed as a plain object
                    const modeInstance = 'CodeHash' in deployMode ? 'codeHash' : 'accountId';
                    return deployGlobalContract(code, modeInstance);
                }
                case 'UseGlobalContract': {
                    // @ts-expect-error type workaround
                    const { identifier } = a.params;
                    // Ensure identifier is an instance if passed as a plain object
                    const idInstance =
                        'CodeHash' in identifier
                            ? { codeHash: identifier.CodeHash }
                            : { accountId: identifier.AccountId };
                    return useGlobalContract(idInstance);
                }
            }

            throw new Error('Unrecognized action');
        }),
        nonce,
        maxBlockHeight,
        publicKey,
    });
}
