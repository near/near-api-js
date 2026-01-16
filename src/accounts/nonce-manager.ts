import type { PublicKey } from '../crypto/public_key.js';
import type { Provider } from '../providers/provider.js';

export class NonceManager {
    private nonces: Record<string, bigint>;
    private locks: Record<string, Promise<void>>;

    constructor() {
        this.nonces = {};
        this.locks = {};
    }

    public async resolveNextNonce(pk: PublicKey, accountId: string, provider: Provider): Promise<bigint> {
        const key = pk.toString();

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
            const accessKey = await provider.viewAccessKey({
                accountId,
                publicKey: pk,
                finalityQuery: { finality: 'optimistic' },
            });

            this.nonces[key] = accessKey.nonce + 1n;

            return this.nonces[key];
        } finally {
            unlock();
        }
    }

    public async invalidate(pk: PublicKey): Promise<void> {
        const key = pk.toString();

        // make sure to wait until unlocked
        const lock = this.locks[key];
        if (lock) await lock;

        delete this.nonces[key];
    }
}
