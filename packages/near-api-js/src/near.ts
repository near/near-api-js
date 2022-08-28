/**
 * This module contains the main class developers will use to interact with NEAR.
 * The {@link Near} class is used to interact with {@link account!Account | Accounts} through the {@link providers/json-rpc-provider!JsonRpcProvider}.
 * It is configured via the {@link NearConfig}.
 * 
 * @see [https://docs.near.org/tools/near-api-js/quick-reference#account](https://docs.near.org/tools/near-api-js/quick-reference#account)
 * 
 * @module near
 */
import BN from 'bn.js';
import { Account } from './account';
import { Connection } from './connection';
import { Signer } from './signer';
import { PublicKey } from './utils/key_pair';
import { AccountCreator, LocalAccountCreator, UrlAccountCreator } from './account_creator';
import { KeyStore } from './key_stores';

export interface NearConfig {
    /** Holds {@link utils/key_pair!KeyPair | KeyPairs} for signing transactions */
    keyStore?: KeyStore;

    /** @hidden */
    signer?: Signer;

    /**
     * [NEAR Contract Helper](https://github.com/near/near-contract-helper) url used to create accounts if no master account is provided
     * @see {@link account_creator!UrlAccountCreator}
     */
    helperUrl?: string;

    /**
     * The balance transferred from the {@link masterAccount} to a created account
     * @see {@link account_creator!LocalAccountCreator}
     */
    initialBalance?: string;

    /**
     * The account to use when creating new accounts
     * @see {@link account_creator!LocalAccountCreator}
     */
    masterAccount?: string;

    /**
     * {@link utils/key_pair!KeyPair | KeyPairs} are stored in a {@link key_stores/keystore!KeyStore} under the `networkId` namespace.
     */
    networkId: string;

    /**
     * NEAR RPC API url. used to make JSON RPC calls to interact with NEAR.
     * @see {@link providers/json-rpc-provider!JsonRpcProvider}
     */
    nodeUrl: string;

    /**
     * NEAR RPC API headers. Can be used to pass API KEY and other parameters.
     * @see {@link providers/json-rpc-provider!JsonRpcProvider}
     */
    headers?: { [key: string]: string | number };

    /**
     * NEAR wallet url used to redirect users to their wallet in browser applications.
     * @see [https://wallet.near.org/](https://wallet.near.org/)
     */
    walletUrl?: string;

    /**
     * JVSM account ID for NEAR JS SDK
     */
    jsvmAccountId?: string;
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
            provider: { type: 'JsonRpcProvider', args: { url: config.nodeUrl, headers: config.headers } },
            signer: config.signer || { type: 'InMemorySigner', keyStore: config.keyStore },
            jsvmAccountId: config.jsvmAccountId || `jsvm.${config.networkId}`
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
     * Create an account using the {@link account_creator!AccountCreator}. Either:
     * * using a masterAccount with {@link account_creator!LocalAccountCreator}
     * * using the helperUrl with {@link account_creator!UrlAccountCreator}
     * @see {@link NearConfig.masterAccount} and {@link NearConfig.helperUrl}
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
}
