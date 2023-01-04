const { InMemoryKeyStore } = require('../lib');

describe('In-memory keystore', () => {
    let ctx = {};

    beforeAll(async () => {
        ctx.keyStore = new InMemoryKeyStore();
    });

    require('./keystore_common').shouldStoreAndRetriveKeys(ctx);
});
