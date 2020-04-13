
const rimraf  = require('util').promisify(require('rimraf'));

const nearApi = require('../../lib/index');
const UnencryptedFileSystemKeyStore = nearApi.keyStores.UnencryptedFileSystemKeyStore;
const { ensureDir } = require('../test-utils');

const KEYSTORE_PATH = '../test-keys';

describe('Unencrypted file system keystore', () => {
    let ctx = {};

    beforeAll(async () => {
        await rimraf(KEYSTORE_PATH);
        await ensureDir(KEYSTORE_PATH);
        ctx.keyStore = new UnencryptedFileSystemKeyStore(KEYSTORE_PATH);
    });

    require('./keystore_common').shouldStoreAndRetriveKeys(ctx);
});
