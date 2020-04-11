const nearAPIJs = require('../../lib/index');

const InMemoryKeyStore = nearAPIJs.keyStores.InMemoryKeyStore;

describe('In-memory keystore', () => {
    let ctx = {};

    beforeAll(async () => {
        ctx.keyStore = new InMemoryKeyStore();
    });

    require('./keystore_common').shouldStoreAndRetriveKeys(ctx);
});
