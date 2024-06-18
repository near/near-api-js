import { beforeAll, describe } from '@jest/globals';
import { shouldStoreAndRetrieveKeys } from './keystore_common';
import { InMemoryKeyStore } from '../src';

describe('In-memory keystore', () => {
    const ctx: any = {};

    beforeAll(async () => {
        ctx.keyStore = new InMemoryKeyStore();
    });

    shouldStoreAndRetrieveKeys(ctx);
});
