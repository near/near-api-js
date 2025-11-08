import { beforeAll, describe } from 'bun:test';
import LocalStorageMemory from 'localstorage-memory';

import { BrowserLocalStorageKeyStore, MultiContractBrowserLocalStorageKeyStore } from '../src/index.js';
import { shouldStoreAndRetrieveKeys } from './keystore_common.js';

describe('Browser keystore', () => {
    const ctx: any = {};

    beforeAll(async () => {
        ctx.keyStore = new BrowserLocalStorageKeyStore(LocalStorageMemory);
    });

    shouldStoreAndRetrieveKeys(ctx);
});

describe('Browser multi keystore', () => {
    const ctx: any = {};

    beforeAll(async () => {
        ctx.keyStore = new MultiContractBrowserLocalStorageKeyStore(LocalStorageMemory);
    });

    shouldStoreAndRetrieveKeys(ctx);
});
