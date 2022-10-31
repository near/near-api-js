import { Action, SignedTransaction } from '../transaction';
import { PublicKey } from '../utils';
import { Signature } from '../utils/key_pair';

export interface Account {
    accountId: string;
    publicKey: PublicKey;
}

export interface Network {
    networkId: string;
    nodeUrl: string;
}

export interface Events {
    accountsChanged: { accounts: Array<Account> };
    networkChanged: { network: Network };
}

type Unsubscribe = () => void;

export interface RequestParams {
    jsonrpc: '2.0';
    id: number;
    method: string;
    params: object;
}

export interface TransactionOptions {
    receiverId: string;
    actions: Array<Action>;
    signerId?: string;
}

export interface SignTransactionParams {
    transaction: TransactionOptions;
}

export interface Wallet {
    id: string;
    connected: boolean;
    network: Network;
    accounts: Array<Account>;

    connect(): Promise<Array<Account>>;
    // signIn(params: SignInParams): Promise<void>;
    // signOut(params: SignOutParams): Promise<void>;
    signTransaction(params: SignTransactionParams): Promise<SignedTransaction>;
    // signTransactions(params: SignTransactionsParams): Promise<Array<transactions.SignedTransaction>>;
    // disconnect(): Promise<void>;
    on<EventName extends keyof Events>(
        event: EventName,
        callback: (params: Events[EventName]) => void
    ): Unsubscribe;
    off<EventName extends keyof Events>(
        event: EventName,
        callback?: () => void
    ): void;
    request(args: RequestParams): Promise<any>;
    signMessage(message: Uint8Array, accountId: string): Promise<Signature>;
}