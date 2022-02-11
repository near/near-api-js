import { FinalExecutionOutcome } from '../../providers';
import { Action, Transaction } from '../../transaction';
export interface InjectedWallet {
    /** Creates a new Function call key that is stored locally alongside with accountId*/
    requestSignIn: ({ contractId, methodNames }: SignInOptions) => Promise<boolean>;
    /** Returns true if function call key was created or false otherwise */
    isSignedIn: () => boolean;
    /** Cleares function call key and accountId from local storage*/
    signOut: () => boolean;
    /** Returns accounId from local storage or '' if it is not present */
    getAccountId: () => string;
    /** TODOD: Should we return error type if transaction was not sent? */
    /** On excecution of this function injected wallet should check if it can use Function call key
     * to sign transaction and do that wihtout any prompts if possible.
     * If this transaction requires Full access key,  user should be prompted.
     * On approval transaction should be signed and sent.
     * */
    requestSignTransactions: (params: RequestSignTransactionsInjectedOptions) => Promise<Array<FinalExecutionOutcome>>;
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
export interface RequestSignTransactionsInjectedOptions {
    /** List of transactions to sign */
    transactions: Transaction[];
    /** Meta information Wallet will send back to the application */
    meta?: string;
    /** callback to be excecuted after function excecution */
    callback?: any;
}
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
