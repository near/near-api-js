# Migrating from near-api-js to @near-js

The `near-api-js@>=2` package now uses the `@near-js/*` packages for most of its functionality. Minimal code
was changed as part of this migration, so if you are using `near-api-js@<=1.1.0` your imports will continue
to resolve correctly.

Moving to the `@near-js/*` packages in your own code is a matter of finding the corresponding export in
the new package. Below, broken down by domain, are the old and new style imports side by side:

### Accounts
`near-api-js`
```ts
import {
    Account,
    accountCreator,
    Connection,
    Contract,
    multisig,
} from 'near-api-js';
const {
    AccountCreator,
    LocalAccountCreator,
    UrlAccountCreator,
} = accountCreator;
const {
    Account2FA,
    AccountMultisig,
    MULTISIG_ALLOWANCE,
    MULTISIG_DEPOSIT,
    MULTISIG_CHANGE_METHODS,
    MULTISIG_CONFIRM_METHODS,
    MULTISIG_GAS,
    MULTISIG_STORAGE_KEY,
    MultisigDeleteRequestRejectionError,
    MultisigStateStatus,
} = multisig;
```

`@near-js/accounts`
```ts

import {
    Account,
    AccountCreator,
    Account2FA,
    AccountMultisig,
    Connection,
    Contract,
    LocalAccountCreator,
    MULTISIG_ALLOWANCE,
    MULTISIG_CHANGE_METHODS,
    MULTISIG_CONFIRM_METHODS,
    MULTISIG_DEPOSIT,
    MULTISIG_GAS,
    MULTISIG_STORAGE_KEY,
    MultisigDeleteRequestRejectionError,
    MultisigStateStatus,
    UrlAccountCreator,
} from '@near-js/accounts';
```

### Cryptography
`near-api-js`
```ts
import {
    KeyPair,
    utils,
} from 'near-api-js';
const {
    KeyPairEd25519,
    PublicKey,
} = utils;
```

`@near-js/crypto`
```ts
import {
    KeyPair,
    KeyPairEd25519,
    PublicKey,
} from '@near-js/crypto';
```

### Keystores
`near-api-js`
```ts
import {
    keyStores,
} from 'near-api-js';
const {
    KeyStore,
    InMemoryKeyStore,
    BrowserLocalStorageKeyStore,
    UnencryptedFileSystemKeyStore,
    MergeKeyStore,
} = keyStores;
```

`@near-js/keystores`
```ts
import {
    InMemoryKeyStore,
    KeyStore,
    MergeKeyStore,
} from '@near-js/keystores';
```

`@near-js/keystores-browser`
```ts
import {
    BrowserLocalStorageKeyStore,
} from '@near-js/keystores-browser';
```

`@near-js/keystores-node`
```ts
import {
    UnencryptedFileSystemKeyStore,
} from '@near-js/keystores-node';
```

### Providers
`near-api-js`
```ts
import {
    providers,
    utils,
} from 'near-api-js';
const {
    ErrorContext,
    ExecutionOutcomeWithId,
    FinalExecutionOutcome,
    FinalExecutionStatus,
    FinalExecutionStatusBasic,
    getTransactionLastResult,
    JsonRpcProvider,
    Provider,
    TypedError,
} = providers;
```

`@near-js/providers`
```ts
import {
    exponentialBackoff,
    fetchJson,
    JsonRpcProvider,
    Provider,
} from '@near-js/providers';
```

`@near-js/types`
```ts
import {
    ErrorContext,
    ExecutionOutcomeWithId,
    FinalExecutionOutcome,
    FinalExecutionStatus,
    FinalExecutionStatusBasic,
    TypedError,
} from '@near-js/types';
```

`@near-js/utils`
```ts
import {
    getTransactionLastResult,
} from '@near-js/utils';
```

### Signers
`near-api-js`
```ts
import {
    InMemorySigner,
    Signer,
} from 'near-api-js';
```

`@near-js/providers`
```ts
import {
    InMemorySigner,
    Signer,
} from '@near-js/signers';
```

### Transactions
`near-api-js`
```ts
import {
    transactions,
} from 'near-api-js';
const {
    addKey,
    createAccount,
    deleteKey,
    deleteAccount,
    deployContract,
    fullAccessKey,
    functionCallAccessKey,
    functionCall,
    stake,
    transfer,
    stringifyJsonOrBytes,
    Action,
    AccessKey,
    AccessKeyPermission,
    AddKey,
    CreateAccount,
    DeleteAccount,
    DeleteKey,
    DeployContract,
    FullAccessPermission,
    FunctionCall,
    FunctionCallPermission,
    Stake,
    Transfer,
    SCHEMA,
    createTransaction,
    signTransaction,
    Signature,
    SignedTransaction,
    Transaction,
} = transactions;
```

`@near-js/transactions`
```ts
import {
    AccessKey,
    AccessKeyPermission,
    Action,
    AddKey,
    CreateAccount,
    DeleteAccount,
    DeleteKey,
    DeployContract,
    FullAccessPermission,
    FunctionCall,
    FunctionCallPermission,
    SignedTransaction,
    Stake,
    Transaction,
    Signature,
    Transfer,
    actionCreators,
    createTransaction,
    SCHEMA,
    signTransaction,
    stringifyJsonOrBytes,
} from '@near-js/transactions';
const {
    addKey,
    createAccount,
    deleteAccount,
    deleteKey,
    deployContract,
    fullAccessKey,
    functionCallAccessKey,
    functionCall,
    stake,
    transfer,
} = actionCreators;
```

### Utils
`near-api-js`
```ts
import {
    DEFAULT_FUNCTION_CALL_GAS,
    utils,
    validators,
} from 'near-api-js';
const {
    format,
    logWarning,
    rpc_errors,
} = utils;
const {
    formatNearAmount,
    NEAR_NOMINATION,
    NEAR_NOMINATION_EXP,
    parseNearAmount,
} = format;
const {
    formatError,
    getErrorTypeFromErrorMessage,
    parseResultError,
    parseRpcError,
    ServerError,
} = rpc_errors;
const {
    ChangedValidatorInfo,
    diffEpochValidators,
    EpochValidatorsDiff,
    findSeatPrice,
} = validators;
```

`@near-js/utils`
```ts
import {
    DEFAULT_FUNCTION_CALL_GAS,
    NEAR_NOMINATION,
    NEAR_NOMINATION_EXP,
    ServerError,
    ChangedValidatorInfo,
    diffEpochValidators,
    EpochValidatorsDiff,
    findSeatPrice,
    formatError,
    formatNearAmount,
    getErrorTypeFromErrorMessage,
    logWarning,
    parseNearAmount,
    parseResultError,
    parseRpcError,
} from '@near-js/utils';
```
