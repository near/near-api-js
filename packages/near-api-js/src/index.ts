/**
 * NEAR JavaScript API
 *
 * A unified package for interacting with NEAR Protocol.
 * Tree-shakeable and optimized for modern bundlers.
 */

// Core account functionality
export {
    Account,
    AccountCreator,
    LocalAccountCreator,
    UrlAccountCreator,
    Connection,
    Contract,
    TypedContract,
    LocalViewExecution,
    Runtime,
    MULTISIG_STORAGE_KEY,
    MULTISIG_ALLOWANCE,
    MULTISIG_GAS,
    MULTISIG_DEPOSIT,
    MULTISIG_CHANGE_METHODS,
    MULTISIG_CONFIRM_METHODS,
    ArgumentSchemaError,
    ConflictingOptions,
    UnknownArgumentError,
    UnsupportedSerializationError,
    MultisigDeleteRequestRejectionError,
    MultisigStateStatus,
} from '@near-js/accounts';
export type {
    AccountBalance,
    AccountAuthorizedApp,
    SignAndSendTransactionOptions,
    ContractMethods,
    AbiRoot,
    FunctionCallOptions,
    ChangeFunctionCallOptions,
    ViewFunctionCallOptions,
} from '@near-js/accounts';

// Cryptography
export {
    KeyType,
    KeyPair,
    KeyPairEd25519,
    KeyPairSecp256k1,
    PublicKey,
} from '@near-js/crypto';
export type {
    CurveType,
    KeyPairString,
    Signature,
} from '@near-js/crypto';

// Key storage
export {
    InMemoryKeyStore,
    KeyStore,
    MergeKeyStore,
    MultiContractKeyStore,
} from '@near-js/keystores';

export {
    BrowserLocalStorageKeyStore,
    MultiContractBrowserLocalStorageKeyStore,
} from '@near-js/keystores-browser';

export {
    readKeyFile,
    UnencryptedFileSystemKeyStore,
} from '@near-js/keystores-node';

// Providers
export {
    exponentialBackoff,
    JsonRpcProvider,
    FailoverRpcProvider,
} from '@near-js/providers';
export type { Provider } from '@near-js/providers';

// Signers
export {
    KeyPairSigner,
    Signer,
} from '@near-js/signers';
export type { SignedMessage } from '@near-js/signers';

// Transactions
export * from '@near-js/transactions';

// Types
export * from '@near-js/types';

// Utilities
export * from '@near-js/utils';

// High-level client
export * from '@near-js/client';

// Tokens (FT, NFT, MT)
export {
    NEAR,
    NativeToken,
    FungibleToken,
    NonFungibleToken,
    NFTContract,
    MultiTokenContract,
} from '@near-js/tokens';
export * as mainnet from '@near-js/tokens/mainnet';
export * as testnet from '@near-js/tokens/testnet';

// Biometric authentication
export {
    createKey,
    getKeys,
    isPassKeyAvailable,
    isDeviceSupported,
    PasskeyProcessCanceled,
} from '@near-js/biometric-ed25519';

// IFrame RPC
export * from '@near-js/iframe-rpc';
