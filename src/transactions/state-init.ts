import { keccak_256, sha3_256 } from '@noble/hashes/sha3.js';
import { deserialize, serialize } from 'borsh';
import { KeyType, PublicKey } from '../crypto/index.js';
import { hashMlDsa65PublicKey } from '../crypto/public_key.js';
import type { GlobalContractIdentifier } from './actions.js';
import { type GlobalContractIdentifierInput, globalContractIdentifier } from './global_contract_identifier.js';
import { SCHEMA } from './schema.js';

/** Raw storage keys and values, sorted bytewise as nearcore's BTreeMap. */
export type StateInitData = Iterable<readonly [Uint8Array, Uint8Array]>;
/** @internal Borsh representation of a versioned deterministic state init. */
export type DeterministicStateInitSchema = {
    V1: { code: GlobalContractIdentifier; data: Map<Uint8Array, Uint8Array> };
};
export interface DeterministicStateInitOptions {
    code: GlobalContractIdentifierInput;
    data?: StateInitData;
}
export interface UniversalStateInitOptions {
    code?: GlobalContractIdentifierInput;
    data?: StateInitData;
    accessKeys?: Array<PublicKey | string>;
}

type PublicKeyHandle =
    | { ed25519Key: { data: Uint8Array } }
    | { secp256k1Key: { data: Uint8Array } }
    | { mlDsa65Hash: { data: Uint8Array } };

type UniversalStateInitSchema = {
    V1: {
        code: GlobalContractIdentifier | null;
        data: Map<Uint8Array, Uint8Array>;
        accessKeys: PublicKeyHandle[];
    };
};
function compareBytes(a: Uint8Array, b: Uint8Array): number {
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        if (a[i] !== b[i]) return a[i]! - b[i]!;
    }
    return a.length - b.length;
}

/** @internal Shared ordering for derivation and action serialization. */
export function canonicalStateInitData(data: StateInitData = []): Map<Uint8Array, Uint8Array> {
    const entries = Array.from(data).sort(([a], [b]) => compareBytes(a, b));
    for (let i = 1; i < entries.length; i++) {
        if (compareBytes(entries[i - 1]![0], entries[i]![0]) === 0)
            throw new Error('Duplicate state initialization key');
    }
    return new Map(entries);
}

/** A canonical, versioned NEP-616 deterministic account state initialization. */
export class DeterministicStateInit implements DeterministicStateInitSchema {
    V1: DeterministicStateInitSchema['V1'];

    constructor({ code, data }: DeterministicStateInitOptions) {
        this.V1 = { code: globalContractIdentifier(code), data: canonicalStateInitData(data) };
    }

    /** Decode Borsh bytes into a real class instance. */
    static decode(bytes: Uint8Array): DeterministicStateInit {
        const { V1 } = deserialize(SCHEMA.DeterministicAccountStateInit, bytes) as DeterministicStateInitSchema;
        const code: GlobalContractIdentifierInput =
            V1.code.AccountId !== undefined ? { accountId: V1.code.AccountId } : { codeHash: V1.code.CodeHash! };
        return new DeterministicStateInit({ code, data: V1.data });
    }

    /** Canonical Borsh encoding, including the V1 enum tag and bytewise-sorted storage. */
    encode(): Uint8Array {
        return serialize(SCHEMA.DeterministicAccountStateInit, {
            V1: { code: this.V1.code, data: canonicalStateInitData(this.V1.data) },
        });
    }

    /** NEP-616: 0s followed by the last 20 bytes of Keccak-256 over the versioned state init. */
    deriveAccountId(): string {
        const hash = keccak_256(this.encode());
        return `0s${Array.from(hash.slice(12), (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
    }
}

function canonicalAccessKeys(accessKeys: Array<PublicKey | string>): PublicKeyHandle[] {
    return canonicalAccessKeyHandles(
        accessKeys.map((value): PublicKeyHandle => {
            const key = PublicKey.from(value);
            switch (key.keyType) {
                case KeyType.ED25519:
                    return { ed25519Key: { data: key.data } };
                case KeyType.SECP256K1:
                    return { secp256k1Key: { data: key.data } };
                case KeyType.MLDSA65:
                    return { mlDsa65Hash: { data: hashMlDsa65PublicKey(key.data) } };
                default:
                    throw new Error(`Unsupported public key type: ${key.keyType}`);
            }
        })
    );
}

function canonicalAccessKeyHandles(handles: PublicKeyHandle[]): PublicKeyHandle[] {
    const sorted = [...handles];
    sorted.sort((a, b) => compareBytes(serialize(SCHEMA.PublicKeyHandle, a), serialize(SCHEMA.PublicKeyHandle, b)));
    return sorted.filter(
        (handle, index) =>
            index === 0 ||
            compareBytes(
                serialize(SCHEMA.PublicKeyHandle, handle),
                serialize(SCHEMA.PublicKeyHandle, sorted[index - 1])
            ) !== 0
    );
}

/** A typed builder for the canonical raw state-init bytes used by protocol-88 universal accounts. */
export class UniversalStateInit implements UniversalStateInitSchema {
    V1: UniversalStateInitSchema['V1'];

    constructor({ code, data, accessKeys = [] }: UniversalStateInitOptions = {}) {
        this.V1 = {
            code: code ? globalContractIdentifier(code) : null,
            data: canonicalStateInitData(data),
            accessKeys: canonicalAccessKeys(accessKeys),
        };
    }

    /** Decode canonical V1 bytes into a real class instance. */
    static decode(bytes: Uint8Array): UniversalStateInit {
        const decoded = deserialize(SCHEMA.UniversalAccountStateInit, bytes) as UniversalStateInitSchema;
        const instance = Object.create(UniversalStateInit.prototype) as UniversalStateInit;
        instance.V1 = {
            code: decoded.V1.code,
            data: canonicalStateInitData(decoded.V1.data),
            accessKeys: canonicalAccessKeyHandles(decoded.V1.accessKeys),
        };
        if (!bytesEqual(instance.encode(), bytes)) throw new Error('Universal state init is not canonically encoded');
        return instance;
    }

    /** Canonical Borsh bytes carried opaquely by the UniversalStateInit action. */
    encode(): Uint8Array {
        return serialize(SCHEMA.UniversalAccountStateInit, {
            V1: {
                code: this.V1.code,
                data: canonicalStateInitData(this.V1.data),
                accessKeys: canonicalAccessKeyHandles(this.V1.accessKeys),
            },
        });
    }

    deriveAccountId(): string {
        return deriveUniversalAccountId(this.encode());
    }
}

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
    return a.length === b.length && a.every((byte, index) => byte === b[index]);
}

/** Derive an ID from the exact raw bytes, without decoding, so future state-init versions can be forwarded. */
export function deriveUniversalAccountId(stateInit: Uint8Array): string {
    const alphabet = '0123456789abcdefghjkmnpqrstvwxyz';
    let result = '0u';
    let accumulator = 0;
    let bits = 0;
    for (const byte of sha3_256(stateInit)) {
        accumulator = (accumulator << 8) | byte;
        bits += 8;
        while (bits >= 5) {
            bits -= 5;
            result += alphabet[(accumulator >>> bits) & 31];
        }
        accumulator &= (1 << bits) - 1;
    }
    if (bits) result += alphabet[(accumulator << (5 - bits)) & 31];
    return result;
}
