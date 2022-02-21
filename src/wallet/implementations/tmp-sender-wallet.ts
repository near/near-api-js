/**
 * This is a tmp file. It is used to test integration with SenderWallet.
 */

import {
    Transaction,
} from '../../transaction';

import {
    RequestSignTransactionsOptions,
    SignInOptions,
    Wallet,
} from '../interface'

export class SenderWallet implements Wallet {
    requestSignIn: ({ contractId, methodNames }: SignInOptions) => void;
    isSignedIn: () => boolean;
    signOut: () => boolean;
    getAccountId: () => string;
    requestSignTransactions: (params: RequestSignTransactionsOptions) => void;
}

/**
 * This is a tmp interface. In the future Sender Wallet should implement standard Wallet interface
 */
export interface TmpSenderWallet {
    requestSignIn: (params: RequestSignInParams) => Promise<RequestSignInResponse>;
    isSignedIn: () => Promise<boolean>;
    signOut: () => Promise<SignOutResponse>;
    getAccountId: () => string;
    requestSignTransactions: (
        params: SignAndSendTransactionParams
    ) => Promise<Array<SignAndSendTransactionResponse>>;
}

export interface RequestSignInParams {
    contractId: string;
    methodNames?: Array<string>;
}

export interface RequestSignInResponse {
    accessKey:
    | ""
    | {
        publicKey: {
            data: Uint8Array;
            keyType: number;
        };
        secretKey: string;
    };
}

export interface SignOutResponse {
    result: string; // "success" or ?
}

export interface SignAndSendTransactionResponse {
    error?: string;
    method: "signAndSendTransaction";
    notificationId: number;
    // TODO: Heavily nested objects. Define if needed.
    res?: Array<object>;
    type: "sender-wallet-result";
    url: string;
}

export interface SignAndSendTransactionParams {
    transactions: Array<Transaction>;
}