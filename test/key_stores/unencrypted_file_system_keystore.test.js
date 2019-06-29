
const nearlib = require('../../lib/index');

const { ensureDir } = require('../test-utils');

const UnencryptedFileSystemKeyStore = nearlib.keyStores.UnencryptedFileSystemKeyStore;

const KEYSTORE_PATH = '../test-keys';

describe('Unencrypted file system keystore', () => {
    let ctx = {};

    beforeAll(async () => {
        await ensureDir(KEYSTORE_PATH);
        ctx.keyStore = new UnencryptedFileSystemKeyStore(KEYSTORE_PATH);
    });

    require('./keystore_common').shouldStoreAndRetriveKeys(ctx);
});
