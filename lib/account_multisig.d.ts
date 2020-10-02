import BN from 'bn.js';
import { Account } from './account';
import { Connection } from './connection';
import { PublicKey } from './utils/key_pair';
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
export declare class AccountMultisig extends Account {
    contract: MultisigContract;
    storage: any;
    constructor(connection: Connection, accountId: string, storage: any);
    addKey(publicKey: string | PublicKey, contractId?: string, methodName?: string, amount?: BN): Promise<FinalExecutionOutcome>;
    signAndSendTransaction(receiverId: string, actions: Action[]): Promise<FinalExecutionOutcome>;
    signAndSendTransactions(transactions: any): Promise<void>;
    deployMultisig(contractBytes: Uint8Array): Promise<FinalExecutionOutcome>;
    deleteUnconfirmedRequests(): Promise<void>;
    getRequestNonce(): Promise<Number>;
    getRequestIds(): Promise<string>;
    isDeleteAction(actions: any): Boolean;
    getRequest(): any;
    setRequest(data: any): any;
    sendRequestCode(): Promise<any>;
    verifyRequestCode(securityCode: string): Promise<any>;
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
