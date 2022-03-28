import BN from 'bn.js';
import { Account, SignAndSendTransactionOptions } from './account';
import { Connection } from './connection';
import { Action } from './transaction';
import { FinalExecutionOutcome } from './providers';
export declare const MULTISIG_STORAGE_KEY = "__multisigRequest";
export declare const MULTISIG_ALLOWANCE: BN;
export declare const MULTISIG_GAS: BN;
export declare const MULTISIG_DEPOSIT: BN;
export declare const MULTISIG_CHANGE_METHODS: string[];
export declare const MULTISIG_CONFIRM_METHODS: string[];
declare type sendCodeFunction = () => Promise<any>;
declare type getCodeFunction = (method: any) => Promise<string>;
declare type verifyCodeFunction = (securityCode: any) => Promise<any>;
export declare enum MultisigDeleteRequestRejectionError {
    CANNOT_DESERIALIZE_STATE = "Cannot deserialize the contract state",
    MULTISIG_NOT_INITIALIZED = "Smart contract panicked: Multisig contract should be initialized before usage",
    NO_SUCH_REQUEST = "Smart contract panicked: panicked at 'No such request: either wrong number or already confirmed'",
    REQUEST_COOLDOWN_ERROR = "Request cannot be deleted immediately after creation.",
    METHOD_NOT_FOUND = "Contract method is not found"
}
export declare enum MultisigStateStatus {
    INVALID_STATE = 0,
    STATE_NOT_INITIALIZED = 1,
    VALID_STATE = 2,
    UNKNOWN_STATE = 3
}
declare enum MultisigCodeStatus {
    INVALID_CODE = 0,
    VALID_CODE = 1,
    UNKNOWN_CODE = 2
}
export declare class AccountMultisig extends Account {
    storage: any;
    onAddRequestResult: Function;
    constructor(connection: Connection, accountId: string, options: any);
    signAndSendTransactionWithAccount(receiverId: string, actions: Action[]): Promise<FinalExecutionOutcome>;
    protected signAndSendTransaction(...args: any[]): Promise<FinalExecutionOutcome>;
    private _signAndSendTransaction;
    checkMultisigCodeAndStateStatus(contractBytes?: Uint8Array): Promise<{
        codeStatus: MultisigCodeStatus;
        stateStatus: MultisigStateStatus;
    }>;
    deleteRequest(request_id: any): Promise<FinalExecutionOutcome>;
    deleteAllRequests(): Promise<void>;
    deleteUnconfirmedRequests(): Promise<void>;
    getRequestIds(): Promise<string[]>;
    getRequest(): any;
    setRequest(data: any): any;
}
export declare class Account2FA extends AccountMultisig {
    /********************************
    Account2FA has options object where you can provide callbacks for:
    - sendCode: how to send the 2FA code in case you don't use NEAR Contract Helper
    - getCode: how to get code from user (use this to provide custom UI/UX for prompt of 2FA code)
    - onResult: the tx result after it's been confirmed by NEAR Contract Helper
    ********************************/
    sendCode: sendCodeFunction;
    getCode: getCodeFunction;
    verifyCode: verifyCodeFunction;
    onConfirmResult: Function;
    helperUrl: string;
    constructor(connection: Connection, accountId: string, options: any);
    /**
     * Sign a transaction to preform a list of actions and broadcast it using the RPC API.
     * @see {@link JsonRpcProvider.sendTransaction}
     */
    signAndSendTransaction({ receiverId, actions }: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome>;
    /**
     * @deprecated
     * Sign a transaction to preform a list of actions and broadcast it using the RPC API.
     * @see {@link JsonRpcProvider.sendTransaction}
     *
     * @param receiverId NEAR account receiving the transaction
     * @param actions list of actions to perform as part of the transaction
     */
    signAndSendTransaction(receiverId: string, actions: Action[]): Promise<FinalExecutionOutcome>;
    private __signAndSendTransaction;
    deployMultisig(contractBytes: Uint8Array): Promise<FinalExecutionOutcome>;
    disableWithFAK({ contractBytes, cleanupContractBytes }: {
        contractBytes: Uint8Array;
        cleanupContractBytes?: Uint8Array;
    }): Promise<FinalExecutionOutcome>;
    get2faDisableCleanupActions(cleanupContractBytes: Uint8Array): Promise<Action[]>;
    get2faDisableKeyConversionActions(): Promise<Action[]>;
    /**
     * This method converts LAKs back to FAKs, clears state and deploys an 'empty' contract (contractBytes param)
     * @param [contractBytes]{@link https://github.com/near/near-wallet/blob/master/packages/frontend/src/wasm/main.wasm?raw=true}
     * @param [cleanupContractBytes]{@link https://github.com/near/core-contracts/blob/master/state-cleanup/res/state_cleanup.wasm?raw=true}
     */
    disable(contractBytes: Uint8Array, cleanupContractBytes: Uint8Array): Promise<FinalExecutionOutcome>;
    sendCodeDefault(): Promise<any>;
    getCodeDefault(method: any): Promise<string>;
    promptAndVerify(): any;
    verifyCodeDefault(securityCode: string): Promise<any>;
    getRecoveryMethods(): Promise<{
        accountId: string;
        data: any;
    }>;
    get2faMethod(): Promise<{
        kind: any;
        detail: any;
    }>;
    signatureFor(): Promise<{
        blockNumber: string;
        blockNumberSignature: string;
    }>;
    postSignedJson(path: any, body: any): Promise<any>;
}
export {};
