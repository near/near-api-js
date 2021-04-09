/**
 * This module contains the main class developers will use to interact with NEAR.
 * The {@link Near} class is used to interact with {@link Account | Accounts} through the {@link JsonRpcProvider.JsonRpcProvider | JsonRpcProvider}.
 * It is configured via the {@link NearConfig}.
 * 
 * @example {@link https://docs.near.org/docs/develop/front-end/naj-quick-reference#account}
 * 
 * @module near
 */
import BN from 'bn.js';
import { Account } from './account';
import { Connection } from './connection';
import { Signer } from './signer';
import { Contract } from './contract';
import { PublicKey } from './utils/key_pair';
import { AccountCreator, LocalAccountCreator, UrlAccountCreator } from './account_creator';
import { KeyStore } from './key_stores';

export interface NearConfig {
    /** Holds {@link KeyPair | KeyPairs} for signing transactions */
    keyStore?: KeyStore;

    /** @hidden */
    signer?: Signer;

    /** @deprecated use {@link NearConfig.keyStore} */
    deps?: { keyStore: KeyStore };

    /**
     * {@link https://github.com/near/near-contract-helper | NEAR Contract Helper} url used to create accounts if no master account is provided
     * @see {@link UrlAccountCreator}
     */
    helperUrl?: string;

    /**
     * The balance transferred from the {@link NearConfig.masterAccount | masterAccount} to a created account
     * @see {@link LocalAccountCreator}
     */
    initialBalance?: string;

    /**
     * The account to use when creating new accounts
     * @see {@link LocalAccountCreator}
     */
    masterAccount?: string;

    /**
     * {@link KeyPair | KeyPairs} are stored in a {@link KeyStore} under the `networkId` namespace.
     */
    networkId: string;

    /**
     * NEAR RPC API url. used to make JSON RPC calls to interact with NEAR.
     * @see {@link JsonRpcProvider.JsonRpcProvider | JsonRpcProvider}
     */
    nodeUrl: string;

    /**
     * NEAR wallet url used to redirect users to their wallet in browser applications.
     * @see {@link https://docs.near.org/docs/tools/near-wallet}
     */
    walletUrl?: string;
}

/**
 * This is the main class developers should use to interact with NEAR.
 * @example
 * ```js
 * const near = new Near(config);
 * ```
 */
export class Near {
    readonly config: any;
    readonly connection: Connection;
    readonly accountCreator: AccountCreator;

    constructor(config: NearConfig) {
        this.config = config;
        this.connection = Connection.fromConfig({
            networkId: config.networkId,
            provider: { type: 'JsonRpcProvider', args: { url: config.nodeUrl } },
            signer: config.signer || { type: 'InMemorySigner', keyStore: config.keyStore || config.deps.keyStore }
        });
        if (config.masterAccount) {
            // TODO: figure out better way of specifiying initial balance.
            // Hardcoded number below must be enough to pay the gas cost to dev-deploy with near-shell for multiple times
            const initialBalance = config.initialBalance ? new BN(config.initialBalance) : new BN('500000000000000000000000000');
            this.accountCreator = new LocalAccountCreator(new Account(this.connection, config.masterAccount), initialBalance);
        } else if (config.helperUrl) {
            this.accountCreator = new UrlAccountCreator(this.connection, config.helperUrl);
        } else {
            this.accountCreator = null;
        }
    }

    /**
     * @param accountId near accountId used to interact with the network.
     */
    async account(accountId: string): Promise<Account> {
        const account = new Account(this.connection, accountId);
        return account;
    }

    /**
     * Create an account using the {@link AccountCreator}. Either:
     * * using a masterAccount with {@link LocalAccountCreator}
     * * using the helperUrl with {@link UrlAccountCreator}
     * @see {@link NearConfig.masterAccount} and {@link NearConfig.helperUrl}-
     * 
     * @param accountId
     * @param publicKey
     */
    async createAccount(accountId: string, publicKey: PublicKey): Promise<Account> {
        if (!this.accountCreator) {
            throw new Error('Must specify account creator, either via masterAccount or helperUrl configuration settings.');
        }
        await this.accountCreator.createAccount(accountId, publicKey);
        return new Account(this.connection, accountId);
    }

    /**
     * @deprecated Use {@link Contract} instead.
     * @param contractId
     * @param options
     */
    async loadContract(contractId: string, options: { viewMethods: string[]; changeMethods: string[]; sender: string }): Promise<Contract> {
        const account = new Account(this.connection, options.sender);
        return new Contract(account, contractId, options);
    }

    /**
     * @deprecated Use {@link Account.sendMoney} instead.
     * @param amount
     * @param originator
     * @param receiver
     */
    async sendTokens(amount: BN, originator: string, receiver: string): Promise<string> {
        console.warn('near.sendTokens is deprecated. Use `yourAccount.sendMoney` instead.');
        const account = new Account(this.connection, originator);
        const result = await account.sendMoney(receiver, amount);
        return result.transaction_outcome.id;
    }
}
