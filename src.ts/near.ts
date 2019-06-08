
import { Account } from './account';
import { Connection } from './connection';
import { loadJsonFile } from './key_stores/unencrypted_file_system_keystore';
import { KeyPairEd25519 } from './utils/key_pair';
import { AccountCreator, LocalAccountCreator, UrlAccountCreator } from './account_creator';

class Near {
    readonly connection: Connection;
    readonly accountCreator: AccountCreator;

    constructor(config: any) {
        this.connection = Connection.fromConfig({
            networkId: config.networkId,
            provider: { type: 'JsonRpcProvider', args: { url: config.nodeUrl } },
            signer: { type: 'InMemorySigner', keyStore: config.deps.keyStore }
        });
        if (config.masterAccount !== undefined) {
            // TODO: figure out better way of specifiying initial balance.
            this.accountCreator = new LocalAccountCreator(new Account(this.connection, config.masterAccount), config.initialBalance || BigInt(1000 * 1000 * 1000 * 1000));
        } else if (config.helperUrl !== undefined) {
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
        if (this.accountCreator === null) {
            throw new Error('Must specify account creator, either via masterAccount or helperUrl configuration settings.');
        }
        await this.accountCreator.createAccount(accountId, publicKey);
        return new Account(this.connection, accountId)
    }
}

export async function connect(config: any): Promise<Near> {
    // Try to find extra key in `KeyPath` if provided.
    if (config.keyPath != undefined && config.deps !== undefined && config.deps.keyStore !== undefined) {
        const keyFile = await loadJsonFile(config.keyPath);
        if (keyFile.account_id !== undefined) {
            const keyPair = new KeyPairEd25519(keyFile.secret_key);
            await config.deps.keyStore.setKey(config.networkId, keyFile.account_id, keyPair);
            config.masterAccount = keyFile.account_id;
            console.log(`Loaded master account ${keyFile.account_id} key from ${config.keyPath} with public key = ${keyPair.getPublicKey()}`);
        }
    }
    return new Near(config)
}
