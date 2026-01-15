import type { PublicKey } from '../crypto/public_key.js';
import type { Provider } from '../providers/provider.js';

export class NonceManager {
    private readonly accountId: string;
    private readonly provider: Provider;

    private nonces: Record<string, bigint>;
    private locks: Record<string, Promise<void>>;

    constructor(accountId: string, provider: Provider) {
        this.accountId = accountId;
        this.provider = provider;
        this.nonces = {};
        this.locks = {};
    }

    private getCacheKey(pk: PublicKey): string {
        return [this.accountId, pk.toString()].join(':');
    }

    public async resolveNextNonce(pk: PublicKey): Promise<bigint> {
        const key = this.getCacheKey(pk);

        // wait until unlocked
        const lock = this.locks[key];
        if (lock) await lock;

        const cachedNonce = this.nonces[key];

        if (typeof cachedNonce === 'bigint') {
            this.nonces[key] = cachedNonce + 1n;
            return cachedNonce;
        }

        // biome-ignore lint/suspicious/noEmptyBlockStatements: unlock is immediately overwritten
        let unlock = () => {};

        const newLock = new Promise<void>((resolve) => {
            unlock = resolve;
        });
        this.locks[key] = newLock;

        try {
            const accessKey = await this.provider.viewAccessKey({
                accountId: this.accountId,
                publicKey: pk,
                finalityQuery: { finality: 'optimistic' },
            });

            this.nonces[key] = accessKey.nonce + 2n;

            return accessKey.nonce + 1n;
        } finally {
            unlock();
        }
    }

    public async invalidate(pk: PublicKey): Promise<void> {
        const key = this.getCacheKey(pk);

        // make sure to wait until unlocked
        const lock = this.locks[key];
        if (lock) await lock;

        delete this.nonces[key];
    }
}
