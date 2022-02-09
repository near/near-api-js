import { Action, Transaction } from '../../transaction';
export interface IInjectedWallet {
    init: (params: InitParams) => Promise<InitResponse>;
    getAccountId: () => string;
    getRpc: () => Promise<GetRpcResponse>;
    requestSignIn: (params: RequestSignInParams) => Promise<InitResponse>;
    signOut: () => Promise<SignOutResponse>;
    isSignedIn: () => boolean;
    onAccountChanged: (callback: AccountChangedCallback) => void;
    onRpcChanged: (callback: RpcChangedCallback) => void;
    sendMoney: (params: SendMoneyParams) => Promise<unknown>;
    signAndSendTransaction: (params: SignAndSendTransactionParams) => Promise<SignAndSendTransactionResponse>;
    requestSignTransactions: (params: RequestSignTransactionsParams) => Promise<unknown>;
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
