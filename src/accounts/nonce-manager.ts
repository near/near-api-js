import type { PublicKey } from '../crypto/public_key.js';
import type { Provider } from '../providers/provider.js';

type NonceState = {
    nonces: Array<bigint | undefined>;
    nextLane?: number;
};

export class NonceManager {
    private readonly states: Record<string, NonceState> = {};
    private readonly locks: Record<string, Promise<void>> = {};

    /** Select a gas key lane, if needed, and reserve the next nonce. */
    public async resolveNextNonce(
        pk: PublicKey,
        accountId: string,
        provider: Provider
    ): Promise<{ nonce: bigint; nonceIndex?: number }> {
        const key = pk.toString();
        const params = { accountId, publicKey: pk, finalityQuery: { finality: 'optimistic' as const } };

        return this.withLock(key, async () => {
            let state = this.states[key];
            if (!state) {
                const { nonce, permission } = await provider.viewAccessKey(params);
                if (
                    typeof permission === 'object' &&
                    permission !== null &&
                    ('GasKeyFullAccess' in permission || 'GasKeyFunctionCall' in permission)
                ) {
                    const { nonces } = await provider.viewGasKeyNonces(params);
                    if (nonces.length === 0) throw new Error(`Gas key ${pk} has no nonce lanes`);
                    state = { nonces: nonces.map((value) => BigInt(value)), nextLane: 0 };
                } else {
                    state = { nonces: [nonce] };
                }
                this.states[key] = state;
            }

            const nonceIndex = state.nextLane;
            const lane = nonceIndex ?? 0;
            let nonce = state.nonces[lane];
            if (nonce === undefined) {
                const { nonces } = await provider.viewGasKeyNonces(params);
                const chainNonce = nonces[lane];
                if (chainNonce === undefined) throw new Error(`Nonce lane ${lane} does not exist on gas key ${pk}`);
                nonce = BigInt(chainNonce);
            }

            state.nonces[lane] = nonce + 1n;
            if (nonceIndex !== undefined) {
                state.nextLane = (lane + 1) % state.nonces.length;
                return { nonce: nonce + 1n, nonceIndex };
            }
            return { nonce: nonce + 1n };
        });
    }

    public async invalidate(pk: PublicKey, nonceIndex?: number): Promise<void> {
        const key = pk.toString();
        return this.withLock(key, () => {
            const state = this.states[key];
            if (state && nonceIndex !== undefined) {
                state.nonces[nonceIndex] = undefined;
            } else {
                delete this.states[key];
            }
        });
    }

    private async withLock<T>(key: string, getResult: () => T | Promise<T>): Promise<T> {
        const previous = this.locks[key];
        // biome-ignore lint/suspicious/noEmptyBlockStatements: unlock is immediately overwritten
        let unlock = () => {};
        const lock = new Promise<void>((resolve) => {
            unlock = resolve;
        });
        this.locks[key] = lock;
        await previous;
        try {
            return await getResult();
        } finally {
            unlock();
            if (this.locks[key] === lock) delete this.locks[key];
        }
    }
}
