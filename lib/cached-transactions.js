"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompletedTransactions = exports.getCachedTransactions = exports.markTransactionSucceeded = exports.markTransactionFailed = exports.cacheTransaction = void 0;
const storage = __importStar(require("./storage"));
const STORAGE_KEY = 'cachedTransactions';
/**
 * Add a transaction to the underlying cache. This is a low-level API called
 * internally when transactions are initiated via a changeMethod on a {@link Contract}
 * or via {@link Account.functionCall} and provided `meta` data
 *
 * @param tx the transaction to cache, requires all fields in {@link Tx}
 */
function cacheTransaction(tx) {
    storage.set(STORAGE_KEY, {
        ...getCachedTransactions(),
        [tx.hash]: { ...tx, complete: false }
    });
}
exports.cacheTransaction = cacheTransaction;
/**
 * Mark a cached transaction as having failed. This is a low-level API called
 * internally when transactions are initiated via a changeMethod on a {@link Contract}
 * or via {@link Account.functionCall} and provided `meta` data
 *
 * @param hash transaction hash of transaction to update
 * @param result FinalExecutionOutcome from RPC call
 * @param errorMessage a string with failure reason
 */
function markTransactionFailed(hash, result, errorMessage) {
    const txs = storage.get(STORAGE_KEY);
    const tx = txs[hash];
    if (!tx) {
        throw new Error(`No cached transaction with hash=${hash}`);
    }
    const updatedTx = {
        ...tx,
        ...result,
        complete: true,
        failed: true,
        error: errorMessage
    };
    storage.set(STORAGE_KEY, { ...txs, [hash]: updatedTx });
}
exports.markTransactionFailed = markTransactionFailed;
/**
 * Mark a cached transaction as having succeeded. This is a low-level API called
 * internally when transactions are initiated via a changeMethod on a {@link Contract}
 * or via {@link Account.functionCall} and provided `meta` data
 *
 * @param hash transaction hash of transaction to update
 * @param result FinalExecutionOutcome from RPC call
 */
function markTransactionSucceeded(hash, result) {
    const txs = storage.get(STORAGE_KEY);
    const tx = txs[hash];
    if (!tx) {
        throw new Error(`No cached transaction with hash=${hash}`);
    }
    const updatedTx = {
        ...tx,
        ...result,
        complete: true,
        failed: false
    };
    storage.set(STORAGE_KEY, { ...txs, [hash]: updatedTx });
}
exports.markTransactionSucceeded = markTransactionSucceeded;
/**
 * Remove an item from the underlying cache. Not for direct use, so not
 * exported. Prefer to use {@link CompletedTransactions} instead
 */
function removeCachedTransaction(hash) {
    const txs = getCachedTransactions();
    if (txs[hash]) {
        delete txs[hash];
        storage.set(STORAGE_KEY, txs);
    }
    else {
        console.error(new Error(`No cached transaction with hash=${hash}`));
    }
}
/**
 * Transactions are stored as an object for easy updates & removal,
 * but returned as an array for easier filtering. WARNING: this function
 * returns raw data from the cache; it is up to the consumer to ensure that the
 * cache stays accurate after operating on this data.
 */
function getCachedTransactions(filter) {
    const txs = storage.get(STORAGE_KEY);
    let arr = Object.keys(txs).reduce((arr, hash) => {
        arr.push(txs[hash]);
        return arr;
    }, []);
    if (filter)
        arr = arr.filter(filter);
    return arr;
}
exports.getCachedTransactions = getCachedTransactions;
/**
 * Get only completed transactions. This function is not exported to prevent
 * people from acting on completed transactions but forgetting to remove them
 * from the cache, causing bugs in their app when they try to act on the same
 * completed transactions again
 */
function getCompletedTransactions() {
    return getCachedTransactions()
        .filter(t => t.complete === true);
}
/**
 * A wrapper for the collection of completed, cached transactions which
 * provides safe interfaces for inspecting and removing them from the
 * underlying cache.
 */
class CompletedTransactions {
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
    remove(finder) {
        const found = getCompletedTransactions().find(finder);
        if (found) {
            removeCachedTransaction(found.hash);
            return found;
        }
        return null;
    }
}
exports.CompletedTransactions = CompletedTransactions;
