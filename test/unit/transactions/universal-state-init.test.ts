import { sha3_256 } from '@noble/hashes/sha3.js';
import { deserialize, serialize } from 'borsh';
import { describe, expect, test, vi } from 'vitest';
import {
    Account,
    actions,
    deriveUniversalAccountId,
    KeyPair,
    KeyType,
    PublicKey,
    SCHEMA,
    UniversalStateInit,
} from '../../../src/index.js';

const bytes = (value: string) => new TextEncoder().encode(value);

describe('universal accounts (protocol 88)', () => {
    test('matches nearcore 2.14 raw-byte and ID vectors', () => {
        const stateInit = new UniversalStateInit({
            code: { codeHash: new Uint8Array(32).fill(0x22) },
            data: [[bytes('key'), bytes('value')]],
        });
        const raw = stateInit.encode();
        expect(raw).toEqual(
            new Uint8Array([
                0,
                1,
                0,
                ...new Uint8Array(32).fill(0x22),
                1,
                0,
                0,
                0,
                3,
                0,
                0,
                0,
                ...bytes('key'),
                5,
                0,
                0,
                0,
                ...bytes('value'),
                0,
                0,
                0,
                0,
            ])
        );
        expect(stateInit.deriveAccountId()).toBe('0uzvdgbyea2rd8ywx0kw3cg4vc0ez1x5fc2gyks4fdz9ae0xxvzan0');
        const hashedKey = new Uint8Array([0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3, ...new Uint8Array(32).fill(0x11)]);
        expect(deriveUniversalAccountId(hashedKey)).toBe('0ux8te7g99f9kqzdtp9h4qnwt9aczpgayymmtbdc50w199rcw3at1g');

        const actionBytes = serialize(SCHEMA.Action, actions.universalStateInit(raw, 123n));
        expect(actionBytes[0]).toBe(15);
        expect(Array.from(actionBytes.slice(1, 5))).toEqual([raw.length, 0, 0, 0]);
        expect(deserialize(SCHEMA.Action, actionBytes)).toEqual({
            universalStateInit: { stateInit: Array.from(raw), deposit: 123n },
        });
    });

    test('sorts and deduplicates access-key handles and domain-separates ML-DSA hashes', () => {
        const ed = KeyPair.fromRandom('ed25519').getPublicKey();
        const secp = KeyPair.fromRandom('secp256k1').getPublicKey();
        const pq = new PublicKey({ keyType: KeyType.MLDSA65, data: new Uint8Array(1952).fill(7) });
        const a = new UniversalStateInit({ accessKeys: [pq, secp, ed, ed] });
        const b = new UniversalStateInit({ accessKeys: [ed, pq, secp] });
        expect(a.encode()).toEqual(b.encode());
        expect(pq.toHandle()).toMatch(/^ml-dsa-65-hash:/);
        expect(a.encode().slice(-32)).toEqual(
            sha3_256(new Uint8Array([...bytes('near:ml-dsa-65-pubkey-hash:v1'), ...pq.data]))
        );
    });

    test('decoding restores the class and rejects noncanonical bytes', () => {
        const stateInit = new UniversalStateInit({
            code: { accountId: 'code.near' },
            data: [[bytes('key'), bytes('value')]],
        });
        const decoded = UniversalStateInit.decode(stateInit.encode());
        expect(decoded).toBeInstanceOf(UniversalStateInit);
        expect(decoded.encode()).toEqual(stateInit.encode());

        const noncanonical = serialize(SCHEMA.UniversalAccountStateInit, {
            V1: {
                code: null,
                data: new Map([
                    [bytes('z'), bytes('1')],
                    [bytes('a'), bytes('2')],
                ]),
                accessKeys: [],
            },
        });
        expect(() => UniversalStateInit.decode(noncanonical)).toThrow();
    });
});

test('account API targets the exact raw-byte-derived receiver', async () => {
    const account = new Account('funder.testnet', 'http://localhost:3030');
    const submit = vi.spyOn(account, 'signAndSendTransaction').mockResolvedValue({} as never);
    const raw = new UniversalStateInit({ accessKeys: [KeyPair.fromRandom('ed25519').getPublicKey()] }).encode();
    await account.createUniversalAccount({ stateInit: raw, deposit: 321n });
    expect(submit).toHaveBeenLastCalledWith({
        receiverId: deriveUniversalAccountId(raw),
        actions: [actions.universalStateInit(raw, 321n)],
    });
});
