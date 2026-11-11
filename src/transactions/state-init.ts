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

    /**
     * Builds deterministic account state initialization; does not create an account.
     * @param options - Initial code and storage.
     * @param options.code - Global contract reference by publishing account ID or code hash (Base58 string/raw bytes).
     * @param options.data - Raw storage key/value byte pairs. Defaults to empty storage; sorted bytewise for encoding.
     * @throws If storage keys contain duplicate byte sequences or the global contract identifier is invalid.
     */
    constructor({ code, data }: DeterministicStateInitOptions) {
        this.V1 = { code: globalContractIdentifier(code), data: canonicalStateInitData(data) };
    }

    /**
     * Decodes Borsh bytes into a real class instance, canonicalizing storage order.
     * @param bytes - Versioned deterministic state-init encoding.
     * @returns A state-init instance whose encoding uses bytewise-sorted storage.
     * @throws If decoding or construction fails. Does not verify on-chain code availability.
     */
    static decode(bytes: Uint8Array): DeterministicStateInit {
        const { V1 } = deserialize(SCHEMA.DeterministicAccountStateInit, bytes) as DeterministicStateInitSchema;
        const code: GlobalContractIdentifierInput =
            V1.code.AccountId !== undefined ? { accountId: V1.code.AccountId } : { codeHash: V1.code.CodeHash! };
        return new DeterministicStateInit({ code, data: V1.data });
    }

    /**
     * Serializes the current state init, including the V1 enum tag and bytewise-sorted storage.
     * @returns Canonical Borsh bytes, with storage re-sorted on every call even if `V1.data` was mutated.
     * @throws If the current storage contains duplicate byte keys or cannot be serialized.
     */
    encode(): Uint8Array {
        return serialize(SCHEMA.DeterministicAccountStateInit, {
            V1: { code: this.V1.code, data: canonicalStateInitData(this.V1.data) },
        });
    }

    /**
     * Derives the NEP-616 account ID from the current canonical initialization.
     * @returns `0s` followed by the last 20 bytes of Keccak-256 as lowercase hexadecimal.
     * Does not create or query an account; changing the encoded state changes the derived ID.
     */
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

    /**
     * Builds protocol-88 universal account initialization; does not create an account.
     * @param options - Initial code, storage, and full-access keys. Defaults to an empty initialization.
     * @param options.code - Optional global contract reference by publishing account ID or code hash.
     * @param options.data - Raw storage key/value byte pairs. Defaults to empty storage; duplicate byte keys are rejected.
     * @param options.accessKeys - Public key instances or encoded strings. Defaults to no keys.
     * Handles are sorted and deduplicated; ML-DSA-65 keys are represented by their SHA3-256 hashes.
     */
    constructor({ code, data, accessKeys = [] }: UniversalStateInitOptions = {}) {
        this.V1 = {
            code: code ? globalContractIdentifier(code) : null,
            data: canonicalStateInitData(data),
            accessKeys: canonicalAccessKeys(accessKeys),
        };
    }

    /**
     * Decodes canonical V1 bytes into a real class instance.
     * @param bytes - Canonical versioned universal state-init bytes.
     * @returns A state-init instance with the decoded storage and access-key handles.
     * @throws If decoding fails or re-encoding differs, including noncanonical ordering or trailing bytes.
     */
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

    /**
     * Encodes the current initialization for use in a universal state-init action.
     * @returns Canonical Borsh bytes. Storage and access-key handles are re-sorted on every call.
     * @throws If storage keys contain duplicate byte sequences or serialization fails.
     */
    encode(): Uint8Array {
        return serialize(SCHEMA.UniversalAccountStateInit, {
            V1: {
                code: this.V1.code,
                data: canonicalStateInitData(this.V1.data),
                accessKeys: canonicalAccessKeyHandles(this.V1.accessKeys),
            },
        });
    }

    /**
     * Derives a universal account ID from the current canonical initialization.
     * @returns `0u` followed by the lowercase Crockford Base32 encoding of the SHA3-256 digest.
     * Does not create an account or check whether it exists.
     */
    deriveAccountId(): string {
        return deriveUniversalAccountId(this.encode());
    }
}

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
    return a.length === b.length && a.every((byte, index) => byte === b[index]);
}

/**
 * Derives a universal account ID from exact raw bytes, without decoding or validating them.
 * @param stateInit - Versioned state-init bytes. Use `UniversalStateInit.encode()` for canonical V1 bytes.
 * @returns `0u` followed by lowercase Crockford Base32 of SHA3-256 over the supplied bytes.
 * @remarks Future versions can be forwarded unchanged. Different encodings produce different IDs;
 * deriving an ID does not imply that the node will accept the bytes for initialization.
 */
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
