import { Account } from './account';
/**
 * Defines a smart contract on NEAR including the mutable and non-mutable methods
 */
export declare class Contract {
    readonly account: Account;
    readonly contractId: string;
    constructor(account: Account, contractId: string, options: {
        viewMethods: string[];
        changeMethods: string[];
    });
}
