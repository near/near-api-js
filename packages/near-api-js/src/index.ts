/**
 * NEAR API JavaScript Library
 *
 * A comprehensive library for interacting with the NEAR Protocol blockchain.
 * This package aggregates all @near-js/* packages for a simple developer experience
 * while maintaining tree-shakeability.
 *
 * @example Basic usage
 * ```ts
 * import { connect, keyStores } from 'near-api-js';
 *
 * const keyStore = new keyStores.InMemoryKeyStore();
 * const near = await connect({
 *   networkId: 'testnet',
 *   keyStore,
 *   nodeUrl: 'https://rpc.testnet.near.org'
 * });
 * ```
 *
 * @example Tree-shakeable imports
 * ```ts
 * import { Account, Contract, KeyPair } from 'near-api-js';
 * ```
 *
 * @module near-api-js
 */

// ============================================================================
// Core Types
// ============================================================================
export * from '@near-js/types';

// ============================================================================
// Utilities
// ============================================================================
export * from '@near-js/utils';

// Backward compatibility: Export utils namespace for packages like near-workspaces
// that expect the old structure (utils.format.parseNearAmount, utils.KeyPairEd25519, etc.)
import * as formatModule from '@near-js/utils';
import { KeyPairEd25519 as KeyPairEd25519Class } from '@near-js/crypto';

export const utils = {
    format: {
        parseNearAmount: formatModule.parseNearAmount,
        formatNearAmount: formatModule.formatNearAmount,
    },
    KeyPairEd25519: KeyPairEd25519Class,
};

// ============================================================================
// Cryptography
// ============================================================================
export {
    KeyType,
    KeyPair,
    KeyPairEd25519,
    KeyPairSecp256k1,
    PublicKey,
    keyToImplicitAddress,
} from '@near-js/crypto';
export type {
    CurveType,
    KeyPairString,
    Signature as CryptoSignature,
} from '@near-js/crypto';

// ============================================================================
// Transactions
// ============================================================================
export * from '@near-js/transactions';

// ============================================================================
// Providers
// ============================================================================
export * from '@near-js/providers';

// ============================================================================
// Signers
// ============================================================================
export * from '@near-js/signers';

// ============================================================================
// Accounts
// ============================================================================
export * from '@near-js/accounts';

// ============================================================================
// Keystores (exported as namespace for backward compatibility)
// ============================================================================
export * as keyStores from '@near-js/keystores';
export { InMemoryKeyStore, MergeKeyStore, KeyStore } from '@near-js/keystores';

// Browser keystore (for web environments)
export { BrowserLocalStorageKeyStore } from '@near-js/keystores-browser';

// Node.js keystore (for server environments)
export { UnencryptedFileSystemKeyStore } from '@near-js/keystores-node';

// ============================================================================
// Tokens (FT & NFT standards)
// ============================================================================
export * from '@near-js/tokens';

// ============================================================================
// Advanced Features
// ============================================================================

// Biometric authentication (WebAuthn)
export * from '@near-js/biometric-ed25519';

// IFrame RPC for wallet integrations
export * from '@near-js/iframe-rpc';
