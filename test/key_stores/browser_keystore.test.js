const nearApi = require('../../lib/index');

const BrowserLocalStorageKeyStore = nearApi.keyStores.BrowserLocalStorageKeyStore;

describe('Browser keystore', () => {
    let ctx = {};

    beforeAll(async () => {
        ctx.keyStore = new BrowserLocalStorageKeyStore(require('localstorage-memory'));
    });

    require('./keystore_common').shouldStoreAndRetriveKeys(ctx);
});
