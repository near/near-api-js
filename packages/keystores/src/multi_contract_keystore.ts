import type { KeyPair } from '@near-js/crypto';

/**
 * KeyStores are passed to {@link near!Near} via {@link near!NearConfig}
 * and are used by the {@link signer!InMemorySigner} to sign transactions.
 *
 * @see {@link connect}
 */
export abstract class MultiContractKeyStore {
    abstract setKey(
        networkId: string,
        accountId: string,
        keyPair: KeyPair,
        contractId: string,
    ): Promise<void>;
    abstract getKey(
        networkId: string,
        accountId: string,
        contractId: string,
    ): Promise<KeyPair | null>;
    abstract removeKey(
        networkId: string,
        accountId: string,
        contractId: string,
    ): Promise<void>;
    abstract clear(): Promise<void>;
    abstract getNetworks(): Promise<string[]>;
    abstract getAccounts(networkId: string): Promise<string[]>;
    abstract getContracts(
        networkId: string,
        accountId: string,
    ): Promise<string[]>;
}
