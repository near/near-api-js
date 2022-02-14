import { Action, Transaction } from '../../transaction';
export interface SenderWallet {
    requestSignIn: (params: RequestSignInParams) => Promise<InitResponse>;
    isSignedIn: () => boolean;
    signOut: () => Promise<SignOutResponse>;
    getAccountId: () => string;
    requestSignTransactions: (params: RequestSignTransactionsParams) => Promise<Array<SignAndSendTransactionResponse>>;
    signAndSendTransaction: (params: SignAndSendTransactionParams) => Promise<SignAndSendTransactionResponse>;
    sendMoney: (params: SendMoneyParams) => Promise<unknown>;
    onAccountChanged: (callback: AccountChangedCallback) => void;
    getRpc: () => Promise<GetRpcResponse>;
    onRpcChanged: (callback: RpcChangedCallback) => void;
    init: (params: InitParams) => Promise<InitResponse>;
}
export interface InitParams {
    contractId: string;
}
export interface InitResponse {
    accessKey: "" | {
        publicKey: {
            data: Uint8Array;
            keyType: number;
        };
        secretKey: string;
    };
}
export interface RpcInfo {
    explorerUrl: string;
    helperUrl: string;
    index: number;
    name: string;
    network: string;
    networkId: string;
    nodeUrl: string;
    walletUrl: string;
    wrapNearContract: string;
}
export interface GetRpcResponse {
    method: "getRpc";
    notificationId: number;
    rpc: RpcInfo;
    type: "sender-wallet-result";
}
export interface RequestSignInParams {
    contractId: string;
    methodNames?: Array<string>;
}
export interface SignOutResponse {
    result: "success";
}
export declare type AccountChangedCallback = (newAccountId: string) => void;
export interface RpcChangedResponse {
    method: "rpcChanged";
    notificationId: number;
    rpc: RpcInfo;
    type: "sender-wallet-fromContent";
}
export declare type RpcChangedCallback = (newRpc: RpcChangedResponse) => void;
export interface SendMoneyParams {
    receiverId: string;
    amount: string;
}
export interface ActionParams {
    methodName: string;
    args: object;
    gas: string;
    deposit: string;
}
export interface SignAndSendTransactionParams {
    receiverId: string;
    actions: Array<Action>;
}
export interface SignAndSendTransactionResponse {
    error?: string;
    method: "signAndSendTransaction";
    notificationId: number;
    res?: Array<object>;
    type: "sender-wallet-result";
    url: string;
}
export interface TransactionParams {
    receiverId: string;
    actions: Array<Action>;
}
export interface RequestSignTransactionsParams {
    transactions: Array<Transaction>;
}
