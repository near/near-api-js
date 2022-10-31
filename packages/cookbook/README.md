# NEAR JavaScript API Cookbook

Collection of common use cases for [`near-api-js`](https://github.com/near/near-api-js).

|                                                                 |                                                                                                                  |
|-----------------------------------------------------------------| ---------------------------------------------------------------------------------------------------------------- |
| **ACCOUNTS**                                                    |                                                                                                                  |
| [Create Account](./accounts/create-testnet-account.js)          | Create [NEAR accounts](https://docs.near.org/concepts/basics/account) without using NEAR Wallet.                   |
| [Access Key Rotation](./accounts/access-keys/README.md)         | Create and delete [access keys](https://docs.near.org/concepts/basics/account#access-keys) for added security.     |
| **TRANSACTIONS**                                                |                                                                                                                  |
| [Get Transaction Status](./transactions/get-tx-status.js)       | Gets transaction status using a tx hash and associated account/contract ID.                                      |
| [Recent Transaction Details](./transactions/get-tx-detail.js)   | Get recent transaction details without using an [indexing](https://docs.near.org/docs/concepts/indexer) service. |
| [Batch Transactions](./transactions/batch-transactions.js)      | Sign and send multiple [transactions](https://docs.near.org/docs/concepts/transaction).                          |
| **UTILS**                                                       |                                                                                                                  |
| [Deploy Contract](./utils/deploy-contract.js)                   | Deploys a contract using a pre-compiled .wasm file                                                               |
| [Calculate Gas](./utils/calculate-gas.js)                       | Calculate [gas burnt](https://docs.near.org/docs/concepts/gas) from any contract call.                           |
| [Read State w/o Account](./utils/get-state.js)                  | Read state of a contract without instantiating an account.                                                       |
| [Wrap](./utils/wrap-near.js) & [Unwrap](./utils/unwrap-near.js)  NEAR | Wrap and unwrap NEAR using the `wrap.near` smart contract.                                                  |
| [Verify Signature](./utils/verify-signature.js)                 | Verify a key pair signature.                                                                                |

## Requirements

-   [NEAR Account](https://docs.near.org/docs/develop/basics/create-account)
-   [Node.js](https://nodejs.org/en/download/package-manager/)
-   [pnpm](https://pnpm.io/installation)

## Setup

1. Install dependencies

```bash
pnpm install
```

2. Navigate to the cookbook directory

```bash
cd packages/cookbook
```

3. Run Commands

Example:

```bash
node utils/get-state
```
