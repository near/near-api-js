import { beforeAll, describe } from '@jest/globals';
import LocalStorageMemory from 'localstorage-memory';

import { BrowserLocalStorageKeyStore } from '../src';
import { shouldStoreAndRetrieveKeys } from './keystore_common';

describe('Browser keystore', () => {
    const ctx: any = {};

    beforeAll(async () => {
        ctx.keyStore = new BrowserLocalStorageKeyStore(LocalStorageMemory);
    });

    shouldStoreAndRetrieveKeys(ctx);
});
