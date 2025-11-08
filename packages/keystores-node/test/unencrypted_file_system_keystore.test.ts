import { beforeAll, describe, expect, it } from 'bun:test';
import { KeyPairEd25519 } from '@near-js/crypto';
import * as fs from 'fs';
import * as path from 'path';
import { rimraf } from 'rimraf';

import { UnencryptedFileSystemKeyStore } from '../src';
import { shouldStoreAndRetriveKeys } from './keystore_common';

const KEYSTORE_PATH = '../../test-keys';

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

    it('test path resolve', async() => {
        expect(ctx.keyStore.keyDir).toEqual(path.join(process.cwd(), KEYSTORE_PATH));
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
