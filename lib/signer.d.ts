import { Signature } from './utils/key_pair';
import { KeyStore } from './key_stores';
/**
 * General signing interface, can be used for in memory signing, RPC singing, external wallet, HSM, etc.
 */
export declare abstract class Signer {
    /**
     * Creates new key and returns public key.
     */
    abstract createKey(accountId: string, networkId?: string): Promise<string>;
    /**
     * Returns public key for given account / network.
     * @param accountId accountId to retrieve from.
     * @param networkId network for this accountId.
     */
    abstract getPublicKey(accountId?: string, networkId?: string): Promise<string>;
    /**
     * Signs given hash.
     * @param hash hash to sign.
     * @param accountId accountId to use for signing.
     * @param networkId network for this accontId.
     */
    abstract signHash(hash: Uint8Array, accountId?: string, networkId?: string): Promise<Signature>;
    /**
     * Signs given message, by first hashing with sha256.
     * @param message message to sign.
     * @param accountId accountId to use for signing.
     * @param networkId network for this accontId.
     */
    signMessage(message: Uint8Array, accountId?: string, networkId?: string): Promise<Signature>;
}
/**
 * Signs using in memory key store.
 */
export declare class InMemorySigner extends Signer {
    readonly keyStore: KeyStore;
    constructor(keyStore: KeyStore);
    createKey(accountId: string, networkId: string): Promise<string>;
    getPublicKey(accountId?: string, networkId?: string): Promise<string>;
    signHash(hash: Uint8Array, accountId?: string, networkId?: string): Promise<Signature>;
}
