import type { Sandbox } from 'near-sandbox';
import { afterAll, beforeAll, expect, test } from 'vitest';
import {
    Account,
    actions,
    baseDecode,
    createTransaction,
    KeyPair,
    KeyPairSigner,
    type PublicKey,
} from '../../../src/index.js';
import { InvalidNonceIndexError } from '../../../src/rpc-errors/index.js';
import { NEAR } from '../../../src/tokens/index.js';
import { createAccount, deployContract, generateUniqueString, setUpTestConnection } from './test-utils.js';

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

    // transfer automatically selects lane 0: gas comes from the key, the deposit from the account
    const gasAccount = new Account(owner.accountId, owner.provider, new KeyPairSigner(gasKeyPair));
    const accountBalanceBefore = (await owner.getState()).balance.total;
    await gasAccount.transfer({ receiverId: receiver.accountId, amount: 1n });

    const afterSend = await getGasKey(owner, publicKey);
    expect(afterSend.balance).toBeLessThan(funded);
    expect(afterSend.nonces[0]).toBeGreaterThan(afterFund.nonces[0]);
    expect(afterSend.nonces[1]).toBe(afterFund.nonces[1]);
    expect((await owner.getState()).balance.total).toBe(accountBalanceBefore - 1n);

    // batches automatically rotate through lane 1, then reuse lane 0's cached nonce
    await gasAccount.signAndSendTransactions({
        transactions: [
            { receiverId: receiver.accountId, actions: [actions.transfer(1n)] },
            { receiverId: receiver.accountId, actions: [actions.transfer(1n)] },
        ],
    });
    const afterBatch = await getGasKey(owner, publicKey);
    expect(afterBatch.nonces[0]).toBeGreaterThan(afterSend.nonces[0]);
    expect(afterBatch.nonces[1]).toBeGreaterThan(afterSend.nonces[1]);

    // manually constructing a V0 transaction still fails when signed by a gas key
    const block = await owner.provider.viewBlock({ finality: 'final' });
    const transaction = createTransaction(
        owner.accountId,
        publicKey,
        receiver.accountId,
        1n,
        [actions.transfer(1n)],
        baseDecode(block.header.hash)
    );
    const { signedTransaction } = await new KeyPairSigner(gasKeyPair).signTransaction(transaction);
    await expect(owner.provider.sendTransactionUntil(signedTransaction, 'EXECUTED_OPTIMISTIC')).rejects.toBeInstanceOf(
        InvalidNonceIndexError
    );

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

test('function call gas keys work through callFunction and callFunctionRaw without specifying a lane', async () => {
    const owner = await createAccount(nearjs);
    const contract = await deployContract(nearjs.account, generateUniqueString('gas-contract'));
    const keyPair = KeyPair.fromRandom('ed25519');
    const publicKey = keyPair.getPublicKey();
    await owner.addFunctionCallGasKey({
        publicKey,
        contractId: contract.contractId,
        methodNames: ['setValue'],
        numNonces: 2,
    });
    await nearjs.account.transferToGasKey(owner.accountId, publicKey, NEAR.toUnits('0.5'));
    const params = { accountId: owner.accountId, publicKey, finalityQuery };
    const before = await owner.provider.viewGasKeyNonces(params);
    const account = new Account(owner.accountId, owner.provider, new KeyPairSigner(keyPair));

    await account.callFunction({ contractId: contract.contractId, methodName: 'setValue', args: { value: 'first' } });
    await account.callFunctionRaw({
        contractId: contract.contractId,
        methodName: 'setValue',
        args: { value: 'second' },
    });

    expect(await contract.view.getValue()).toBe('second');
    const after = await owner.provider.viewGasKeyNonces(params);
    expect(after.nonces[0]).toBeGreaterThan(before.nonces[0]);
    expect(after.nonces[1]).toBeGreaterThan(before.nonces[1]);
});
