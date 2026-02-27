import { expect, test } from 'vitest';
import { parseSeedPhrase } from '../../../src/seed-phrase/index.js';

test.each<[string, string, string]>([
    [
        'tag interest match crew twin proof cushion visit ball square aim armed',
        'ed25519:9uMmkWHWqnqwFcAhH2tS3x3cc4hzGKa5TGWFajMXGkDX',
        'ed25519:3N6TYZVRrkQxh4BJZM8rQzVRdLUS4BBHXRMuBT1L3tykZR8keAxWhxjACFcZPTxNGtnQv2hQhx8bh1Bd9o3iYR5j',
    ],
    [
        'square rice stick toe deposit camp improve grain obvious impulse dash author',
        'ed25519:Awgg1QqbEdSfnSDxbcnHECpLTEuKmryME72qhKQbm29',
        'ed25519:4g3CWPCUdHeFQ8Kvt9xk5XvCLavk8zxXjKyv41MbFnQ19ijkmr6mXiSVGqoJ7tnkSWSx97hjk9A3SfjFY6jFz3iR',
    ],
    [
        'throw twice purpose manage double service erosion grace relax broom badge valid',
        'ed25519:EaQnZxCMwh9yhkqW2XE2umd21iNmXep1BkM6Wtw2Qr1b',
        'ed25519:5eGSNZ87465cef2gv84XruSfHSaraTK9ukhQ6ZiUbegfMKXoPZEH3Jeji8WDJh5771QoUvhpbei11yMKXLSGKeiH',
    ],
])('parseSeedPhrase($0) returns KeyPair($1, $2)', (seedPhrase, publicKey, secretKey) => {
    const key = parseSeedPhrase(seedPhrase);

    expect(key.getPublicKey().toString()).toBe(publicKey);
    expect(key.toString()).toBe(secretKey);
});
