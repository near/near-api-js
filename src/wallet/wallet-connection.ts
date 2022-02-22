import { Account, SignAndSendTransactionOptions } from '../account';
import { Connection } from '../connection';
import { Near } from '../near';
import { FinalExecutionOutcome } from '../providers';
import { Action } from '../transaction';
import { PublicKey } from '../utils';
import { Wallet } from './interface';
import { accessKeyMatchesTransaction } from './utils';

export class WalletConnection {
    wallet: Wallet;

    /** @hidden */
    _near: Near;

    /**
    * @param {Near} _near Near object
    * @param {Walle} wallet Wallet object
    */
    constructor(near: Near, wallet: Wallet) {
        this._near = near;
        this.wallet = wallet;
    }

    /**
    * Returns the current connected wallet account
    */
    public account(): Account {
        if (this.wallet.isSignedIn()) {
            return new ConnectedWalletAccount(
                this,
                this._near.connection,
                this.wallet.getAccountId()
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
        /* TODO: we are trying to use a key from connection here, instead of key from wallet. Should we do that?
        * At can be considered as redundant "magic". If user is using WalletConneciton, he is not expected to use local key.
        */
        const localKey = await this.connection.signer.getPublicKey(this.accountId, this.connection.networkId);
        let accessKey = await this.accessKeyLocalForTransaction(this.accountId, options.receiverId, options.actions, localKey);
        if (!accessKey) {
            throw new Error(`Cannot find matching key for transaction sent to ${options.receiverId}`);
        }

        if (localKey && localKey.toString() === accessKey.public_key) {
            try {
                return await super.signAndSendTransaction({ receiverId: options.receiverId, actions: options.actions });
            } catch (e) {
                if (e.type === 'NotEnoughAllowance') {
                    // continue signing with wallet
                } else {
                    throw e;
                }
            }
        }
        this._walletConnection.wallet.requestSignTransaction(options);
        // TODO: refactor to return result (use callbacks?)
        return null;
    }

    /**
     * //TODO
     * @param accountId
     * @param receiverId
     * @param actions
     * @param localKey
     * @returns
     */
    async accessKeyLocalForTransaction(accountId: string, receiverId: string, actions: Action[], localKey: PublicKey) {
        const account = new Account(this.connection, accountId);
        const accessKeys = await account.getAccessKeys();
        const accessKey = accessKeys.find(key => key.public_key.toString() === localKey.toString());
        if (accessKey && await accessKeyMatchesTransaction(accountId, accessKey, receiverId, actions)) {
            return accessKey;
        }

        return null;
    }
}