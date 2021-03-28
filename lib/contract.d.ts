import BN from 'bn.js';
import { Account } from './account';
export interface ChangeMethodOptions {
    args: object;
    methodName: string;
    gas?: BN;
    attachedDeposit?: BN;
    meta?: string;
    callbackUrl?: string;
}
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
    private changeMethod;
}
