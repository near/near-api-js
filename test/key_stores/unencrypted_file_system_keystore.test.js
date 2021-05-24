
const rimraf  = require('util').promisify(require('rimraf'));

const nearApi = require('../../src/index');
const UnencryptedFileSystemKeyStore = nearApi.keyStores.UnencryptedFileSystemKeyStore;
const KeyPair = nearApi.utils.KeyPairEd25519;
const { ensureDir } = require('../test-utils');
const fs = require('fs');
const path = require('path');

const KEYSTORE_PATH = '../test-keys';

describe('Unencrypted file system keystore', () => {
    let ctx = {};

    beforeAll(async () => {
        await rimraf(KEYSTORE_PATH);
        await ensureDir(KEYSTORE_PATH);
        ctx.keyStore = new UnencryptedFileSystemKeyStore(KEYSTORE_PATH);
    });

    require('./keystore_common').shouldStoreAndRetriveKeys(ctx);

    it('test path resolve', async() => {
        expect(ctx.keyStore.keyDir).toEqual(path.join(process.cwd(), KEYSTORE_PATH));
    });

    it('test public key exists', async () => {
        const key1 = KeyPair.fromRandom();
        await ctx.keyStore.setKey('network', 'account', key1);
        const keyFilePath = ctx.keyStore.getKeyFilePath('network', 'account');
        const content = fs.readFileSync(keyFilePath);
        const accountInfo = JSON.parse(content.toString());
        expect(accountInfo.public_key).toEqual(key1.getPublicKey().toString());
    });
});
