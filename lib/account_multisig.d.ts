import BN from 'bn.js';
import { Account } from './account';
import { Connection } from './connection';
import { Action } from './transaction';
import { FinalExecutionOutcome } from './providers';
export declare const MULTISIG_ALLOWANCE: BN;
export declare const MULTISIG_GAS: BN;
export declare const MULTISIG_DEPOSIT: BN;
export declare const MULTISIG_CHANGE_METHODS: string[];
export declare const MULTISIG_VIEW_METHODS: string[];
export declare const MULTISIG_CONFIRM_METHODS: string[];
interface MultisigContract {
    get_request_nonce(): any;
    list_request_ids(): any;
}
export declare class AccountMultisig extends Account {
    contract: MultisigContract;
    pendingRequest: any;
    constructor(connection: Connection, accountId: string);
    getRequestNonce(): Promise<String>;
    getRequestIds(): Promise<String>;
    signAndSendTransaction(receiverId: string, actions: Action[]): Promise<FinalExecutionOutcome>;
    deployMultisig(contractBytes: Uint8Array): Promise<FinalExecutionOutcome>;
    sendRequest(requestId?: number): Promise<void>;
    verifyRequest(securityCode: String): Promise<void>;
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
