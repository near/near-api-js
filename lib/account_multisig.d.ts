import BN from 'bn.js';
import { Account } from './account';
import { Connection } from './connection';
import { Action } from './transaction';
import { FinalExecutionOutcome } from './providers';
export declare const MULTISIG_STORAGE_KEY = "__multisigRequest";
export declare const MULTISIG_ALLOWANCE: BN;
export declare const MULTISIG_GAS: BN;
export declare const MULTISIG_DEPOSIT: BN;
export declare const MULTISIG_CHANGE_METHODS: string[];
export declare const MULTISIG_VIEW_METHODS: string[];
export declare const MULTISIG_CONFIRM_METHODS: string[];
interface MultisigContract {
    get_request_nonce(): any;
    list_request_ids(): any;
    delete_request({ request_id: Number }: {
        request_id: any;
    }): any;
}
declare type sendCodeFunction = () => Promise<any>;
declare type getCodeFunction = (method: any) => Promise<string>;
declare type verifyCodeFunction = (securityCode: any) => Promise<any>;
export declare class AccountMultisig extends Account {
    contract: MultisigContract;
    storage: any;
    onAddRequestResult: Function;
    constructor(connection: Connection, accountId: string, options: any);
    signAndSendTransactionWithAccount(receiverId: string, actions: Action[]): Promise<FinalExecutionOutcome>;
    signAndSendTransaction(receiverId: string, actions: Action[]): Promise<FinalExecutionOutcome>;
    signAndSendTransactions(transactions: any): Promise<void>;
    deleteUnconfirmedRequests(): Promise<void>;
    getRequestNonce(): Promise<Number>;
    getRequestIds(): Promise<string>;
    isDeleteAction(actions: any): Boolean;
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
    signAndSendTransaction(receiverId: string, actions: Action[]): Promise<FinalExecutionOutcome>;
    deployMultisig(contractBytes: Uint8Array): Promise<FinalExecutionOutcome>;
    disable(contractBytes: Uint8Array): Promise<FinalExecutionOutcome>;
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
