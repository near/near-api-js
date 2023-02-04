import localStorageMemory from 'localstorage-memory';

import { BrowserLocalStorageKeyStore } from '../lib/esm';
import { shouldStoreAndRetrieveKeys } from './keystore_common.js';

describe('Browser keystore', () => {
    let ctx = {};

    beforeAll(async () => {
        ctx.keyStore = new BrowserLocalStorageKeyStore(localStorageMemory);
    });

    shouldStoreAndRetrieveKeys(ctx);
});
