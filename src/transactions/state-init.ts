import { keccak_256 } from '@noble/hashes/sha3.js';
import { deserialize, serialize } from 'borsh';
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
