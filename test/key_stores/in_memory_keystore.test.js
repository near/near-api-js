const nearlib = require('../../lib/index');

const InMemoryKeyStore = nearlib.keyStores.InMemoryKeyStore;

describe('In-memory keystore', () => {
    let ctx = {};

    beforeAll(async () => {
        ctx.keyStore = new InMemoryKeyStore();
    });

    require('./keystore_common').shouldStoreAndRetriveKeys(ctx);
});
