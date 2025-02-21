import { TextEncoder } from 'node:util';
import { expect, test } from '@jest/globals';
import { InMemoryKeyStore } from '@near-js/keystores';

import { InMemorySigner } from '../src';

global.TextEncoder = TextEncoder;

test('test no key', async () => {
    const signer = new InMemorySigner(new InMemoryKeyStore());
    // @ts-expect-error test input
    await expect(signer.signMessage('message', 'user', 'network')).rejects.toThrow(
        /Key for user not found in network/,
    );
});
