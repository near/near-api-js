import { expect, test, vi } from 'vitest';
import { Account, actions, baseEncode, KeyPair, KeyPairSigner, type Provider } from '../../../src/index.js';
import { InvalidNonceError } from '../../../src/rpc-errors/index.js';

test('invalid nonce retries invalidate the selected gas key lane and preserve other reservations', async () => {
    const key = KeyPair.fromRandom('ed25519');
    const result = { status: { SuccessValue: '' } };
    const methods = {
        viewAccessKey: vi.fn(async () => ({ nonce: 0n, permission: { GasKeyFullAccess: { num_nonces: 2 } } })),
        viewGasKeyNonces: vi
            .fn()
            .mockResolvedValueOnce({ nonces: [10, 20] })
            .mockResolvedValue({ nonces: [100, 200] }),
        viewBlock: vi.fn(async () => ({ header: { hash: baseEncode(new Uint8Array(32)) } })),
        sendTransactionUntil: vi
            .fn()
            .mockRejectedValueOnce(new InvalidNonceError(100, 11, '', ''))
            .mockResolvedValue(result),
    };
    const account = new Account('test.near', methods as unknown as Provider, new KeyPairSigner(key));

    await expect(
        account.signAndSendTransaction({ receiverId: 'receiver.near', actions: [actions.transfer(1n)] })
    ).resolves.toBe(result);
    expect(methods.sendTransactionUntil.mock.calls[0][0].transaction).toMatchObject({ nonce: 11n, nonceIndex: 0 });
    expect(methods.sendTransactionUntil.mock.calls[1][0].transaction).toMatchObject({ nonce: 21n, nonceIndex: 1 });

    const next = await account.createSignedTransaction({
        receiverId: 'receiver.near',
        actions: [actions.transfer(1n)],
    });
    expect(next.transaction).toMatchObject({ nonce: 101n, nonceIndex: 0 });
    expect(methods.viewGasKeyNonces).toHaveBeenCalledTimes(2);
    expect(methods.viewAccessKey).toHaveBeenCalledTimes(1);
});
