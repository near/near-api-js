const { BrowserLocalStorageKeyStore, MultiContractBrowserLocalStorageKeyStore } = require('../lib');

describe('Browser keystore', () => {
    let ctx = {};

    beforeAll(async () => {
        ctx.keyStore = new BrowserLocalStorageKeyStore(require('localstorage-memory'));
    });

    require('./keystore_common').shouldStoreAndRetrieveKeys(ctx);
});


describe('Browser multi keystore', () => {
    let ctx = {};

    beforeAll(async () => {
        ctx.keyStore = new MultiContractBrowserLocalStorageKeyStore(require('localstorage-memory'));
    });

    require('./multi_contract_browser_keystore_common').shouldStoreAndRetrieveKeys(ctx);
});