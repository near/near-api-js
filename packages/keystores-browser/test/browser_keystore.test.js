const { BrowserLocalStorageKeyStore } = require('../lib');

describe('Browser keystore', () => {
    let ctx = {};

    beforeAll(async () => {
        ctx.keyStore = new BrowserLocalStorageKeyStore(require('localstorage-memory'));
    });

    require('./keystore_common').shouldStoreAndRetrieveKeys(ctx);
});
