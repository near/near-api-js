# @near-js/accounts

A collection of classes, functions, and types for interacting with accounts and contracts.

## Modules

- [Account](src/account.ts) a class with methods to transfer NEAR, manage account keys, sign transactions, etc.
- [AccountMultisig](src/account_multisig.ts) a [multisig](https://github.com/near/core-contracts/tree/master/multisig) deployed `Account` requiring multiple keys to sign transactions
- [Account2FA](src/account_2fa.ts) extension of `AccountMultisig` used in conjunction with 2FA provided by [near-contract-helper](https://github.com/near/near-contract-helper)
- [AccountCreator](src/account_creator.ts) classes for creating NEAR accounts
- [Contract](src/contract.ts) represents a deployed smart contract with view and/or change methods
- [Connection](src/connection.ts) a record containing the information required to connect to NEAR RPC
- [Constants](src/constants.ts) account-specific constants
- [Types](src/types.ts) account-specific types

# License

This repository is distributed under the terms of both the MIT license and the Apache License (Version 2.0).
See [LICENSE](https://github.com/near/near-api-js/blob/master/LICENSE) and [LICENSE-APACHE](https://github.com/near/near-api-js/blob/master/LICENSE-APACHE) for details.
