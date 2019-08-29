import { Signature, PublicKey } from './utils/key_pair';
import { KeyStore } from './key_stores';
/**
 * General signing interface, can be used for in memory signing, RPC singing, external wallet, HSM, etc.
 */
export declare abstract class Signer {
    /**
     * Creates new key and returns public key.
     */
    abstract createKey(accountId: string, networkId?: string): Promise<PublicKey>;
    /**
     * Returns public key for given account / network.
     * @param accountId accountId to retrieve from.
     * @param networkId network for this accountId.
     */
    abstract getPublicKey(accountId?: string, networkId?: string): Promise<PublicKey>;
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
    createKey(accountId: string, networkId: string): Promise<PublicKey>;
    getPublicKey(accountId?: string, networkId?: string): Promise<PublicKey>;
    signHash(hash: Uint8Array, accountId?: string, networkId?: string): Promise<Signature>;
}
