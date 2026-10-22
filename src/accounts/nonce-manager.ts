import type { PublicKey } from '../crypto/public_key.js';
import type { Provider } from '../providers/provider.js';

export class NonceManager {
    private nonces: Record<string, bigint>;
    private locks: Record<string, Promise<void>>;

    constructor() {
        this.nonces = {};
        this.locks = {};
    }

    /**
     * @param nonceIndex The gas key nonce lane, each lane keeps its own nonce
     */
    public async resolveNextNonce(
        pk: PublicKey,
        accountId: string,
        provider: Provider,
        nonceIndex?: number
    ): Promise<bigint> {
        const key = nonceKey(pk, nonceIndex);

        // wait until unlocked
        const lock = this.locks[key];
        if (lock) await lock;

        if (typeof this.nonces[key] === 'bigint') {
            this.nonces[key] = this.nonces[key] + 1n;
            return this.nonces[key];
        }

        // biome-ignore lint/suspicious/noEmptyBlockStatements: unlock is immediately overwritten
        let unlock = () => {};

        const newLock = new Promise<void>((resolve) => {
            unlock = resolve;
        });
        this.locks[key] = newLock;

        try {
            this.nonces[key] = (await fetchNonce(pk, accountId, provider, nonceIndex)) + 1n;

            return this.nonces[key];
        } finally {
            unlock();
        }
    }

    public async invalidate(pk: PublicKey, nonceIndex?: number): Promise<void> {
        const key = nonceKey(pk, nonceIndex);

        // make sure to wait until unlocked
        const lock = this.locks[key];
        if (lock) await lock;

        delete this.nonces[key];
    }
}

function nonceKey(pk: PublicKey, nonceIndex?: number): string {
    return nonceIndex === undefined ? pk.toString() : `${pk.toString()}:${nonceIndex}`;
}

async function fetchNonce(pk: PublicKey, accountId: string, provider: Provider, nonceIndex?: number): Promise<bigint> {
    const finalityQuery = { finality: 'optimistic' } as const;

    if (nonceIndex === undefined) {
        const accessKey = await provider.viewAccessKey({ accountId, publicKey: pk, finalityQuery });
        return accessKey.nonce;
    }

    const { nonces } = await provider.viewGasKeyNonces({ accountId, publicKey: pk, finalityQuery });
    const nonce = nonces[nonceIndex];
    if (nonce === undefined) {
        throw new Error(`Nonce index ${nonceIndex} is out of range, gas key ${pk} has ${nonces.length} nonces`);
    }
    return BigInt(nonce);
}
