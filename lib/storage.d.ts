/**
 * A low-level wrapper around localStorage.getItem (using node-localstorage
 * library for Node). Prefer using one of these higher-level libraries instead:
 *   - {@link CompletedTransactions}
 */
export declare function get(key: string): any;
/**
 * A low-level wrapper around localStorage.setItem (using node-localstorage
 * library for Node). Prefer using one of these higher-level libraries instead:
 *   - {@link CompletedTransactions}
 */
export declare function set(key: string, state: any): void;
