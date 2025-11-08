import { beforeAll, describe, expect, it } from 'bun:test';
import { KeyPairEd25519 } from '@near-js/crypto';
import * as fs from 'fs';
import { rimraf } from 'rimraf';
import { fileURLToPath } from 'url';

import { UnencryptedFileSystemKeyStore } from '../src/index.js';
import { shouldStoreAndRetriveKeys } from './keystore_common.js';

const KEYSTORE_PATH = fileURLToPath(new URL('../../test-keys', import.meta.url));

describe('Unencrypted file system keystore', () => {
    const ctx: { keyStore?: any } = {};

    beforeAll(() => {
        rimraf.sync(KEYSTORE_PATH);
        try {
            fs.mkdirSync(KEYSTORE_PATH, { recursive: true });
        } catch (err) {
            if (err.code !== 'EEXIST') throw err;
        }
        ctx.keyStore = new UnencryptedFileSystemKeyStore(KEYSTORE_PATH);
    });

    shouldStoreAndRetriveKeys(ctx);

    it('test path resolve', async () => {
        expect(ctx.keyStore.keyDir).toEqual(KEYSTORE_PATH);
    });

    it('test public key exists', async () => {
        const key1 = KeyPairEd25519.fromRandom();
        await ctx.keyStore.setKey('network', 'account', key1);
        const keyFilePath = ctx.keyStore.getKeyFilePath('network', 'account');
        const content = fs.readFileSync(keyFilePath).toString();
        const accountInfo = JSON.parse(content.toString());
        expect(accountInfo.public_key).toEqual(key1.getPublicKey().toString());
    });
});
