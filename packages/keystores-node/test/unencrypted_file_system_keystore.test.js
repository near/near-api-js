import { KeyPairEd25519 } from '@near-js/crypto';
import { promises as fs } from 'fs';
import path from 'path';
import rimrafPkg from 'rimraf';
import { promisify } from 'util';

import { UnencryptedFileSystemKeyStore } from '../lib/esm';
import { shouldStoreAndRetrieveKeys } from './keystore_common.js';

const rimraf = promisify(rimrafPkg);
const KEYSTORE_PATH = '../../test-keys';

describe('Unencrypted file system keystore', () => {
    let ctx = {};

    beforeAll(async () => {
        await rimraf(KEYSTORE_PATH);
        try {
            await fs.mkdir(KEYSTORE_PATH, { recursive: true });
        } catch (err) {
            if (err.code !== 'EEXIST') throw err;
        }
        ctx.keyStore = new UnencryptedFileSystemKeyStore(KEYSTORE_PATH);
    });

    shouldStoreAndRetrieveKeys(ctx);

    it('test path resolve', async() => {
        expect(ctx.keyStore.keyDir).toEqual(path.join(process.cwd(), KEYSTORE_PATH));
    });

    it('test public key exists', async () => {
        const key1 = KeyPairEd25519.fromRandom();
        await ctx.keyStore.setKey('network', 'account', key1);
        const keyFilePath = ctx.keyStore.getKeyFilePath('network', 'account');
        const content = await fs.readFile(keyFilePath);
        const accountInfo = JSON.parse(content.toString());
        expect(accountInfo.public_key).toEqual(key1.getPublicKey().toString());
    });
});
