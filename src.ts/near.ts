
import BN from 'bn.js';
import { Account } from './account';
import { Connection } from './connection';
import { Contract } from './contract';
import { PublicKey } from './utils/key_pair';
import { AccountCreator, LocalAccountCreator, UrlAccountCreator } from './account_creator';

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

    async createAccount(accountId: string, publicKey: PublicKey): Promise<Account> {
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
     * Backwards compatibility method. Use `yourAccount.sendMoney` instead.
     * @param amount
     * @param originator
     * @param receiver
     */
    async sendTokens(amount: BN, originator: string, receiver: string): Promise<string> {
        console.warn('near.sendTokens is deprecated. Use `yourAccount.sendMoney` instead.');
        const account = new Account(this.connection, originator);
        const result = await account.sendMoney(receiver, amount);
        return result.transactions[0].hash;
    }
}

export async function connect(config: any): Promise<Near> {
    return new Near(config);
}
