
import BN from 'bn.js';
import { Account } from './account';
import { Connection } from './connection';
import { Signer } from './signer';
import { Contract } from './contract';
import { readKeyFile } from './key_stores/unencrypted_file_system_keystore';
import { PublicKey } from './utils/key_pair';
import { AccountCreator, LocalAccountCreator, UrlAccountCreator } from './account_creator';
import { InMemoryKeyStore, KeyStore, MergeKeyStore } from './key_stores';

type NearConfig = {
  keyStore?: KeyStore;
  signer?: Signer;
  deps?: { keyStore: KeyStore };
  helperUrl?: string;
  initialBalance?: string;
  masterAccount?: string;
  networkId: string;
  nodeUrl: string;
  walletUrl?: string;
}

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
     *
     * @param accountId near accountId used to interact with the network.
     */
    async account(accountId: string): Promise<Account> {
        const account = new Account(this.connection, accountId);
        await account.state();
        return account;
    }

    /**
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
     * @deprecated Use `new nearApi.Contract(yourAccount, contractId, { viewMethods, changeMethods })` instead.
     * @param contractId
     * @param options
     */
    async loadContract(contractId: string, options: { viewMethods: string[]; changeMethods: string[]; sender: string }): Promise<Contract> {
        const account = new Account(this.connection, options.sender);
        return new Contract(account, contractId, options);
    }

    /**
     * @deprecated Use `yourAccount.sendMoney` instead.
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

type ConnectConfig = NearConfig & {
  keyPath?: string;
}

/**
 * Initialize connection to Near network.
 */
export async function connect(config: ConnectConfig): Promise<Near> {
    // Try to find extra key in `KeyPath` if provided.
    if (config.keyPath && config.deps && config.deps.keyStore) {
        try {
            const accountKeyFile = await readKeyFile(config.keyPath);
            if (accountKeyFile[0]) {
                // TODO: Only load key if network ID matches
                const keyPair = accountKeyFile[1];
                const keyPathStore = new InMemoryKeyStore();
                await keyPathStore.setKey(config.networkId, accountKeyFile[0], keyPair);
                if (!config.masterAccount) {
                    config.masterAccount = accountKeyFile[0];
                }
                config.deps.keyStore = new MergeKeyStore([config.deps.keyStore, keyPathStore]);
                console.log(`Loaded master account ${accountKeyFile[0]} key from ${config.keyPath} with public key = ${keyPair.getPublicKey()}`);
            }
        } catch (error) {
            console.warn(`Failed to load master account key from ${config.keyPath}: ${error}`);
        }
    }
    return new Near(config);
}
