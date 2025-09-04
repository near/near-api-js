import { describe, expect, it } from '@jest/globals';
import { KeyPair, KeyPairEd25519 } from '@near-js/crypto';
import { baseEncode } from '@near-js/utils';
import { makeEd25519KeyString } from '../src';

describe('makeEd25519KeyString regression', () => {
    const secretKey = Buffer.from(new Array(32).fill(1));
    const pubKey = Buffer.from(new Array(32).fill(2));

    it('should fail without the ed25519 prefix', () => {
        const bareKey = Buffer.concat([secretKey, pubKey]);
        const bareKeyString = baseEncode(bareKey);
        console.log('bareKeyString', bareKeyString);
        // @ts-expect-error testing invalid input
        expect(() => KeyPair.fromString(bareKeyString)).toThrow(
            'Invalid encoded key format, must be <curve>:<encoded key>'
        );
    });

    it('should return a string parsable by KeyPair.fromString', () => {
        const keyString = makeEd25519KeyString(secretKey, pubKey);
        const keyPair = KeyPair.fromString(keyString) as KeyPairEd25519;

        expect(keyPair).toBeInstanceOf(KeyPairEd25519);
        expect(keyPair.toString().startsWith('ed25519:')).toBe(true);
    });
});
