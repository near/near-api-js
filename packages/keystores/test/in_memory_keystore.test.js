import { InMemoryKeyStore } from '../lib/esm';
import { shouldStoreAndRetrieveKeys } from './keystore_common.js';

describe('In-memory keystore', () => {
    let ctx = {};

    beforeAll(async () => {
        ctx.keyStore = new InMemoryKeyStore();
    });

    shouldStoreAndRetrieveKeys(ctx);
});
