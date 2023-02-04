import { InMemoryKeyStore } from '@near-js/keystores';

import { InMemorySigner } from '../lib/esm';

test('test no key', async() => {
    const signer = new InMemorySigner(new InMemoryKeyStore());
    await expect(signer.signMessage('message', 'user', 'network'))
        .rejects.toThrow(/Key for user not found in network/);
});
