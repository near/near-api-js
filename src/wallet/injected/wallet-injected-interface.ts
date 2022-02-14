import {
    Action,
    Transaction,
} from '../../transaction';

/////////////////////////// This section needs to be deleted after dicussions /////////////////////////////////
export interface SenderWallet {
    requestSignIn: (params: RequestSignInParams) => Promise<InitResponse>;
    // TODO: Sender Wallet returns Promise<boolean>, is it possible to return boolean?
    isSignedIn: () => boolean;
    signOut: () => Promise<SignOutResponse>;
    getAccountId: () => string;
    requestSignTransactions: (
        params: RequestSignTransactionsParams
    ) => Promise<Array<SignAndSendTransactionResponse>>;

    /* There is no reason to have an interface to sign one transaction,
     * when we have interface for signing multiple transactions.
     */
    signAndSendTransaction: (
        params: SignAndSendTransactionParams
    ) => Promise<SignAndSendTransactionResponse>;

    /* This function is redundant, since it can be acomplished with signAndSendTransaction.
    Also, there is high level API in near-api-js Account class */
    sendMoney: (params: SendMoneyParams) => Promise<unknown>;

    /* Can be usefull, but since it's imposible to do it in NEAR Wallet,
     * I'm not sure that this should be part of the standart.
     * Even with Sender wallet, dApp is not always open,
     * so it should not be a part of the lifecycle.
     */
    onAccountChanged: (callback: AccountChangedCallback) => void;

    /* Why do we need to expose this information to developers?
    Do they care what RPC is used to send their transactions? */
    getRpc: () => Promise<GetRpcResponse>;
    onRpcChanged: (callback: RpcChangedCallback) => void;

    /* In current implementation of Sender Wallet this function if returning a keyPair.
    I believe we can get rid of it, since the key itself is not needed, user should be able to sign
    and send anu transaction with signAndSendTransaction */
    init: (params: InitParams) => Promise<InitResponse>;
}
export interface InitParams {
    contractId: string;
}

export interface InitResponse {
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
    // TODO: Figure out when this isn't "success".
    result: "success";
}

export type AccountChangedCallback = (newAccountId: string) => void;

export interface RpcChangedResponse {
    method: "rpcChanged";
    notificationId: number;
    rpc: RpcInfo;
    type: "sender-wallet-fromContent";
}

export type RpcChangedCallback = (newRpc: RpcChangedResponse) => void;

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
    // TODO: Heavily nested objects. Define if needed.
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