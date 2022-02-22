import { Account, SignAndSendTransactionOptions } from '../account';
import { Connection } from '../connection';
import { Near } from '../near';
import { FinalExecutionOutcome } from '../providers';
import { Wallet } from './interface';

export class WalletConnection {
    /** @hidden */
    _wallet: Wallet;

    /** @hidden */
    _near: Near;

    /**
    * @param {Near} _near Near object
    * @param {Walle} _wallet Wallet object
    */
    constructor(near: Near, wallet: Wallet) {
        this._near = near;
        this._wallet = wallet;
    }

    /**
    * Returns the current connected wallet account
    */
    public account(): Account {
        if (this._wallet.isSignedIn()) {
            return new ConnectedWalletAccount(
                this,
                this._near.connection,
                this._wallet.getAccountId()
            );
        }
        console.warn("Can not create account object, user is not signed in");
        return null;
    }
}

/**
 * Object of this class should be returned by WalletConnection.account() method
 */
export class ConnectedWalletAccount extends Account {
    /** @hidden */
    _walletConnection: WalletConnection;

    constructor(walletConnection: WalletConnection, connection: Connection, accountId: string) {
        super(connection, accountId);
        this._walletConnection = walletConnection;
    }

    /** Account.signAndSendTransaction() is using  requestSignTransaction()
     * function from wallet instead of standard implementation
     */
    async signAndSendTransaction(options: SignAndSendTransactionOptions): Promise<FinalExecutionOutcome> {
        this._walletConnection._wallet.requestSignTransaction(options);
        // TODO: refactor to return result (use callbacks?)
        return null;
    }
}