import { beforeAll, describe } from '@jest/globals';
import LocalStorageMemory from 'localstorage-memory';

import { BrowserLocalStorageKeyStore, MultiContractBrowserLocalStorageKeyStore } from '../src';
import { shouldStoreAndRetrieveKeys } from './keystore_common';

describe('Browser keystore', () => {
    let ctx: any = {};

    beforeAll(async () => {
        ctx.keyStore = new BrowserLocalStorageKeyStore(LocalStorageMemory);
    });

    shouldStoreAndRetrieveKeys(ctx);
});

describe('Browser multi keystore', () => {
    let ctx: any = {};

    beforeAll(async () => {
        ctx.keyStore = new MultiContractBrowserLocalStorageKeyStore(LocalStorageMemory);
    });

    shouldStoreAndRetrieveKeys(ctx);
});
