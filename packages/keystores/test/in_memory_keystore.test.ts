import { beforeAll, describe } from 'bun:test';
import { shouldStoreAndRetrieveKeys } from './keystore_common.js';
import { InMemoryKeyStore } from '../src/index.js';

describe('In-memory keystore', () => {
    const ctx: any = {};

    beforeAll(async () => {
        ctx.keyStore = new InMemoryKeyStore();
    });

    shouldStoreAndRetrieveKeys(ctx);
});
