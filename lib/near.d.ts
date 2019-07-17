import BN from 'bn.js';
import { Account } from './account';
import { Connection } from './connection';
import { Contract } from './contract';
import { AccountCreator } from './account_creator';
export declare class Near {
    readonly config: any;
    readonly connection: Connection;
    readonly accountCreator: AccountCreator;
    constructor(config: any);
    account(accountId: string): Promise<Account>;
    createAccount(accountId: string, publicKey: string): Promise<Account>;
    /**
     * Backwards compatibility method. Use `new nearlib.Contract(yourAccount, contractId, { viewMethods, changeMethods })` instead.
     * @param contractId
     * @param options
     */
    loadContract(contractId: string, options: {
        viewMethods: string[];
        changeMethods: string[];
        sender: string;
    }): Promise<Contract>;
    /**
     * Backwards compatibility method. Use `contractAccount.deployContract` or `yourAccount.createAndDeployContract` instead.
     * @param contractId
     * @param wasmByteArray
     */
    deployContract(contractId: string, wasmByteArray: Uint8Array): Promise<string>;
    /**
     * Backwards compatibility method. Use `yourAccount.sendMoney` instead.
     * @param amount
     * @param originator
     * @param receiver
     */
    sendTokens(amount: BN, originator: string, receiver: string): Promise<string>;
}
export declare function connect(config: any): Promise<Near>;
