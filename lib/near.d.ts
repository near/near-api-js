import BN from 'bn.js';
import { Account } from './account';
import { Connection } from './connection';
import { Signer } from './signer';
import { Contract } from './contract';
import { PublicKey } from './utils/key_pair';
import { AccountCreator } from './account_creator';
import { KeyStore } from './key_stores';
declare type NearConfig = {
    keyStore?: KeyStore;
    signer?: Signer;
    deps?: {
        keyStore: KeyStore;
    };
    helperUrl?: string;
    initialBalance?: string;
    masterAccount?: string;
    networkId: string;
    nodeUrl: string;
    walletUrl?: string;
};
export declare class Near {
    readonly config: any;
    readonly connection: Connection;
    readonly accountCreator: AccountCreator;
    constructor(config: NearConfig);
    /**
     *
     * @param accountId near accountId used to interact with the network.
     */
    account(accountId: string): Promise<Account>;
    /**
     *
     * @param accountId
     * @param publicKey
     */
    createAccount(accountId: string, publicKey: PublicKey): Promise<Account>;
    /**
     * @deprecated Use `new nearApi.Contract(yourAccount, contractId, { viewMethods, changeMethods })` instead.
     * @param contractId
     * @param options
     */
    loadContract(contractId: string, options: {
        viewMethods: string[];
        changeMethods: string[];
        sender: string;
    }): Promise<Contract>;
    /**
     * @deprecated Use `yourAccount.sendMoney` instead.
     * @param amount
     * @param originator
     * @param receiver
     */
    sendTokens(amount: BN, originator: string, receiver: string): Promise<string>;
}
declare type ConnectConfig = NearConfig & {
    keyPath?: string;
};
/**
 * Initialize connection to Near network.
 */
export declare function connect(config: ConnectConfig): Promise<Near>;
export {};
