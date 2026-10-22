import type { Sandbox } from 'near-sandbox';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { Account, actions, KeyPair, KeyPairSigner, type PublicKey } from '../../../src/index.js';
import { InvalidNonceIndexError } from '../../../src/rpc-errors/index.js';
import { NEAR } from '../../../src/tokens/index.js';
import { createAccount, setUpTestConnection } from './test-utils.js';

let nearjs: Awaited<ReturnType<typeof setUpTestConnection>>;

beforeAll(async () => {
    nearjs = await setUpTestConnection();
});

afterAll(async () => {
    const sandbox = nearjs.sandbox as Sandbox;

    if (!sandbox) return;

    await sandbox.tearDown();
});

const finalityQuery = { finality: 'optimistic' } as const;

async function getGasKey(account: Account, publicKey: PublicKey) {
    const { permission } = await account.provider.viewAccessKey({
        accountId: account.accountId,
        publicKey,
        finalityQuery,
    });
    if (typeof permission !== 'object' || !('GasKeyFullAccess' in permission)) {
        throw new Error(`Expected a full access gas key, got ${JSON.stringify(permission)}`);
    }
    const { nonces } = await account.provider.viewGasKeyNonces({
        accountId: account.accountId,
        publicKey,
        finalityQuery,
    });
    return {
        balance: BigInt(permission.GasKeyFullAccess.balance),
        numNonces: permission.GasKeyFullAccess.num_nonces,
        nonces,
    };
}

test('add, fund, sign with, withdraw from and delete a gas key', async () => {
    const owner = await createAccount(nearjs);
    const receiver = await createAccount(nearjs);
    const gasKeyPair = KeyPair.fromRandom('ed25519');
    const publicKey = gasKeyPair.getPublicKey();

    // add: balance starts at 0
    await owner.addFullAccessGasKey(publicKey, 2);
    expect(await getGasKey(owner, publicKey)).toMatchObject({ balance: 0n, numNonces: 2 });

    // fund: any account can fund it, here the root account pays
    const funded = NEAR.toUnits('0.5');
    await nearjs.account.transferToGasKey(owner.accountId, publicKey, funded);
    const afterFund = await getGasKey(owner, publicKey);
    expect(afterFund.balance).toBe(funded);

    // sign on lane 1: gas comes from the gas key, the deposit from the account
    const gasAccount = new Account(owner.accountId, owner.provider, new KeyPairSigner(gasKeyPair));
    const accountBalanceBefore = (await owner.getState()).balance.total;
    await gasAccount.signAndSendTransaction({
        receiverId: receiver.accountId,
        actions: [actions.transfer(1n)],
        nonceIndex: 1,
    });

    const afterSend = await getGasKey(owner, publicKey);
    expect(afterSend.balance).toBeLessThan(funded);
    expect(afterSend.nonces[0]).toBe(afterFund.nonces[0]);
    expect(afterSend.nonces[1]).toBeGreaterThan(afterFund.nonces[1]);
    expect((await owner.getState()).balance.total).toBe(accountBalanceBefore - 1n);

    // a second transaction on the same lane reuses the cached nonce
    await gasAccount.signAndSendTransaction({
        receiverId: receiver.accountId,
        actions: [actions.transfer(1n)],
        nonceIndex: 1,
    });

    // a gas key can not sign a regular (V0) transaction
    await expect(
        gasAccount.signAndSendTransaction({ receiverId: receiver.accountId, actions: [actions.transfer(1n)] })
    ).rejects.toBeInstanceOf(InvalidNonceIndexError);

    // withdraw: only the owner can move the balance back to the account
    // gas refunds may still land on the gas key, so compare against the funded amount instead of a previous read
    const withdrawn = NEAR.toUnits('0.1');
    await owner.withdrawFromGasKey(publicKey, withdrawn);
    expect((await getGasKey(owner, publicKey)).balance).toBeLessThanOrEqual(funded - withdrawn);

    // delete: allowed while the balance is below 1 NEAR
    await owner.deleteKey(publicKey);
    const keys = await owner.getAccessKeyList();
    expect(keys.keys.map((key) => key.public_key)).not.toContain(publicKey.toString());
});
