
import BN from 'bn.js';
import { Account } from './account';
import { Connection } from './connection';
import { Contract } from './contract';
import { loadJsonFile } from './key_stores/unencrypted_file_system_keystore';
import { KeyPairEd25519 } from './utils/key_pair';
import { AccountCreator, LocalAccountCreator, UrlAccountCreator } from './account_creator';
import { InMemoryKeyStore, MergeKeyStore } from './key_stores';

export class Near {
    readonly config: any;
    readonly connection: Connection;
    readonly accountCreator: AccountCreator;

    constructor(config: any) {
        this.config = config;
        this.connection = Connection.fromConfig({
            networkId: config.networkId,
            provider: { type: 'JsonRpcProvider', args: { url: config.nodeUrl } },
            signer: { type: 'InMemorySigner', keyStore: config.deps.keyStore }
        });
        if (config.masterAccount) {
            // TODO: figure out better way of specifiying initial balance.
            this.accountCreator = new LocalAccountCreator(new Account(this.connection, config.masterAccount), new BN(config.initialBalance) || new BN(1000 * 1000 * 1000 * 1000));
        } else if (config.helperUrl) {
            this.accountCreator = new UrlAccountCreator(this.connection, config.helperUrl);
        } else {
            this.accountCreator = null;
        }
    }

    async account(accountId: string): Promise<Account> {
        const account = new Account(this.connection, accountId);
        await account.state();
        return account;
    }

    async createAccount(accountId: string, publicKey: string): Promise<Account> {
        if (!this.accountCreator) {
            throw new Error('Must specify account creator, either via masterAccount or helperUrl configuration settings.');
        }
        await this.accountCreator.createAccount(accountId, publicKey);
        return new Account(this.connection, accountId);
    }

    /**
     * Backwards compatibility method. Use `new nearlib.Contract(yourAccount, contractId, { viewMethods, changeMethods })` instead.
     * @param contractId
     * @param options
     */
    async loadContract(contractId: string, options: { viewMethods: string[], changeMethods: string[], sender: string }): Promise<Contract> {
        console.warn('near.loadContract is deprecated. Use `new nearlib.Contract(yourAccount, contractId, { viewMethods, changeMethods })` instead.');
        const account = new Account(this.connection, options.sender);
        return new Contract(account, contractId, options);
    }

    /**
     * Backwards compatibility method. Use `contractAccount.deployContract` or `yourAccount.createAndDeployContract` instead.
     * @param contractId
     * @param wasmByteArray
     */
    async deployContract(contractId: string, wasmByteArray: Uint8Array): Promise<string> {
        console.warn('near.deployContract is deprecated. Use `contractAccount.deployContract` or `yourAccount.createAndDeployContract` instead.');
        const account = new Account(this.connection, contractId);
        const result = await account.deployContract(wasmByteArray);
        return result.logs[0].hash;
    }

    /**
     * Backwards compatibility method. Use `yourAccount.sendMoney` instead.
     * @param amount
     * @param originator
     * @param receiver
     */
    async sendTokens(amount: BN, originator: string, receiver: string): Promise<string> {
        console.warn('near.sendTokens is deprecated. Use `yourAccount.sendMoney` instead.');
        const account = new Account(this.connection, originator);
        const result = await account.sendMoney(receiver, amount);
        return result.logs[0].hash;
    }
}

export async function connect(config: any): Promise<Near> {
    // Try to find extra key in `KeyPath` if provided.
    if (config.keyPath && config.deps && config.deps.keyStore) {
        try {
            const keyFile = await loadJsonFile(config.keyPath);
            if (keyFile.account_id) {
                // TODO: Only load key if network ID matches
                const keyPair = new KeyPairEd25519(keyFile.secret_key);
                const keyPathStore = new InMemoryKeyStore();
                await keyPathStore.setKey(config.networkId, keyFile.account_id, keyPair);
                if (!config.masterAccount) {
                    config.masterAccount = keyFile.account_id;
                }
                config.deps.keyStore = new MergeKeyStore([config.deps.keyStore, keyPathStore]);
                console.log(`Loaded master account ${keyFile.account_id} key from ${config.keyPath} with public key = ${keyPair.getPublicKey()}`);
            }
        } catch (error) {
            console.warn(`Failed to load master account key from ${config.keyPath}: ${error}`);
        }
    }
    return new Near(config);
}
