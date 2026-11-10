import { readFileSync } from 'node:fs';
import { sha256 } from '@noble/hashes/sha2.js';
import { DEFAULT_ACCOUNT_ID, DEFAULT_PRIVATE_KEY, Sandbox } from 'near-sandbox';
import { afterAll, beforeAll, expect, test, vi } from 'vitest';
import { Account, baseEncode, DeterministicStateInit, JsonRpcProvider, nearToYocto } from '../../src/index.js';

let sandbox: Sandbox;
let root: Account;
const code = readFileSync(new URL('../contracts/guestbook/contract.wasm', import.meta.url));
const hash = baseEncode(sha256(code));

async function finalized(transaction: Awaited<ReturnType<Account['signAndSendTransaction']>>) {
    const result = await root.provider.viewTransactionStatus({
        txHash: transaction.transaction.hash,
        accountId: root.accountId,
        waitUntil: 'FINAL',
    });
    expect(result.status).toEqual({ SuccessValue: '' });
}

beforeAll(async () => {
    sandbox = await Sandbox.start({ version: '2.14.0' });
    root = new Account(DEFAULT_ACCOUNT_ID, new JsonRpcProvider({ url: sandbox.rpcUrl }), DEFAULT_PRIVATE_KEY);
    for (const mode of ['accountId', 'codeHash'] as const) {
        await finalized(await root.deployGlobalContract(code, mode));
        await vi.waitFor(
            async () => {
                const identifier = mode === 'accountId' ? { accountId: root.accountId } : { codeHash: hash };
                expect((await root.provider.viewGlobalContractCode({ identifier })).hash).toBe(hash);
            },
            { timeout: 10000, interval: 200 }
        );
    }
});

afterAll(async () => {
    await sandbox?.tearDown();
});

test.each(['accountId', 'codeHash'] as const)(
    'initializes deterministic code and storage referenced by %s',
    async (mode) => {
        const stateInit = new DeterministicStateInit({
            code: mode === 'accountId' ? { accountId: root.accountId } : { codeHash: hash },
            data: [[new TextEncoder().encode('marker'), new TextEncoder().encode('original')]],
        });
        const accountId = stateInit.deriveAccountId();
        const deposit = nearToYocto('1');
        await finalized(await root.createDeterministicAccount({ stateInit, deposit }));
        const state = await root.provider.viewContractState({ contractId: accountId });
        expect(state.values).toContainEqual({ key: 'bWFya2Vy', value: 'b3JpZ2luYWw=' });
        expect((await root.provider.viewAccessKeyList({ accountId })).keys).toEqual([]);
        // Excess storage deposit is refunded, rather than becoming spending balance.
        expect((await root.provider.viewAccount({ accountId })).amount).toBeLessThan(deposit);
        await finalized(await root.transfer({ receiverId: accountId, amount: nearToYocto('1') }));
        await finalized(
            await root.callFunctionRaw({
                contractId: accountId,
                methodName: 'add_message',
                args: { text: 'preserve me' },
            })
        );
        const before = await root.provider.viewAccount({ accountId });
        await finalized(await root.createDeterministicAccount({ stateInit, deposit }));
        expect((await root.provider.viewAccount({ accountId })).amount).toBe(before.amount);
        const messages = await root.provider.callFunction<Array<{ text: string }>>({
            contractId: accountId,
            method: 'get_messages',
            args: {},
        });
        expect(messages?.map((message) => message.text)).toEqual(['preserve me']);
    }
);

test('initializes a prefunded derived account without losing its balance', async () => {
    const stateInit = new DeterministicStateInit({ code: { codeHash: hash } });
    const accountId = stateInit.deriveAccountId();
    await finalized(await root.transfer({ receiverId: accountId, amount: nearToYocto('1') }));
    const before = await root.provider.viewAccount({ accountId });
    await finalized(await root.createDeterministicAccount({ stateInit }));
    expect((await root.provider.viewAccount({ accountId })).amount).toBe(before.amount);
    expect(await root.provider.callFunction({ contractId: accountId, method: 'get_messages', args: {} })).toEqual([]);
});
