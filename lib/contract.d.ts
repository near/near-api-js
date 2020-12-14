import { Account } from './account';
import { ConnectedWalletAccount } from './wallet-account';
/**
 * Defines a smart contract on NEAR including the mutable and non-mutable methods
 */
export declare class Contract {
    readonly account: Account | ConnectedWalletAccount;
    readonly contractId: string;
    constructor(account: Account, contractId: string, options: {
        viewMethods: string[];
        changeMethods: string[];
    });
}
