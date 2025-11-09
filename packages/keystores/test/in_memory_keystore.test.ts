import { beforeAll, describe } from 'bun:test';
import { InMemoryKeyStore } from '../src/index.js';
import { shouldStoreAndRetrieveKeys } from './keystore_common.js';

describe('In-memory keystore', () => {
    const ctx: any = {};

    beforeAll(async () => {
        ctx.keyStore = new InMemoryKeyStore();
    });

    shouldStoreAndRetrieveKeys(ctx);
});
