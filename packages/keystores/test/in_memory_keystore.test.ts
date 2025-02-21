import { beforeAll, describe } from '@jest/globals';
import { InMemoryKeyStore } from '../src';
import { shouldStoreAndRetrieveKeys } from './keystore_common';

describe('In-memory keystore', () => {
    const ctx: any = {};

    beforeAll(async () => {
        ctx.keyStore = new InMemoryKeyStore();
    });

    shouldStoreAndRetrieveKeys(ctx);
});
