import { expect, test } from 'vitest';

import { NonceManager } from '../../../src/accounts/nonce-manager.js';
import { KeyPair, type Provider } from '../../../src/index.js';

const provider = {
    viewAccessKey: async () => ({ nonce: 100n }),
    viewGasKeyNonces: async () => ({ nonces: [10, 20] }),
} as unknown as Provider;

test('gas key lanes keep independent nonces', async () => {
    const pk = KeyPair.fromRandom('ed25519').getPublicKey();
    const manager = new NonceManager();

    expect(await manager.resolveNextNonce(pk, 'test.near', provider)).toBe(101n);
    expect(await manager.resolveNextNonce(pk, 'test.near', provider, 0)).toBe(11n);
    expect(await manager.resolveNextNonce(pk, 'test.near', provider, 1)).toBe(21n);
    expect(await manager.resolveNextNonce(pk, 'test.near', provider, 1)).toBe(22n);

    await manager.invalidate(pk, 1);
    expect(await manager.resolveNextNonce(pk, 'test.near', provider, 1)).toBe(21n);
    expect(await manager.resolveNextNonce(pk, 'test.near', provider, 0)).toBe(12n);

    await expect(manager.resolveNextNonce(pk, 'test.near', provider, 2)).rejects.toThrow(/out of range/);
});
