import { FinalExecutionOutcome } from '../providers';
import { Transaction } from '../transaction';
export interface Wallet {
    /** Creates a new FunctionCall key that is stored locally alongside with accountId.
     * Usually this information us stored in a dApp window.localStorage or extension storage) */
    requestSignIn: ({ contractId, methodNames }: SignInOptions) => Promise<boolean>;
    /** Returns true if FunctionCall key and accountId is saved in locals storage*/
    isSignedIn: () => boolean;
    /** Cleares function call key and accountId from local storage */
    signOut: () => boolean;
    /** Returns accounId from local storage or '' if it is not present */
    getAccountId: () => string;
    /** TODOD: looks like because of NEAR Wallet we will need to get rid of return type */
    /** TODOD: Should we return error type if transaction was not sent? */
    /** On excecution of this function wallet should check if it can use FunctionCall key
     * to sign transaction and do that wihtout any prompts if possible.
     * If this transaction requires FullAccess key,  user should be prompted.
     * On approval transaction should be signed and sent.
     * */
    requestSignTransactions: (params: RequestSignTransactionsOptions) => Promise<Array<FinalExecutionOutcome>>;
}
/**
 * These options will become a part of the newly created Function Call key.
 * {
    public_key: 'ed25519:<public key>',
    access_key: {
      nonce: <nonce>,
      permission: {
        FunctionCall: {
          allowance: null,
          receiver_id: '<contractId>',              <------ @param contracId goes here
          method_names: [<array of method names>] <------ @param methodNames goes here
        }
      }
    }
  }
 */
/**
 * Information to send NEAR wallet for signing transactions and redirecting the browser back to the calling application
 */
export interface RequestSignTransactionsOptions {
    /** list of transactions to sign */
    transactions: Transaction[];
    /** url NEAR Wallet will redirect to after transaction signing is complete */
    callbackUrl?: string;
    /** meta information wallet will send back to the application */
    meta?: string;
}
export interface SignInOptions {
    contractId?: string;
    methodNames?: string[];
    successUrl?: string;
    failureUrl?: string;
}
