const nearApi = require('../../src/index');

const InMemoryKeyStore = nearApi.keyStores.InMemoryKeyStore;

describe('In-memory keystore', () => {
    let ctx = {};

    beforeAll(async () => {
        ctx.keyStore = new InMemoryKeyStore();
    });

    require('./keystore_common').shouldStoreAndRetriveKeys(ctx);
});
