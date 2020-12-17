import { FinalExecutionOutcome } from './providers';
import * as storage from './storage';

export type TxMetadata = { [key: string]: string | number };

export type BasicCachedTransaction = {
    hash: string;
    publicKey: string;
    receiverId: string;
    senderId: string;
};

type Tx = BasicCachedTransaction & {
    meta: TxMetadata;
};

type InitiatedTransaction = Tx & {
    complete: false;
};

type SuccessfulTransaction = Tx & FinalExecutionOutcome & {
    complete: true;
    failed: false;
};

type FailedTransaction = Tx & FinalExecutionOutcome & {
    complete: true;
    failed: true;
    error: string;
};

type CompletedTransaction = FailedTransaction | SuccessfulTransaction;

type CachedTransaction = InitiatedTransaction | CompletedTransaction;

const STORAGE_KEY = 'cachedTransactions';

/**
 * Add a transaction to the underlying cache. This is a low-level API called
 * internally when transactions are initiated via a changeMethod on a {@link Contract}
 * or via {@link Account.functionCall} and provided `meta` data
 *
 * @param tx the transaction to cache, requires all fields in {@link Tx}
 */
export function cacheTransaction (tx: Tx) {
    storage.set(STORAGE_KEY, {
        ...getCachedTransactions(),
        [tx.hash]: { ...tx, complete: false } as InitiatedTransaction
    });
}

/**
 * Mark a cached transaction as having failed. This is a low-level API called
 * internally when transactions are initiated via a changeMethod on a {@link Contract}
 * or via {@link Account.functionCall} and provided `meta` data
 *
 * @param hash transaction hash of transaction to update
 * @param result FinalExecutionOutcome from RPC call
 * @param errorMessage a string with failure reason
 */
export function markTransactionFailed (
    hash: string,
    result: FinalExecutionOutcome,
    errorMessage: string
) {
    const txs = storage.get(STORAGE_KEY);
    const tx = txs[hash] as InitiatedTransaction;
    if (!tx) {
        throw new Error(`No cached transaction with hash=${hash}`);
    }
    const updatedTx: FailedTransaction = {
        ...tx,
        ...result,
        complete: true,
        failed: true,
        error: errorMessage
    };
    storage.set(STORAGE_KEY, { ...txs, [hash]: updatedTx });
}

/**
 * Mark a cached transaction as having succeeded. This is a low-level API called
 * internally when transactions are initiated via a changeMethod on a {@link Contract}
 * or via {@link Account.functionCall} and provided `meta` data
 *
 * @param hash transaction hash of transaction to update
 * @param result FinalExecutionOutcome from RPC call
 */
export function markTransactionSucceeded (hash: string, result: FinalExecutionOutcome) {
    const txs = storage.get(STORAGE_KEY);
    const tx = txs[hash] as InitiatedTransaction;
    if (!tx) {
        throw new Error(`No cached transaction with hash=${hash}`);
    }
    const updatedTx: CompletedTransaction = {
        ...tx,
        ...result,
        complete: true,
        failed: false
    };
    storage.set(STORAGE_KEY, { ...txs, [hash]: updatedTx });
}

/**
 * Remove an item from the underlying cache. Not for direct use, so not
 * exported. Prefer to use {@link CompletedTransactions} instead
 */
function removeCachedTransaction (hash: string) {
    const txs = getCachedTransactions();
    if (txs[hash]) {
        delete txs[hash];
        storage.set(STORAGE_KEY, txs);
    } else {
        console.error(new Error(`No cached transaction with hash=${hash}`));
    }
}

/**
 * Transactions are stored as an object for easy updates & removal,
 * but returned as an array for easier filtering. WARNING: this function
 * returns raw data from the cache; it is up to the consumer to ensure that the
 * cache stays accurate after operating on this data.
 */
export function getCachedTransactions (
    filter?: (tx: CachedTransaction) => boolean
): CachedTransaction[] {
    const txs = storage.get(STORAGE_KEY);

    if (!txs) return [];

    let arr = Object.keys(txs).reduce(
        (arr: CachedTransaction[], hash: string) => {
            arr.push(txs[hash]);
            return arr;
        },
        []
    );

    if (filter) arr = arr.filter(filter);

    return arr;
}

/**
 * Get only completed transactions. This function is not exported to prevent
 * people from acting on completed transactions but forgetting to remove them
 * from the cache, causing bugs in their app when they try to act on the same
 * completed transactions again
 */
function getCompletedTransactions(): CompletedTransaction[] {
    return getCachedTransactions(t => t.complete === true) as CompletedTransaction[];
}

/**
 * A wrapper for the collection of completed, cached transactions which
 * provides safe interfaces for inspecting and removing them from the
 * underlying cache.
 */
export class CompletedTransactions {
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
    remove(finder: (tx: CompletedTransaction) => CompletedTransaction | null): CompletedTransaction | null {
        const found = getCompletedTransactions().find(finder);

        if (found) {
            removeCachedTransaction(found.hash);
            return found;
        }

        return null;
    }
}
