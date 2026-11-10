import { readFileSync } from 'node:fs';
import { DEFAULT_ACCOUNT_ID, DEFAULT_PRIVATE_KEY, Sandbox } from 'near-sandbox';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { Account, actions, JsonRpcProvider, KeyPair, nearToYocto, UniversalStateInit } from '../../src/index.js';

let sandbox: Sandbox;
let root: Account;

beforeAll(async () => {
    sandbox = await Sandbox.start({ version: '2.14.0' });
    const provider = new JsonRpcProvider({ url: sandbox.rpcUrl });
    const send = provider.sendTransactionUntil.bind(provider);
    provider.sendTransactionUntil = (transaction) => send(transaction, 'FINAL');
    root = new Account(DEFAULT_ACCOUNT_ID, provider, DEFAULT_PRIVATE_KEY);
});

afterAll(async () => {
    await sandbox?.tearDown();
});

test('global contract code and storage initialize a universal contract account', async () => {
    const code = readFileSync(new URL('../contracts/guestbook/contract.wasm', import.meta.url));
    await root.deployGlobalContract(code, 'accountId');
    const entry = [new TextEncoder().encode('key'), new TextEncoder().encode('value')] as const;
    const stateInit = new UniversalStateInit({ code: { accountId: root.accountId }, data: [entry] });
    await root.createUniversalAccount({ stateInit: stateInit.encode(), deposit: nearToYocto('1') });
    const state = await root.provider.viewContractState({ contractId: stateInit.deriveAccountId() });
    expect(state.values).toContainEqual({ key: 'a2V5', value: 'dmFsdWU=' });
});

test.each(['ed25519', 'secp256k1', 'ml-dsa-65'] as const)(
    'a key-only universal account can sign with %s',
    async (curve) => {
        const pair = KeyPair.fromRandom(curve);
        const stateInit = new UniversalStateInit({ accessKeys: [pair.getPublicKey()] });
        const raw = stateInit.encode();
        expect((await root.createUniversalAccount({ stateInit: raw, deposit: nearToYocto('1') })).status).toEqual({
            SuccessValue: '',
        });
        await root.transfer({ receiverId: stateInit.deriveAccountId(), amount: nearToYocto('1') });
        const account = new Account(stateInit.deriveAccountId(), root.provider, pair.toString());
        expect((await account.transfer({ receiverId: root.accountId, amount: 1n })).status).toEqual({
            SuccessValue: '',
        });
    }
);

test.each(['ed25519', 'ml-dsa-65'] as const)(
    'a prefunded universal account bootstraps itself with %s',
    async (curve) => {
        const pair = KeyPair.fromRandom(curve);
        const stateInit = new UniversalStateInit({ accessKeys: [pair.getPublicKey()] });
        const raw = stateInit.encode();
        const receiverId = stateInit.deriveAccountId();
        await root.transfer({ receiverId, amount: nearToYocto('1') });
        const account = new Account(receiverId, root.provider, pair.toString());
        const before = await account.getState();
        expect(before.initializationState).toBe('uninitialized');
        expect(before.bootstrapNonce).toBeDefined();
        const options = { receiverId, actions: [actions.universalStateInit(raw)], publicKey: pair.getPublicKey() };
        const first = await account.createTransaction(options);
        const second = await account.createTransaction(options);
        expect(first.nonce).toBe(before.bootstrapNonce! + 1n);
        expect(second.nonce).toBe(first.nonce);
        expect((await account.createUniversalAccount({ stateInit: raw })).status).toEqual({ SuccessValue: '' });
    }
);
