import { expect, test, vi } from 'vitest';
import { NonceManager } from '../../../src/accounts/nonce-manager.js';
import { KeyPair, type Provider } from '../../../src/index.js';

const pk = KeyPair.fromRandom('ed25519').getPublicKey();
const accountId = 'test.near';

function mockProvider(permission: unknown = 'FullAccess', nonces = [10, 20]) {
    const methods = {
        viewAccessKey: vi.fn(async () => ({ nonce: 100n, permission })),
        viewGasKeyNonces: vi.fn(async () => ({ nonces })),
    };
    return { methods, provider: methods as unknown as Provider };
}

test('regular keys increment and refresh their nonce without selecting a lane', async () => {
    const { methods, provider } = mockProvider();
    const manager = new NonceManager();
    expect(await manager.resolveNextNonce(pk, accountId, provider)).toEqual({ nonce: 101n });
    expect(await manager.resolveNextNonce(pk, accountId, provider)).toEqual({ nonce: 102n });
    expect(methods.viewAccessKey).toHaveBeenCalledTimes(1);
    expect(methods.viewGasKeyNonces).not.toHaveBeenCalled();
    await manager.invalidate(pk);
    expect(await manager.resolveNextNonce(pk, accountId, provider)).toEqual({ nonce: 101n });
    expect(methods.viewAccessKey).toHaveBeenCalledTimes(2);
});

test.each(['GasKeyFullAccess', 'GasKeyFunctionCall'])(
    '%s automatically rotates lanes and reserves distinct nonces concurrently',
    async (permission) => {
        const { methods, provider } = mockProvider({ [permission]: { num_nonces: 3 } }, [10, 20, 30]);
        const manager = new NonceManager();
        const reservations = await Promise.all(
            Array.from({ length: 6 }, () => manager.resolveNextNonce(pk, accountId, provider))
        );
        expect(reservations).toEqual([
            { nonce: 11n, nonceIndex: 0 },
            { nonce: 21n, nonceIndex: 1 },
            { nonce: 31n, nonceIndex: 2 },
            { nonce: 12n, nonceIndex: 0 },
            { nonce: 22n, nonceIndex: 1 },
            { nonce: 32n, nonceIndex: 2 },
        ]);
        expect(methods.viewAccessKey).toHaveBeenCalledTimes(1);
        expect(methods.viewGasKeyNonces).toHaveBeenCalledTimes(1);
    }
);

test('rotation uses all 1024 configured lanes before reusing the first', async () => {
    const { provider } = mockProvider({ GasKeyFullAccess: { num_nonces: 1024 } }, Array(1024).fill(0));
    const manager = new NonceManager();
    const reservations = await Promise.all(
        Array.from({ length: 1025 }, () => manager.resolveNextNonce(pk, accountId, provider))
    );
    expect(reservations.slice(0, 1024)).toEqual(
        Array.from({ length: 1024 }, (_, nonceIndex) => ({ nonce: 1n, nonceIndex }))
    );
    expect(reservations[1024]).toEqual({ nonce: 2n, nonceIndex: 0 });
});

test('invalidating a gas key lane refreshes it without discarding other cached nonces', async () => {
    const { methods, provider } = mockProvider({ GasKeyFullAccess: { num_nonces: 2 } });
    const manager = new NonceManager();
    await manager.resolveNextNonce(pk, accountId, provider);
    await manager.resolveNextNonce(pk, accountId, provider);
    await manager.invalidate(pk, 0);
    methods.viewGasKeyNonces.mockResolvedValue({ nonces: [100, 200] });
    expect(await manager.resolveNextNonce(pk, accountId, provider)).toEqual({ nonce: 101n, nonceIndex: 0 });
    expect(await manager.resolveNextNonce(pk, accountId, provider)).toEqual({ nonce: 22n, nonceIndex: 1 });
    expect(methods.viewAccessKey).toHaveBeenCalledTimes(1);
    expect(methods.viewGasKeyNonces).toHaveBeenCalledTimes(2);
});

test('a failed chain query releases the lock and allows initialization to retry', async () => {
    const { methods, provider } = mockProvider();
    const manager = new NonceManager();
    methods.viewAccessKey.mockRejectedValueOnce(new Error('RPC unavailable'));
    const results = await Promise.allSettled([
        manager.resolveNextNonce(pk, accountId, provider),
        manager.resolveNextNonce(pk, accountId, provider),
    ]);
    expect(results[0]).toMatchObject({ status: 'rejected', reason: new Error('RPC unavailable') });
    expect(results[1]).toEqual({ status: 'fulfilled', value: { nonce: 101n } });
});

test('rejects a gas key with no nonce lanes', async () => {
    const { provider } = mockProvider({ GasKeyFullAccess: { num_nonces: 0 } }, []);
    await expect(new NonceManager().resolveNextNonce(pk, accountId, provider)).rejects.toThrow('no nonce lanes');
});
