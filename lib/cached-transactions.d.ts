import { FinalExecutionOutcome } from './providers';
export declare type TxMetadata = {
    [key: string]: string | number;
};
export declare type BasicCachedTransaction = {
    hash: string;
    publicKey: string;
    receiverId: string;
    signedTx: string;
};
declare type Tx = BasicCachedTransaction & {
    meta: TxMetadata;
};
declare type InitiatedTransaction = Tx & {
    complete: false;
};
declare type SuccessfulTransaction = Tx & FinalExecutionOutcome & {
    complete: true;
    failed: false;
};
declare type FailedTransaction = Tx & FinalExecutionOutcome & {
    complete: true;
    failed: true;
    error: string;
};
declare type CompletedTransaction = FailedTransaction | SuccessfulTransaction;
declare type CachedTransaction = InitiatedTransaction | CompletedTransaction;
/**
 * Add a transaction to the underlying cache. This is a low-level API called
 * internally when transactions are initiated via a changeMethod on a {@link Contract}
 * or via {@link Account.functionCall} and provided `meta` data
 *
 * @param tx the transaction to cache, requires all fields in {@link Tx}
 */
export declare function cacheTransaction(tx: Tx): void;
/**
 * Mark a cached transaction as having failed. This is a low-level API called
 * internally when transactions are initiated via a changeMethod on a {@link Contract}
 * or via {@link Account.functionCall} and provided `meta` data
 *
 * @param hash transaction hash of transaction to update
 * @param result FinalExecutionOutcome from RPC call
 * @param errorMessage a string with failure reason
 */
export declare function markTransactionFailed(hash: string, result: FinalExecutionOutcome, errorMessage: string): void;
/**
 * Mark a cached transaction as having succeeded. This is a low-level API called
 * internally when transactions are initiated via a changeMethod on a {@link Contract}
 * or via {@link Account.functionCall} and provided `meta` data
 *
 * @param hash transaction hash of transaction to update
 * @param result FinalExecutionOutcome from RPC call
 */
export declare function markTransactionSucceeded(hash: string, result: FinalExecutionOutcome): void;
/**
 * Transactions are stored as an object for easy updates & removal,
 * but returned as an array for easier filtering. WARNING: this function
 * returns raw data from the cache; it is up to the consumer to ensure that the
 * cache stays accurate after operating on this data.
 */
export declare function getCachedTransactions(filter?: (tx: CachedTransaction) => boolean): CachedTransaction[];
/**
 * A wrapper for the collection of completed, cached transactions which
 * provides safe interfaces for inspecting and removing them from the
 * underlying cache.
 */
export declare class CompletedTransactions {
    /**
     * Find and remove an item from the cache. Works like `Array.prototype.find`,
     * but removes the item from the underlying cache if found.
     *
     * If you pass `meta` data to a `changeMethod` on a {@link Contract} or to
     * {@link Account.functionCall}, the transaction will be automatically
     * added to a cache. Whether or not the function call results in a redirect
     * to NEAR Wallet, your app can then call {@link CompletedTransactions.remove},
     * and find the transaction using the provided `meta` data, to determine
     * the outcome of the transaction and update app state accordingly.
     *
     * Example:
     *
     * ```js
     * const id = 1; // this is specific to and tracked by your app
     * const completedTx = new CompletedTransactions().remove(tx => tx.meta.id === id)
     * if (completedTx) {
     *   // do app stuff, dealing with completed transaction
     * } else {
     *   const contract = new Contract(someAccount, 'some-address', { changeMethods: ['doThing'] })
     *   contract.doThing(
     *     { arg1: 'whatever' }, // arguments passed to `doThing` method
     *     { meta: { id } } // options for near-api-js
     *   )
     * }
     * ```
     */
    remove(finder: (tx: CompletedTransaction) => CompletedTransaction | null): CompletedTransaction | null;
}
export {};
