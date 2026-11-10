import { deserialize, serialize } from 'borsh';
import { describe, expect, test, vi } from 'vitest';
import { Account, actions, baseEncode, DeterministicStateInit, SCHEMA } from '../../../src/index.js';

const bytes = (value: string) => new TextEncoder().encode(value);

describe('deterministic accounts (NEP-616)', () => {
    test('matches the nearcore/near-kit Rust known-answer vector', () => {
        const stateInit = new DeterministicStateInit({ code: { accountId: 'ft.near' } });
        expect(stateInit.deriveAccountId()).toBe('0s69284a5453e7be5632b28b6a01baecf6c12c156d');
        expect(Array.from(stateInit.encode())).toEqual([0, 1, 7, 0, 0, 0, ...bytes('ft.near'), 0, 0, 0, 0]);
    });

    test('sorts storage by raw bytes for both ID derivation and action encoding', () => {
        const code = { accountId: 'ft.near' };
        const unsorted = new DeterministicStateInit({
            code,
            data: [
                [bytes('z'), bytes('1')],
                [bytes('a'), bytes('2')],
            ],
        });
        const sorted = new DeterministicStateInit({
            code,
            data: [
                [bytes('a'), bytes('2')],
                [bytes('z'), bytes('1')],
            ],
        });
        expect(unsorted.deriveAccountId()).toBe(sorted.deriveAccountId());
        expect(serialize(SCHEMA.Action, actions.deterministicStateInit(unsorted, 123n))).toEqual(
            new Uint8Array([11, ...sorted.encode(), 123, ...new Uint8Array(15)])
        );
        const duplicate = [
            [bytes('a'), bytes('1')],
            [bytes('a'), bytes('2')],
        ] as const;
        expect(() => new DeterministicStateInit({ code, data: duplicate })).toThrow('Duplicate');
    });

    test('accepts RPC base58 hashes and existing hexadecimal hashes identically', () => {
        const hash = new Uint8Array(32).fill(34);
        const state = new DeterministicStateInit({ code: { codeHash: hash } });
        expect(new DeterministicStateInit({ code: { codeHash: baseEncode(hash) } }).deriveAccountId()).toBe(
            state.deriveAccountId()
        );
        expect(serialize(SCHEMA.Action, actions.useGlobalContract({ codeHash: baseEncode(hash) }))).toEqual(
            serialize(SCHEMA.Action, actions.useGlobalContract({ codeHash: '22'.repeat(32) }))
        );
    });
});

test.each([
    [{ codeHash: 'J86LNmZE9nHAxRqUYBZ64iCQYfeacMJhNqvb8WQmpZPE' }, '0s48ddf87e648de3a52783ee9640e618234cadb18f'],
    [{ accountId: 'alice.near' }, '0sf4d27a587616342eb45b8d785addbe6790695a2e'],
] as const)('matches near-global-contracts vectors (%j)', (code, expected) => {
    const state = new DeterministicStateInit({
        code,
        data: [[new Uint8Array([0, 1, 2]), new Uint8Array([3, 4, 5])]],
    });
    expect(state.deriveAccountId()).toBe(expected);
});

test('storage ordering uses unsigned byte values and shorter prefixes first', () => {
    const keys = [new Uint8Array([255]), new Uint8Array([0, 0]), new Uint8Array([128]), new Uint8Array([0])];
    const state = new DeterministicStateInit({
        code: { accountId: 'ft.near' },
        data: keys.map((key) => [key, key]),
    });
    expect([...state.V1.data.keys()].map((key) => [...key])).toEqual([[0], [0, 0], [128], [255]]);
    // Caller-provided maps must also be canonicalized for both derivation and the transmitted action.
    const unsorted = new DeterministicStateInit({ code: { accountId: 'ft.near' } });
    unsorted.V1.data = new Map(keys.map((key) => [key, key]));
    expect(unsorted.deriveAccountId()).toBe(state.deriveAccountId());
    const action = actions.deterministicStateInit(unsorted, 123n);
    const encoded = serialize(SCHEMA.Action, action);
    expect(encoded).toEqual(serialize(SCHEMA.ClassicActions, action));
    expect(encoded.slice(1, -16)).toEqual(state.encode());
    expect(deserialize(SCHEMA.Action, encoded)).toMatchObject({ deterministicStateInit: { deposit: 123n } });
    const different = new DeterministicStateInit({
        code: { accountId: 'ft.near' },
        data: [[keys[0]!, new Uint8Array([1])]],
    });
    expect(different.deriveAccountId()).not.toBe(state.deriveAccountId());
});

test('decoding restores a DeterministicStateInit instance', () => {
    const stateInit = new DeterministicStateInit({
        code: { accountId: 'ft.near' },
        data: [[bytes('key'), bytes('value')]],
    });
    const decoded = DeterministicStateInit.decode(stateInit.encode());
    expect(decoded).toBeInstanceOf(DeterministicStateInit);
    expect(decoded.encode()).toEqual(stateInit.encode());
    expect(decoded.deriveAccountId()).toBe(stateInit.deriveAccountId());
});

test('the account API derives the receiver and passes only a storage deposit', async () => {
    const account = new Account('funder.testnet', 'http://localhost:3030');
    const submit = vi.spyOn(account, 'signAndSendTransaction').mockResolvedValue({} as never);
    const stateInit = new DeterministicStateInit({ code: { accountId: 'ft.near' } });
    for (const deposit of [undefined, 123n, '321']) {
        await account.createDeterministicAccount({ stateInit, deposit });
        expect(submit).toHaveBeenLastCalledWith({
            receiverId: stateInit.deriveAccountId(),
            actions: [actions.deterministicStateInit(stateInit, BigInt(deposit ?? 0))],
        });
    }
});
