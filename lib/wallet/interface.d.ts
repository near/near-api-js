import { SignAndSendTransactionOptions } from '../account';
import { Transaction } from '../transaction';
/**
 * This interface is expected to be implemented as a single wallet or wallet selector and passed to WalletConnection.
 * dApp Developers should not make any adjustments for any particular wallet or wallet selector.
 * requestSignIn() and requestSignTransactions() functions does not have return type. Their execution results
 * should be retrieved from callbacks.
 */
export interface Wallet {
    /**
     * Creates a new FunctionCall key that is stored locally alongside with accountId.
     * Usually this information is stored in a dApp window.localStorage or extension storage.
     */
    requestSignIn: ({ contractId, methodNames }: SignInOptions) => void;
    /**
     * Returns true if FunctionCall key and accountId is saved in locals storage.
     */
    isSignedIn: () => boolean;
    /**
     * Cleares function call key and accountId from local storage.
     */
    signOut: () => boolean;
    /**
     * Returns accounId from local storage or '' if it is not present.
     */
    getAccountId: () => string;
    /**
     * On excecution of this function wallet should check if it can use FunctionCall key
     * to sign transaction and do that wihtout any prompts if possible.
     * If this transaction requires FullAccess key,  user should be prompted.
     * On approval transaction should be signed and sent.
     */
    requestSignTransaction: (options: SignAndSendTransactionOptions) => void;
    requestSignTransactions: (options: RequestSignTransactionsOptions) => void;
}
/**
 * Information to send to the wallet to create a new Function Call key.
 * {
      public_key: 'ed25519:<public key>',
      access_key: {
        nonce: <nonce>,
        permission: {
          FunctionCall: {
            allowance: null,
            receiver_id: '<contractId>',              <------ @param contracId goes here
            method_names: [<array of method names>]   <------ @param methodNames goes here
          }
        }
      }
    }
*/
export interface SignInOptions {
    contractId?: string;
    methodNames?: string[];
    successUrl?: string;
    failureUrl?: string;
}
export interface RequestSignTransactionsOptions {
    /** list of transactions to sign */
    transactions: Transaction[];
    /** url NEAR Wallet will redirect to after transaction signing is complete */
    callbackUrl?: string;
    /** meta information NEAR Wallet will send back to the application. `meta` will be attached to the `callbackUrl` as a url search param */
    meta?: string;
}
