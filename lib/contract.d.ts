import { Account } from './account';
export declare class Contract {
    readonly account: Account;
    readonly contractId: string;
    constructor(account: Account, contractId: string, options: {
        viewMethods: string[];
        changeMethods: string[];
    });
}
