import { Account } from '../account';
import { Connection } from '../connection';
import { Near } from '../near';
import { Wallet } from './interface';

export abstract class WalletConnection {
    /** @hidden */
    _wallet: Wallet;

    /** @hidden */
    _near: Near;

    /** @hidden */
    _connectedAccount: ConnectedWalletAccount;

    /**
    * @param {Near} near Near object
    * @param {string} appKeyPrefix application identifier
    */
    constructor(near: Near, appKeyPrefix: string | null, wallet: Wallet) {
        this._near = near;
        appKeyPrefix = appKeyPrefix || near.config.contractName || 'default';
        this._wallet = wallet;
    }

    abstract account(): Account;
}

/**
 * Object of this class should be returned by WalletConnection.account() method
 */
export abstract class ConnectedWalletAccount extends Account {
    walletConnection: WalletConnection;

    constructor(walletConnection: WalletConnection, connection: Connection, accountId: string) {
        super(connection, accountId);
        this.walletConnection = walletConnection;
    }
}