import {
    FinalExecutionOutcome,
} from '../../providers';
import {
    Action,
    Transaction,
} from '../../transaction';


export interface InjectedWallet {
    /** Creates a new Function call key that is stored locally alongside with accountId*/
    requestSignIn: ({ contractId, methodNames }: SignInOptions) => Promise<boolean>;

    /** Returns true if function call key was created or false otherwise */
    isSignedIn: () => boolean;

    // TODO: Sender Wallet returns Promise<boolean>, is it possible to return boolean?
    // TODO: Should we make signOut reurn boolean in walletconnection interface? 
    /** Cleares function call key and accountId from local storage*/
    signOut: () => boolean;

    /** Returns accounId from local storage or '' if it is not present */
    getAccountId: () => string;

    /* TODO: should it return other type of info if transaction was rejected by the user? */
    /** On excecution of this function injected wallet should check if it can use Function call key
     * to sign transaction and do that wihtout any prompts if possible.
     * If this transaction requires Full access key,  user should be prompted.
     * On approval transaction should be signed and sent.
     * */
    requestSignTransactions: (
        params: RequestSignTransactionsOptions
    ) => Promise<Array<FinalExecutionOutcome>>;
}

/**
 * These options will become a part of the newly created Function Call key.
 * {
    public_key: 'ed25519:<public key>',
    access_key: {
      nonce: <nonce>,
      permission: {
        FunctionCall: {
          allowance: null,
          receiver_id: '<contractId>',              <------ @param contracId goes here
          method_names: [<array of method names>] <------ @param methodNames goes here
        }
      }
    }
  }
 */
export interface SignInOptions {
    contractId?: string;
    methodNames?: string[];
}

export interface RequestSignTransactionsOptions {
    /** List of transactions to sign */
    transactions: Transaction[];
    /** Meta information Wallet will send back to the application */
    meta?: string; // TODO: should we have this field?
    /** callback to be excecuted after function excecution */
    callback // TODO: should we have this field?
}

/////////////////////////// This section needs to be deleted after dicussions /////////////////////////////////
export interface SenderWallet {
    requestSignIn: (params: RequestSignInParams) => Promise<InitResponse>;
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