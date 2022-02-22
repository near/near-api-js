import { Account, SignAndSendTransactionOptions } from '../account';
import { Connection } from '../connection';
import { Near } from '../near';
import { FinalExecutionOutcome } from '../providers';
import { Action } from '../transaction';
import { PublicKey } from '../utils';
import { Wallet } from './interface';
export declare class WalletConnection {
    wallet: Wallet;
    /** @hidden */
    _near: Near;
    /**
    * @param {Near} _near Near object
    * @param {Walle} wallet Wallet object
    */
    constructor(near: Near, wallet: Wallet);
    /**
    * Returns the current connected wallet account
    */
    account(): Account;
}
/**
 * Object of this class should be returned by WalletConnection.account() method
 */
export declare class ConnectedWalletAccount extends Account {
    /** @hidden */
    _walletConnection: WalletConnection;
    constructor(walletConnection: WalletConnection, connection: Connection, accountId: string);
    /** Account.signAndSendTransaction() is using  requestSignTransaction()
     * function from wallet instead of standard implementation
     */
    signAndSendTransaction(options: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome>;
    /**
     * //TODO
     * @param accountId
     * @param receiverId
     * @param actions
     * @param localKey
     * @returns
     */
    accessKeyLocalForTransaction(accountId: string, receiverId: string, actions: Action[], localKey: PublicKey): Promise<import("../providers/provider").AccessKeyInfoView>;
}
