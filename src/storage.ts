if (typeof localStorage === 'undefined' || localStorage === null) {
    const { LocalStorage } = require('node-localstorage'); // eslint-disable-line @typescript-eslint/no-var-requires
    localStorage = new LocalStorage(process.env.NEAR_CACHE_DIR || '~/.near-api-js');
}

const BASE_KEY = 'near-api-js.internal-cache';

/**
 * A low-level wrapper around localStorage.getItem (using node-localstorage
 * library for Node). Prefer using one of these higher-level libraries instead:
 *   - {@link CompletedTransactions}
 */
export function get (key: string) {
    try {
        const serializedState = localStorage.getItem(key);
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error(`Something went wrong getting key:${key} from localStorage in near-api-js`);
        throw err;
    }
}

/**
 * A low-level wrapper around localStorage.setItem (using node-localstorage
 * library for Node). Prefer using one of these higher-level libraries instead:
 *   - {@link CompletedTransactions}
 */
export function set (key: string, state: any) {
    if (!key || !state) {
        throw new Error('expected two arguments, only got one');
    }
    const serializedState = JSON.stringify(state);
    localStorage.setItem(`${BASE_KEY}.${key}`, serializedState);
}
