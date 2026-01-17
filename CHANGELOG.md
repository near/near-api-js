# near-api-js

## 7.0.0-rc.4

### Patch Changes

- [#1801](https://github.com/near/near-api-js/pull/1801) [`3e045fe`](https://github.com/near/near-api-js/commit/3e045fe84bebd3ed84e73034a400244893d9c512) Thanks [@gagdiez](https://github.com/gagdiez)! - Replaced some dependencies by internal functions

## 7.0.0-rc.3

### Minor Changes

- [#1799](https://github.com/near/near-api-js/pull/1799) [`a7c3cd9`](https://github.com/near/near-api-js/commit/a7c3cd9b57759a63dc4cb0da6ea428f0719782d4) Thanks [@denbite](https://github.com/denbite)! - Add `parseSeedPhrase` method, exported via the `seed-phrase` sub-path, which converts a string seed phrase into a `KeyPair`.

  For example:

  ```ts
  import { parseSeedPhrase } from "near-api-js/seed-phrase";

  const keyPair = parseSeedPhrase("tag interest match ...");

  keyPair.getPublicKey().toString(); // ed25519:9uMmkWHW...
  keyPair.toString(); // ed25519:3N6TYZVRrkQxh...
  ```

## 7.0.0-rc.2

### Major Changes

- [#1781](https://github.com/near/near-api-js/pull/1781) [`1caddf4`](https://github.com/near/near-api-js/commit/1caddf45510f8e63c96aa7b09855cb56666922c6) Thanks [@denbite](https://github.com/denbite)! - Replace `TypedError` class with a few specific errors created from fully type-safe RPC interfaces

- [#1795](https://github.com/near/near-api-js/pull/1795) [`b96c604`](https://github.com/near/near-api-js/commit/b96c604c4ec543e35d7cb42b77d45147f3b0ab67) Thanks [@denbite](https://github.com/denbite)! - Renovate `Provider.query` by removing the deprecated inline-argument overload and fully aligning the method with the nearcore RPC API spec.

  Previously supported (no longer works):

  ```ts
  provider.query("view_account", JSON.stringify({ ... }));
  ```

  New required usage (fully typed):

  ```ts
  provider.query({
    request_type: "view_account",
    ...
  });
  ```

  Once `request_type` is specified, remaining parameters are inferred automatically by the IDE.

### Minor Changes

- [#1790](https://github.com/near/near-api-js/pull/1790) [`2f7a30d`](https://github.com/near/near-api-js/commit/2f7a30dfaf58497821dd4e9e98518a4891e2b04b) Thanks [@denbite](https://github.com/denbite)! - Introduce many specific errors based on generated response types from OpenAPI spec and which are thrown when calling `Provider.sendJsonRpc` method

- [#1798](https://github.com/near/near-api-js/pull/1798) [`a52592b`](https://github.com/near/near-api-js/commit/a52592b586ee220ed502bcb666dcd47533149782) Thanks [@gagdiez](https://github.com/gagdiez)! - Added a new multi-key signer which handles multiples keys and transparently rotates them as users ask to sign transactions

- [#1796](https://github.com/near/near-api-js/pull/1796) [`c2601e2`](https://github.com/near/near-api-js/commit/c2601e2cf179f9d95109d7318f8aa79fea7278cd) Thanks [@denbite](https://github.com/denbite)! - Add a new `Provider.viewGlobalContractCode` method for retrieving global contract code using either a `codeHash`, or an `accountId` identifier.

  Example usage:

  ```ts
  provider.viewGlobalContractCode({
    identifier: { accountId: "global_contract.near" },
  });
  provider.viewGlobalContractCode({
    identifier: { codeHash: "J1arLz48fgXcGyCPVckFwLnewNH6j1uw79thsvwqGYTY" },
  });
  ```

- [#1794](https://github.com/near/near-api-js/pull/1794) [`7b6ff4f`](https://github.com/near/near-api-js/commit/7b6ff4f9ad72374102297b76dd035104add87201) Thanks [@denbite](https://github.com/denbite)! - Extend the `Account` constructor to accept an RPC URL string in addition to a `Provider`, making account instantiation simpler and more ergonomic.

  New supported usage:

  ```ts
  new Account("user.near", "https://rpc.testnet.near.org");
  ```

  Previously, users had to always manually create a provider:

  ```ts
  const provider = new JsonRpcProvider({ url: "https://rpc.testnet.near.org" });
  new Account("user.near", provider);
  ```

- [#1793](https://github.com/near/near-api-js/pull/1793) [`ddceeab`](https://github.com/near/near-api-js/commit/ddceeab4d0518683353bd0b704c43dc734469e36) Thanks [@denbite](https://github.com/denbite)! - Add concurrent transactions support by introducing nonce caching and automatic retries on `InvalidNonceError`.

  The following example that previously failed due to nonce collisions, now works reliably:

  ```ts
  await Promise.all([
    account.transfer({
      amount: nearToYocto(1),
      receiverId: "user1.testnet",
    }),
    account.transfer({
      amount: nearToYocto(2),
      receiverId: "user2.testnet",
    }),
    account.transfer({
      amount: nearToYocto(3),
      receiverId: "user3.testnet",
    }),
  ]);
  ```

### Patch Changes

- [#1774](https://github.com/near/near-api-js/pull/1774) [`741671b`](https://github.com/near/near-api-js/commit/741671b81f012e638064e571927e5b4b98c34795) Thanks [@denbite](https://github.com/denbite)! - Extend `Provider` interfaces using types generated from `nearcore` OpenAPI spec

## 7.0.0-rc.1

### Minor Changes

- [#1761](https://github.com/near/near-api-js/pull/1761) [`9d8799b`](https://github.com/near/near-api-js/commit/9d8799ba91be05fde2c13dfe833ced75d4a6cec6) Thanks [@denbite](https://github.com/denbite)! - Introduce `teraToGas` and `gigaToGas` helper functions to convert `Gas` amounts conviniently

- [#1761](https://github.com/near/near-api-js/pull/1761) [`fcbb1fe`](https://github.com/near/near-api-js/commit/fcbb1fed22fb0cc8ab055159ef1ef11b05ee13c0) Thanks [@denbite](https://github.com/denbite)! - Introduce `yoctoToNear` and `nearToYocto` helper functions

### Patch Changes

- [#1765](https://github.com/near/near-api-js/pull/1765) [`0ff1536`](https://github.com/near/near-api-js/commit/0ff1536d693e95d27d5a59be83e7b85553297d80) Thanks [@gagdiez](https://github.com/gagdiez)! - Update dependencies

- [#1762](https://github.com/near/near-api-js/pull/1762) [`c711103`](https://github.com/near/near-api-js/commit/c711103be855534b79993a7e61d9fd3def126ac4) Thanks [@denbite](https://github.com/denbite)! - Speed up some `Account` methods by merging sequential `Promises` into `Promise.all()` for slightly better performance

## 7.0.0-rc.0

### Major Changes

- [#1691](https://github.com/near/near-api-js/pull/1691) [`f8666a0`](https://github.com/near/near-api-js/commit/f8666a0112e82d6000fed8ae9f10d893d65878ab) Thanks [@r-near](https://github.com/r-near)! - Update `parseNearAmount` to only accept either a numeric string, or actual number, and not undefined, as well as throw error rather than silently return `null`

- [#1691](https://github.com/near/near-api-js/pull/1691) [`f8666a0`](https://github.com/near/near-api-js/commit/f8666a0112e82d6000fed8ae9f10d893d65878ab) Thanks [@r-near](https://github.com/r-near)! - Rename stable `viewValidatorsV2` function back to `viewValidators`

- [#1672](https://github.com/near/near-api-js/pull/1672) [`eee87c2`](https://github.com/near/near-api-js/commit/eee87c2d55d63050e2e50a1d645ec7d61bd78dbd) Thanks [@github-actions](https://github.com/apps/github-actions)! - Consolidate functionality of the `@near-js/*` packages into a single, tree-shakeable `near-api-js` package

- [#1669](https://github.com/near/near-api-js/pull/1669) [`683e1db`](https://github.com/near/near-api-js/commit/683e1dbd17008c618cda6d5c3cb9e7994ceb2d55) Thanks [@denbite](https://github.com/denbite)! - Remove no longer maintained packages `@near-js/iframe-rpc`, `@near-js/biometric-ed25519` and `@near-js/client` with `@near-js/cookbook` examples

- [#1670](https://github.com/near/near-api-js/pull/1670) [`54e4d48`](https://github.com/near/near-api-js/commit/54e4d48ffd23e0aa0619a0353d521f22a04a74f5) Thanks [@denbite](https://github.com/denbite)! - Remove no longer maintained packages `@near-js/keystores`, `@near-js/keystores-node` and `@near-js/keystores-browser`

- [#1673](https://github.com/near/near-api-js/pull/1673) [`5d86344`](https://github.com/near/near-api-js/commit/5d86344494416f98a71a9266be60105be7fc0def) Thanks [@denbite](https://github.com/denbite)! - Consolidate `@near-js/*` packages into a single `near-api-js` codebase

- [#1668](https://github.com/near/near-api-js/pull/1668) [`20672fb`](https://github.com/near/near-api-js/commit/20672fb915a5cd9609bbc3df2f1b65535bc5c16b) Thanks [@denbite](https://github.com/denbite)! - Remove deprecated functionality

- [#1589](https://github.com/near/near-api-js/pull/1589) [`5cfdab8`](https://github.com/near/near-api-js/commit/5cfdab86b0e3eb6023b427224b1deea9463426eb) Thanks [@AlexKushnir1](https://github.com/AlexKushnir1)! - Refactor the abstract class `Signer` to implement every method, except for `getPublicKey` and `signBytes`, which are intended for users

### Minor Changes

- [#1751](https://github.com/near/near-api-js/pull/1751) [`85f279e`](https://github.com/near/near-api-js/commit/85f279ec020bae04dc631639010dad39a2819328) Thanks [@denbite](https://github.com/denbite)! - Add `nep413` module that implements `signMessage` and `verifyMessage` functions

- [#1748](https://github.com/near/near-api-js/pull/1748) [`917ccea`](https://github.com/near/near-api-js/commit/917ccea1bc0c53d320ec1da9b193edcbaf051411) Thanks [@denbite](https://github.com/denbite)! - Make `Account` to take `KeyPairString` as third parameter

- [#1747](https://github.com/near/near-api-js/pull/1747) [`493d9e5`](https://github.com/near/near-api-js/commit/493d9e5f3dd0030c9dbd7aa143b5be18be9e1f03) Thanks [@denbite](https://github.com/denbite)! - Add sub-path exports for "tokens", "tokens/mainnet" and "tokens/testnet" to improve tree-shaking

- [#1754](https://github.com/near/near-api-js/pull/1754) [`b3b2947`](https://github.com/near/near-api-js/commit/b3b2947a5e0c05691e330ce03c93c3b9a0296433) Thanks [@gagdiez](https://github.com/gagdiez)! - Added optional signer argument to signing functions on account class

### Patch Changes

- [#1752](https://github.com/near/near-api-js/pull/1752) [`e6c61ae`](https://github.com/near/near-api-js/commit/e6c61ae088d91f492060cae8bc2f3bae404b893e) Thanks [@denbite](https://github.com/denbite)! - Remove redundant `null` argument from `Provider.viewValidators` method

- [#1691](https://github.com/near/near-api-js/pull/1691) [`f8666a0`](https://github.com/near/near-api-js/commit/f8666a0112e82d6000fed8ae9f10d893d65878ab) Thanks [@r-near](https://github.com/r-near)! - Add default `EXECUTED_OPTIMISTIC` value to `waitUntil` argument of `viewTransactionStatus` and `viewTransactionStatusWithReceipts`

- [#1692](https://github.com/near/near-api-js/pull/1692) [`4ecebde`](https://github.com/near/near-api-js/commit/4ecebde34a7c3a16ce7293d8633e5efecc181390) Thanks [@r-near](https://github.com/r-near)! - feat: replace ESLint with Biome for linting

- [#1690](https://github.com/near/near-api-js/pull/1690) [`fe0a52e`](https://github.com/near/near-api-js/commit/fe0a52eaeec4c102c128b38a012c84a4692c04f7) Thanks [@r-near](https://github.com/r-near)! - Migrate to `ESM` only

- [#1693](https://github.com/near/near-api-js/pull/1693) [`26ed0cd`](https://github.com/near/near-api-js/commit/26ed0cd922c976d0ad35e413c683abb6745174c8) Thanks [@denbite](https://github.com/denbite)! - Enable TypeScript `strict` mode for better reliability

- [#1743](https://github.com/near/near-api-js/pull/1743) [`a1ea9aa`](https://github.com/near/near-api-js/commit/a1ea9aa13b9b1ce180a546dc15847338af8a6f2f) Thanks [@denbite](https://github.com/denbite)! - Switch to object args for public APIs across the package

- [#1720](https://github.com/near/near-api-js/pull/1720) [`1a41e6c`](https://github.com/near/near-api-js/commit/1a41e6cf7bee81bf940a16d0b78dbcaf565e827f) Thanks [@denbite](https://github.com/denbite)! - Use the most strictest checks in `tsconfig`

## 6.5.1

### Patch Changes

- [#1662](https://github.com/near/near-api-js/pull/1662) [`aad9fd6`](https://github.com/near/near-api-js/commit/aad9fd68e10ba1cee810a207a8c8b3584435a130) Thanks [@denbite](https://github.com/denbite)! - Add duplicate of `keyToImplicitAddress` to `@near-js/crypto` to prevent cycle dependency between packages

- [#1663](https://github.com/near/near-api-js/pull/1663) [`8e9a81b`](https://github.com/near/near-api-js/commit/8e9a81b320e90242cadcea8b465e3bff259dd1eb) Thanks [@denbite](https://github.com/denbite)! - Remove a redundant `assert` call in `@near-js/providers`

- [#1661](https://github.com/near/near-api-js/pull/1661) [`5375dcc`](https://github.com/near/near-api-js/commit/5375dccd6e26ea3977a5980dab6d6895896c0b05) Thanks [@denbite](https://github.com/denbite)! - Add `@near-js/keystores` as dependency to `@near-js/accounts`, not as dev-dep

- Updated dependencies [[`aad9fd6`](https://github.com/near/near-api-js/commit/aad9fd68e10ba1cee810a207a8c8b3584435a130), [`8e9a81b`](https://github.com/near/near-api-js/commit/8e9a81b320e90242cadcea8b465e3bff259dd1eb), [`5375dcc`](https://github.com/near/near-api-js/commit/5375dccd6e26ea3977a5980dab6d6895896c0b05)]:
  - @near-js/crypto@2.5.1
  - @near-js/utils@2.5.1
  - @near-js/providers@2.5.1
  - @near-js/accounts@2.5.1
  - @near-js/keystores@2.5.1
  - @near-js/keystores-browser@2.5.1
  - @near-js/keystores-node@2.5.1
  - @near-js/signers@2.5.1
  - @near-js/transactions@2.5.1
  - @near-js/types@2.5.1

## 6.5.0

### Minor Changes

- [#1659](https://github.com/near/near-api-js/pull/1659) [`d4d33b9`](https://github.com/near/near-api-js/commit/d4d33b902aab93d447d7ad913a58cdab6851b6c3) Thanks [@denbite](https://github.com/denbite)! - Add `viewValidatorsV2` method to `Provider` that allows to query data using either `epoch_id`, or `block_id`

### Patch Changes

- Updated dependencies [[`d4d33b9`](https://github.com/near/near-api-js/commit/d4d33b902aab93d447d7ad913a58cdab6851b6c3)]:
  - @near-js/providers@2.5.0
  - @near-js/accounts@2.5.0
  - @near-js/crypto@2.5.0
  - @near-js/keystores@2.5.0
  - @near-js/keystores-browser@2.5.0
  - @near-js/keystores-node@2.5.0
  - @near-js/signers@2.5.0
  - @near-js/transactions@2.5.0
  - @near-js/types@2.5.0
  - @near-js/utils@2.5.0

## 6.4.1

### Patch Changes

- [#1654](https://github.com/near/near-api-js/pull/1654) [`e10be3d`](https://github.com/near/near-api-js/commit/e10be3d2034a103d7b5e6a4c1fb636990c7b54c1) Thanks [@denbite](https://github.com/denbite)! - Bring back `InMemorySigner` to maintain backward compatibility for legacy projects

- [#1652](https://github.com/near/near-api-js/pull/1652) [`18a696b`](https://github.com/near/near-api-js/commit/18a696bcfe5187005b722c87fab55e2b33fbe2e0) Thanks [@denbite](https://github.com/denbite)! - Extend input type for `formatNearAmount` function

- Updated dependencies [[`e10be3d`](https://github.com/near/near-api-js/commit/e10be3d2034a103d7b5e6a4c1fb636990c7b54c1), [`fdb29a2`](https://github.com/near/near-api-js/commit/fdb29a27e914ac19cacd453bee0b41bbedf7d3ba), [`18a696b`](https://github.com/near/near-api-js/commit/18a696bcfe5187005b722c87fab55e2b33fbe2e0)]:
  - @near-js/accounts@2.4.1
  - @near-js/signers@2.4.1
  - @near-js/crypto@2.4.1
  - @near-js/utils@2.4.1
  - @near-js/keystores@2.4.1
  - @near-js/keystores-browser@2.4.1
  - @near-js/keystores-node@2.4.1
  - @near-js/providers@2.4.1
  - @near-js/transactions@2.4.1
  - @near-js/types@2.4.1

## 6.4.0

### Minor Changes

- [#1648](https://github.com/near/near-api-js/pull/1648) [`dc7f602`](https://github.com/near/near-api-js/commit/dc7f6020e1756aa5227597592dd782fcadb35e23) Thanks [@denbite](https://github.com/denbite)! - Allow `Uint8Array` as args input for `callFunctionRaw` and `callFunction`

### Patch Changes

- Updated dependencies [[`dc7f602`](https://github.com/near/near-api-js/commit/dc7f6020e1756aa5227597592dd782fcadb35e23)]:
  - @near-js/providers@2.4.0
  - @near-js/accounts@2.4.0
  - @near-js/crypto@2.4.0
  - @near-js/keystores@2.4.0
  - @near-js/keystores-browser@2.4.0
  - @near-js/keystores-node@2.4.0
  - @near-js/signers@2.4.0
  - @near-js/transactions@2.4.0
  - @near-js/types@2.4.0
  - @near-js/utils@2.4.0

## 6.3.1

### Patch Changes

- [#1640](https://github.com/near/near-api-js/pull/1640) [`706a5dd`](https://github.com/near/near-api-js/commit/706a5dd4df579d8f65ff17fc522b99d0f5a1608a) Thanks [@denbite](https://github.com/denbite)! - Respect `null` as a valid result of method of `FailoverRpcProvider`

- Updated dependencies [[`706a5dd`](https://github.com/near/near-api-js/commit/706a5dd4df579d8f65ff17fc522b99d0f5a1608a)]:
  - @near-js/providers@2.3.4
  - @near-js/accounts@2.3.4
  - @near-js/crypto@2.3.4
  - @near-js/keystores@2.3.4
  - @near-js/keystores-browser@2.3.4
  - @near-js/keystores-node@2.3.4
  - @near-js/signers@2.3.4
  - @near-js/transactions@2.3.4
  - @near-js/types@2.3.4
  - @near-js/utils@2.3.4

## 6.3.0

### Minor Changes

- [#1624](https://github.com/near/near-api-js/pull/1624) [`0bef0bd`](https://github.com/near/near-api-js/commit/0bef0bdc455eef0fdb690bb7026ec8c5f53d5d93) Thanks [@denbite](https://github.com/denbite)! - Introduce `TypedContract` with type-safe ABI support

### Patch Changes

- [#1621](https://github.com/near/near-api-js/pull/1621) [`0a99da4`](https://github.com/near/near-api-js/commit/0a99da4d40cb2308833d8372f153562b64aa6ceb) Thanks [@denbite](https://github.com/denbite)! - Add deprecation annotations and warnings to functions/classes that will be removed in the next major release

- Updated dependencies [[`0bef0bd`](https://github.com/near/near-api-js/commit/0bef0bdc455eef0fdb690bb7026ec8c5f53d5d93), [`0a99da4`](https://github.com/near/near-api-js/commit/0a99da4d40cb2308833d8372f153562b64aa6ceb)]:
  - @near-js/accounts@2.3.0
  - @near-js/types@2.3.0
  - @near-js/utils@2.3.0
  - @near-js/crypto@2.3.0
  - @near-js/keystores@2.3.0
  - @near-js/keystores-browser@2.3.0
  - @near-js/keystores-node@2.3.0
  - @near-js/providers@2.3.0
  - @near-js/signers@2.3.0
  - @near-js/transactions@2.3.0

## 6.2.6

### Patch Changes

- [#1620](https://github.com/near/near-api-js/pull/1620) [`0ce235d`](https://github.com/near/near-api-js/commit/0ce235db970fcca172ca31aa5272c16248957be4) Thanks [@denbite](https://github.com/denbite)! - Use `optimistic` finality as default one for RPC queries made from `Account`

- Updated dependencies [[`0ce235d`](https://github.com/near/near-api-js/commit/0ce235db970fcca172ca31aa5272c16248957be4)]:
  - @near-js/accounts@2.2.6
  - @near-js/crypto@2.2.6
  - @near-js/keystores@2.2.6
  - @near-js/keystores-browser@2.2.6
  - @near-js/keystores-node@2.2.6
  - @near-js/providers@2.2.6
  - @near-js/signers@2.2.6
  - @near-js/transactions@2.2.6
  - @near-js/types@2.2.6
  - @near-js/utils@2.2.6

## 6.2.5

### Patch Changes

- [#1613](https://github.com/near/near-api-js/pull/1613) [`b78f334`](https://github.com/near/near-api-js/commit/b78f3343a2d338c01b81c232a67e80dd6ccef6c0) Thanks [@denbite](https://github.com/denbite)! - Provide default value `{}` for headers as `connection.headers` could be `undefined` in some cases

- [#1613](https://github.com/near/near-api-js/pull/1613) [`e8a01e9`](https://github.com/near/near-api-js/commit/e8a01e998c465df1bb1bda4b3967a6e597f85cad) Thanks [@denbite](https://github.com/denbite)! - Update interfaces of `JsonRpcProvider` and `FailoverRpcProvider` to be aligned with `Provider`

- [#1613](https://github.com/near/near-api-js/pull/1613) [`d399fe5`](https://github.com/near/near-api-js/commit/d399fe561cbeabe09c9877f23b47b57a16896f41) Thanks [@denbite](https://github.com/denbite)! - Make parameter type of function `Provider.gasPrice` nullable (to be aligned with actual implemention in `JsonRpcProvider`)

- Updated dependencies [[`b78f334`](https://github.com/near/near-api-js/commit/b78f3343a2d338c01b81c232a67e80dd6ccef6c0), [`e8a01e9`](https://github.com/near/near-api-js/commit/e8a01e998c465df1bb1bda4b3967a6e597f85cad), [`d399fe5`](https://github.com/near/near-api-js/commit/d399fe561cbeabe09c9877f23b47b57a16896f41)]:
  - @near-js/providers@2.2.5
  - @near-js/accounts@2.2.5
  - @near-js/crypto@2.2.5
  - @near-js/keystores@2.2.5
  - @near-js/keystores-browser@2.2.5
  - @near-js/keystores-node@2.2.5
  - @near-js/signers@2.2.5
  - @near-js/transactions@2.2.5
  - @near-js/types@2.2.5
  - @near-js/utils@2.2.5

## 6.2.4

### Patch Changes

- [#1611](https://github.com/near/near-api-js/pull/1611) [`30403a7`](https://github.com/near/near-api-js/commit/30403a7840a119f08cd6372f7bdc18017572d810) Thanks [@denbite](https://github.com/denbite)! - Add `signedDelegate` to `ClassicActions` schema to align the indices of `deployGlobalContract` and `useGlobalContract` actions

- Updated dependencies [[`30403a7`](https://github.com/near/near-api-js/commit/30403a7840a119f08cd6372f7bdc18017572d810)]:
  - @near-js/transactions@2.2.4
  - @near-js/accounts@2.2.4
  - @near-js/crypto@2.2.4
  - @near-js/keystores@2.2.4
  - @near-js/keystores-browser@2.2.4
  - @near-js/keystores-node@2.2.4
  - @near-js/providers@2.2.4
  - @near-js/signers@2.2.4
  - @near-js/types@2.2.4
  - @near-js/utils@2.2.4

## 6.2.3

### Patch Changes

- [#1604](https://github.com/near/near-api-js/pull/1604) [`edcadb6`](https://github.com/near/near-api-js/commit/edcadb6e3125ab16a85032de27feb60d0a3307f5) Thanks [@denbite](https://github.com/denbite)! - Added generic type for `Provider.callFunction` to allow client explicitly specify expected return type

- [#1604](https://github.com/near/near-api-js/pull/1604) [`4f89a24`](https://github.com/near/near-api-js/commit/4f89a245754c1aa14b141767d895a608f53b8980) Thanks [@denbite](https://github.com/denbite)! - Added generic type for `Account.callFunction` to allow client explicitly specify expected return type

- Updated dependencies [[`edcadb6`](https://github.com/near/near-api-js/commit/edcadb6e3125ab16a85032de27feb60d0a3307f5), [`4f89a24`](https://github.com/near/near-api-js/commit/4f89a245754c1aa14b141767d895a608f53b8980)]:
  - @near-js/providers@2.2.3
  - @near-js/accounts@2.2.3
  - @near-js/crypto@2.2.3
  - @near-js/keystores@2.2.3
  - @near-js/keystores-browser@2.2.3
  - @near-js/keystores-node@2.2.3
  - @near-js/signers@2.2.3
  - @near-js/transactions@2.2.3
  - @near-js/types@2.2.3
  - @near-js/utils@2.2.3

## 6.2.2

### Patch Changes

- [#1602](https://github.com/near/near-api-js/pull/1602) [`3cd7545`](https://github.com/near/near-api-js/commit/3cd754583d23e07ec91336da47bd0347316c2e7a) Thanks [@Elabar](https://github.com/Elabar)! - Fix meta transaction is not signing correctly

- Updated dependencies [[`3cd7545`](https://github.com/near/near-api-js/commit/3cd754583d23e07ec91336da47bd0347316c2e7a)]:
  - @near-js/signers@2.2.2
  - @near-js/accounts@2.2.2
  - @near-js/crypto@2.2.2
  - @near-js/keystores@2.2.2
  - @near-js/keystores-browser@2.2.2
  - @near-js/keystores-node@2.2.2
  - @near-js/providers@2.2.2
  - @near-js/transactions@2.2.2
  - @near-js/types@2.2.2
  - @near-js/utils@2.2.2

## 6.2.1

### Patch Changes

- [#1600](https://github.com/near/near-api-js/pull/1600) [`0dc60d1`](https://github.com/near/near-api-js/commit/0dc60d130be5fad05166e49a27444452fec57016) Thanks [@denbite](https://github.com/denbite)! - Bump to upgrade deps

## 6.2.0

### Minor Changes

- [#1595](https://github.com/near/near-api-js/pull/1595) [`55667eb`](https://github.com/near/near-api-js/commit/55667eb66a333967acd2094ff24c1f3a54529a48) Thanks [@denbite](https://github.com/denbite)! - Add `Account.callFunctionRaw` method that returns raw transaction outcome

### Patch Changes

- [#1591](https://github.com/near/near-api-js/pull/1591) [`bfc969a`](https://github.com/near/near-api-js/commit/bfc969acb10bf70bfc635078d42796b7d91030e6) Thanks [@denbite](https://github.com/denbite)! - Migrate to building with `tsup` for `near-api-js`

- Updated dependencies [[`e368604`](https://github.com/near/near-api-js/commit/e368604891899726982d254059edbdf14f48ef45), [`55667eb`](https://github.com/near/near-api-js/commit/55667eb66a333967acd2094ff24c1f3a54529a48)]:
  - @near-js/accounts@2.2.0
  - @near-js/crypto@2.2.0
  - @near-js/keystores@2.2.0
  - @near-js/keystores-browser@2.2.0
  - @near-js/keystores-node@2.2.0
  - @near-js/providers@2.2.0
  - @near-js/signers@2.2.0
  - @near-js/transactions@2.2.0
  - @near-js/types@2.2.0
  - @near-js/utils@2.2.0

## 6.1.0

### Minor Changes

- [#1586](https://github.com/near/near-api-js/pull/1586) [`fec4678`](https://github.com/near/near-api-js/commit/fec467887b4fc0895522ca37a77c1322244e6082) Thanks [@denbite](https://github.com/denbite)! - Mark `@near-js/*` packages as side-effect free for tree-shaking

### Patch Changes

- Updated dependencies [[`46e5d4e`](https://github.com/near/near-api-js/commit/46e5d4ec74f8f11394364b4a8e568681c4399a73), [`fec4678`](https://github.com/near/near-api-js/commit/fec467887b4fc0895522ca37a77c1322244e6082), [`ff2f6ea`](https://github.com/near/near-api-js/commit/ff2f6ea2ac5cb7ba9e62626cd07bece2e57e5c63), [`c511649`](https://github.com/near/near-api-js/commit/c511649536035f3fe78b8c14907dc814dfb1a310), [`99f3486`](https://github.com/near/near-api-js/commit/99f34864317725467a097dc3c7a3cc5f7a5b43d4), [`34df601`](https://github.com/near/near-api-js/commit/34df6016b6917c3843085d65da882f4c87af6122), [`af571dc`](https://github.com/near/near-api-js/commit/af571dc8428b5c99a1df2add13630713bf9259c9)]:
  - @near-js/accounts@2.1.0
  - @near-js/keystores-browser@2.1.0
  - @near-js/keystores-node@2.1.0
  - @near-js/transactions@2.1.0
  - @near-js/keystores@2.1.0
  - @near-js/providers@2.1.0
  - @near-js/signers@2.1.0
  - @near-js/crypto@2.1.0
  - @near-js/types@2.1.0
  - @near-js/utils@2.1.0

## 6.0.2

### Patch Changes

- [#1556](https://github.com/near/near-api-js/pull/1556) [`4971e77`](https://github.com/near/near-api-js/commit/4971e77818d4239ed45552efef0dbc3adb4541c2) Thanks [@denbite](https://github.com/denbite)! - Rename `createTopLevelAccount` back to `createAccount` for the sake of better naming

- [#1560](https://github.com/near/near-api-js/pull/1560) [`3349d4b`](https://github.com/near/near-api-js/commit/3349d4b542bab2a2150326918bdc0b40e3b7fdbe) Thanks [@denbite](https://github.com/denbite)! - Fix the bug with `ft_balance_of` always returning `undefined` for FungibleToken

- Updated dependencies [[`4971e77`](https://github.com/near/near-api-js/commit/4971e77818d4239ed45552efef0dbc3adb4541c2), [`59d3dc9`](https://github.com/near/near-api-js/commit/59d3dc9580be05662cb9a587e82359faccd69d1b)]:
  - @near-js/accounts@2.0.2
  - @near-js/crypto@2.0.2
  - @near-js/keystores-browser@2.0.2
  - @near-js/keystores-node@2.0.2
  - @near-js/keystores@2.0.2
  - @near-js/providers@2.0.2
  - @near-js/signers@2.0.2
  - @near-js/transactions@2.0.2
  - @near-js/types@2.0.2
  - @near-js/utils@2.0.2

## 6.0.1

### Patch Changes

- [#1554](https://github.com/near/near-api-js/pull/1554) [`13f93eb`](https://github.com/near/near-api-js/commit/13f93ebdac497bb473364da66a493344d955b27f) Thanks [@denbite](https://github.com/denbite)! - Redeploy recent release as patch

- Updated dependencies [[`13f93eb`](https://github.com/near/near-api-js/commit/13f93ebdac497bb473364da66a493344d955b27f)]:
  - @near-js/accounts@2.0.1
  - @near-js/crypto@2.0.1
  - @near-js/keystores@2.0.1
  - @near-js/keystores-browser@2.0.1
  - @near-js/keystores-node@2.0.1
  - @near-js/providers@2.0.1
  - @near-js/signers@2.0.1
  - @near-js/transactions@2.0.1
  - @near-js/types@2.0.1
  - @near-js/utils@2.0.1

## 6.0.0

### Major Changes

Packages are now truly independent and can be imported separately. We strongly encourage users to use the modularized packages instead of the monolithic `near-api-js` package.

- `Account` has received major changes to its interface, we recommend reading the `CHANGELOG` for the `@near-js/accounts` package

- `Signer` class has received major changes to its interface, we recommend reading the `CHANGELOG` for the `@near-js/signers` package

- `Connection` has been deprecated, as it is no longer used by the `Account` class

- A new package `@near-js/tokens` has been added, which allows to work with tokens on the NEAR blockchain. This includes the Native NEAR, Fungible Tokens and Non-Fungible Tokens.

- [#1513](https://github.com/near/near-api-js/pull/1513) [`a8e1046`](https://github.com/near/near-api-js/commit/a8e1046d4c184700bed93229f81e7875fca11b27) Thanks [@denbite](https://github.com/denbite)! - Major update for Signer and Account APIs to streamline development

### Patch Changes

- Updated dependencies [[`a8e1046`](https://github.com/near/near-api-js/commit/a8e1046d4c184700bed93229f81e7875fca11b27)]:
  - @near-js/transactions@2.0.0
  - @near-js/providers@2.0.0
  - @near-js/accounts@2.0.0
  - @near-js/signers@2.0.0
  - @near-js/types@2.0.0
  - @near-js/crypto@2.0.0
  - @near-js/keystores@2.0.0
  - @near-js/keystores-browser@2.0.0
  - @near-js/keystores-node@2.0.0
  - @near-js/utils@2.0.0

## 5.1.1

### Patch Changes

- Updated dependencies [[`e408cfc`](https://github.com/near/near-api-js/commit/e408cfc4b4be4ea82e1e34314d9ee92885d03253), [`9cb5f56`](https://github.com/near/near-api-js/commit/9cb5f5621364c370fb2321f6a22dbee146f0f368)]:
  - @near-js/providers@1.0.3
  - @near-js/transactions@1.3.3
  - @near-js/accounts@1.4.1
  - @near-js/wallet-account@1.3.3

## 5.1.0

### Minor Changes

- [#1433](https://github.com/near/near-api-js/pull/1433) [`c85d12d3`](https://github.com/near/near-api-js/commit/c85d12d36b1d8cd9d02178506dcf9cf0598fe7a8) Thanks [@r-near](https://github.com/r-near)! - Update base58 dependency

### Patch Changes

- Updated dependencies [[`ef530cf6`](https://github.com/near/near-api-js/commit/ef530cf62b0ed0d7eb2a77482c4d908449a863c2), [`c85d12d3`](https://github.com/near/near-api-js/commit/c85d12d36b1d8cd9d02178506dcf9cf0598fe7a8)]:
  - @near-js/accounts@1.4.0
  - @near-js/providers@1.0.2
  - @near-js/utils@1.1.0
  - @near-js/wallet-account@1.3.2
  - @near-js/crypto@1.4.2
  - @near-js/transactions@1.3.2
  - @near-js/keystores@0.2.2
  - @near-js/keystores-browser@0.2.2
  - @near-js/keystores-node@0.1.2
  - @near-js/signers@0.2.2

## 5.0.1

### Patch Changes

- Updated dependencies [[`5b0bbbc1`](https://github.com/near/near-api-js/commit/5b0bbbc17ffe7d89d7767e405d2ca700dc2bba40)]:
  - @near-js/crypto@1.4.1
  - @near-js/providers@1.0.1
  - @near-js/types@0.3.1
  - @near-js/utils@1.0.1
  - @near-js/accounts@1.3.1
  - @near-js/keystores@0.2.1
  - @near-js/keystores-browser@0.2.1
  - @near-js/keystores-node@0.1.1
  - @near-js/signers@0.2.1
  - @near-js/transactions@1.3.1
  - @near-js/wallet-account@1.3.1

## 5.0.0

### Major Changes

- [#1353](https://github.com/near/near-api-js/pull/1353) [`73690557`](https://github.com/near/near-api-js/commit/73690557c8e2a74386fca62f4ae123abe0651403) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Update to Node.js 20 LTS & pnpm 9.4, modularize packages, simplify dependencies, and update tests

  **Breaking Changes**

  - `near-api-js@5.0.0`

    - The following functions are no longer exported:
      - `logWarning`
      - `fetchJson`
      - the unnamed wrapped `fetch` function exported from `setup-node-fetch.ts`
    - The browser bundle is no longer being built in version 5; for browser support please use modules

  - `@near-js/providers@1.0.0`

    - The following functions are no longer exported:
      - `fetchJson`

  - `@near-js/utils@1.0.0`
    - The following functions are no longer exported:
      - `logWarning`

### Patch Changes

- Updated dependencies [[`73690557`](https://github.com/near/near-api-js/commit/73690557c8e2a74386fca62f4ae123abe0651403)]:
  - @near-js/accounts@1.3.0
  - @near-js/crypto@1.4.0
  - @near-js/keystores@0.2.0
  - @near-js/keystores-browser@0.2.0
  - @near-js/keystores-node@0.1.0
  - @near-js/providers@1.0.0
  - @near-js/signers@0.2.0
  - @near-js/transactions@1.3.0
  - @near-js/types@0.3.0
  - @near-js/utils@1.0.0
  - @near-js/wallet-account@1.3.0

## 4.0.4

### Patch Changes

- [#1355](https://github.com/near/near-api-js/pull/1355) [`7d5a8244`](https://github.com/near/near-api-js/commit/7d5a8244a1683d7b5e82c4da1e40d834167a9a41) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Add Secp256k1 support

- Updated dependencies [[`9c7db11c`](https://github.com/near/near-api-js/commit/9c7db11c3c5c031a749dd72d5140f58056570e36), [`bad95007`](https://github.com/near/near-api-js/commit/bad95007edde4ed9d5989ded7f2032b9f15f5c23), [`7d5a8244`](https://github.com/near/near-api-js/commit/7d5a8244a1683d7b5e82c4da1e40d834167a9a41)]:
  - @near-js/keystores@0.1.0
  - @near-js/keystores-browser@0.1.0
  - @near-js/utils@0.3.0
  - @near-js/crypto@1.3.0
  - @near-js/accounts@1.2.2
  - @near-js/signers@0.1.5
  - @near-js/transactions@1.2.3
  - @near-js/wallet-account@1.2.3
  - @near-js/keystores-node@0.0.13
  - @near-js/providers@0.2.3

## 4.0.3

### Patch Changes

- [#1360](https://github.com/near/near-api-js/pull/1360) [`e90e648c`](https://github.com/near/near-api-js/commit/e90e648ca4d6c3505141ad2ec666bbd9375b1289) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Export encodeTransaction method in near-api-js package

## 4.0.2

### Patch Changes

- Updated dependencies [[`ecdf1741`](https://github.com/near/near-api-js/commit/ecdf1741fb692e71202c541c5b3692790baa65f0), [`92a6f5be`](https://github.com/near/near-api-js/commit/92a6f5be3f4b7be6f3e9b55077025921c3aad2cb)]:
  - @near-js/providers@0.2.2
  - @near-js/types@0.2.1
  - @near-js/accounts@1.2.1
  - @near-js/wallet-account@1.2.2
  - @near-js/crypto@1.2.4
  - @near-js/keystores@0.0.12
  - @near-js/transactions@1.2.2
  - @near-js/utils@0.2.2
  - @near-js/keystores-browser@0.0.12
  - @near-js/keystores-node@0.0.12
  - @near-js/signers@0.1.4

## 4.0.1

### Patch Changes

- Updated dependencies [[`06baa81d`](https://github.com/near/near-api-js/commit/06baa81dc604cfe0463476de7a4dcdd39a6f716a)]:
  - @near-js/accounts@1.2.0
  - @near-js/types@0.2.0
  - @near-js/wallet-account@1.2.1
  - @near-js/crypto@1.2.3
  - @near-js/keystores@0.0.11
  - @near-js/providers@0.2.1
  - @near-js/transactions@1.2.1
  - @near-js/utils@0.2.1
  - @near-js/keystores-browser@0.0.11
  - @near-js/keystores-node@0.0.11
  - @near-js/signers@0.1.3

## 4.0.0

### Major Changes

- [#1223](https://github.com/near/near-api-js/pull/1223) [`9060b781`](https://github.com/near/near-api-js/commit/9060b7811668d71bdf21170273a42842c3691f9b) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Replace bn.js by BigInt.

### Patch Changes

- [#1292](https://github.com/near/near-api-js/pull/1292) [`f739324b`](https://github.com/near/near-api-js/commit/f739324b2959712281d957eb26a09e5d68e32c80) Thanks [@gtsonevv](https://github.com/gtsonevv)! - replace ajv with is-my-json-valid

- Updated dependencies [[`9060b781`](https://github.com/near/near-api-js/commit/9060b7811668d71bdf21170273a42842c3691f9b), [`cc401a6c`](https://github.com/near/near-api-js/commit/cc401a6c893398e2185c35765ca316f68ac86074), [`3f363113`](https://github.com/near/near-api-js/commit/3f363113e102d0acf29b7b2635acf6160a028cc3), [`f739324b`](https://github.com/near/near-api-js/commit/f739324b2959712281d957eb26a09e5d68e32c80)]:
  - @near-js/accounts@1.1.0
  - @near-js/transactions@1.2.0
  - @near-js/types@0.1.0
  - @near-js/utils@0.2.0
  - @near-js/crypto@1.2.2
  - @near-js/providers@0.2.0
  - @near-js/wallet-account@1.2.0
  - @near-js/keystores@0.0.10
  - @near-js/keystores-browser@0.0.10
  - @near-js/keystores-node@0.0.10
  - @near-js/signers@0.1.2

## 3.0.4

### Patch Changes

- Updated dependencies [[`42dc7e2a`](https://github.com/near/near-api-js/commit/42dc7e2ac794e973987bed7b89da5ef2d3c6c8ac)]:
  - @near-js/transactions@1.1.2
  - @near-js/accounts@1.0.4
  - @near-js/providers@0.1.1
  - @near-js/wallet-account@1.1.1

## 3.0.3

### Patch Changes

- Updated dependencies [[`662cc13d`](https://github.com/near/near-api-js/commit/662cc13d7961c3bdabed3ad51b1c57958739a3e6), [`c4655576`](https://github.com/near/near-api-js/commit/c4655576bacb1d8b85030dca5b9443649621c8ee), [`15885dd1`](https://github.com/near/near-api-js/commit/15885dd10ba9b562043a36dc80c449b7c3588313)]:
  - @near-js/providers@0.1.0
  - @near-js/utils@0.1.0
  - @near-js/crypto@1.2.1
  - @near-js/wallet-account@1.1.0
  - @near-js/accounts@1.0.3
  - @near-js/transactions@1.1.1
  - @near-js/keystores@0.0.9
  - @near-js/keystores-browser@0.0.9
  - @near-js/keystores-node@0.0.9
  - @near-js/signers@0.1.1

## 3.0.2

### Patch Changes

- Updated dependencies [[`1900c490`](https://github.com/near/near-api-js/commit/1900c49060c3ea8279448cead7347049a23f421f), [`c6cdc8c7`](https://github.com/near/near-api-js/commit/c6cdc8c724a6dd53114cc5f53fd58e57cea86b78)]:
  - @near-js/crypto@1.2.0
  - @near-js/signers@0.1.0
  - @near-js/transactions@1.1.0
  - @near-js/accounts@1.0.2
  - @near-js/keystores@0.0.8
  - @near-js/keystores-browser@0.0.8
  - @near-js/keystores-node@0.0.8
  - @near-js/wallet-account@1.0.2
  - @near-js/providers@0.0.10

## 3.0.1

### Patch Changes

- Updated dependencies [[`aeeb1502`](https://github.com/near/near-api-js/commit/aeeb15022a1c1deb99114eba0473739b0998fc50)]:
  - @near-js/crypto@1.1.0
  - @near-js/accounts@1.0.1
  - @near-js/keystores@0.0.7
  - @near-js/keystores-browser@0.0.7
  - @near-js/keystores-node@0.0.7
  - @near-js/signers@0.0.7
  - @near-js/transactions@1.0.1
  - @near-js/wallet-account@1.0.1
  - @near-js/providers@0.0.9

## 3.0.0

### Major Changes

- [#1168](https://github.com/near/near-api-js/pull/1168) [`61349aec`](https://github.com/near/near-api-js/commit/61349aeca3af830f702b24654e0f13cd428192d8) Thanks [@gagdiez](https://github.com/gagdiez)! - feat: updated borsh-js to v1.0.1

### Minor Changes

- [#1215](https://github.com/near/near-api-js/pull/1215) [`ecf29e2d`](https://github.com/near/near-api-js/commit/ecf29e2d56611a7773c79d5bb5bd20c8b7e738ea) Thanks [@denbite](https://github.com/denbite)! - Internal logging library with capabilities for integration with modern logging libraries like Pino, Winston, etc

### Patch Changes

- [#1195](https://github.com/near/near-api-js/pull/1195) [`695220e7`](https://github.com/near/near-api-js/commit/695220e75bc43834a7700cfc5491a7eebd324947) Thanks [@ShaunSHamilton](https://github.com/ShaunSHamilton)! - add check for global 'process' object

- [#1209](https://github.com/near/near-api-js/pull/1209) [`cdd8d1c8`](https://github.com/near/near-api-js/commit/cdd8d1c8c37db641bd995b2c470ad0b4fdddb93f) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Replace tweetnacl by @noble/curves

- [#1194](https://github.com/near/near-api-js/pull/1194) [`038b9b9f`](https://github.com/near/near-api-js/commit/038b9b9fd57f73e537041d4b90ed07bf3cd811d9) Thanks [@andrew-scott-fischer](https://github.com/andrew-scott-fischer)! - fixes override of global fetch property

- Updated dependencies [[`0f764ee0`](https://github.com/near/near-api-js/commit/0f764ee03b5747fbf8a971c7b04ef8326238a1d0), [`695220e7`](https://github.com/near/near-api-js/commit/695220e75bc43834a7700cfc5491a7eebd324947), [`0be6c420`](https://github.com/near/near-api-js/commit/0be6c4209f56c0595bf66e217b7ac01444981b99), [`ecf29e2d`](https://github.com/near/near-api-js/commit/ecf29e2d56611a7773c79d5bb5bd20c8b7e738ea), [`61349aec`](https://github.com/near/near-api-js/commit/61349aeca3af830f702b24654e0f13cd428192d8), [`cdd8d1c8`](https://github.com/near/near-api-js/commit/cdd8d1c8c37db641bd995b2c470ad0b4fdddb93f), [`038b9b9f`](https://github.com/near/near-api-js/commit/038b9b9fd57f73e537041d4b90ed07bf3cd811d9)]:
  - @near-js/accounts@1.0.0
  - @near-js/providers@0.0.8
  - @near-js/utils@0.0.5
  - @near-js/wallet-account@1.0.0
  - @near-js/crypto@1.0.0
  - @near-js/transactions@1.0.0
  - @near-js/keystores@0.0.6
  - @near-js/keystores-browser@0.0.6
  - @near-js/keystores-node@0.0.6
  - @near-js/signers@0.0.6

## 2.1.4

### Patch Changes

- Updated dependencies [[`40fa6465`](https://github.com/near/near-api-js/commit/40fa64654fdaf3b463122c35521a6f72282974f2)]:
  - @near-js/crypto@0.0.5
  - @near-js/accounts@0.1.4
  - @near-js/keystores@0.0.5
  - @near-js/keystores-browser@0.0.5
  - @near-js/keystores-node@0.0.5
  - @near-js/signers@0.0.5
  - @near-js/transactions@0.2.1
  - @near-js/wallet-account@0.0.7
  - @near-js/providers@0.0.7

## 2.1.3

### Patch Changes

- [#1128](https://github.com/near/near-api-js/pull/1128) [`e21ff896`](https://github.com/near/near-api-js/commit/e21ff89601c858fb703169e3bb53c6d96cff5342) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Compatibility shim for NearSocial/VM

- Updated dependencies [[`e21ff896`](https://github.com/near/near-api-js/commit/e21ff89601c858fb703169e3bb53c6d96cff5342), [`00b4d2ba`](https://github.com/near/near-api-js/commit/00b4d2ba3f9f3a1f90343e34cb9bde8cdb607ceb)]:
  - @near-js/transactions@0.2.0
  - @near-js/accounts@0.1.3
  - @near-js/providers@0.0.6
  - @near-js/wallet-account@0.0.6

## 2.1.2

### Patch Changes

- [#1124](https://github.com/near/near-api-js/pull/1124) [`c1dcf3b8`](https://github.com/near/near-api-js/commit/c1dcf3b8207e7de358e1d711d55da938d5d9ff8d) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Allow use of legacy `deps.keyStore` path in NearConfig

- Updated dependencies [[`bf81ddc1`](https://github.com/near/near-api-js/commit/bf81ddc11c958dece2244798bdfa6ab11e653940), [`c1dcf3b8`](https://github.com/near/near-api-js/commit/c1dcf3b8207e7de358e1d711d55da938d5d9ff8d)]:
  - @near-js/types@0.0.4
  - @near-js/wallet-account@0.0.5
  - @near-js/accounts@0.1.2
  - @near-js/crypto@0.0.4
  - @near-js/keystores@0.0.4
  - @near-js/providers@0.0.5
  - @near-js/transactions@0.1.1
  - @near-js/utils@0.0.4
  - @near-js/keystores-browser@0.0.4
  - @near-js/keystores-node@0.0.4
  - @near-js/signers@0.0.4

## 2.1.1

### Patch Changes

- Updated dependencies [[`d6d53ab1`](https://github.com/near/near-api-js/commit/d6d53ab1b90e3d4041080dd4a6e22d24900c1ca5)]:
  - @near-js/providers@0.0.4
  - @near-js/accounts@0.1.1
  - @near-js/wallet-account@0.0.4

## 2.1.0

### Minor Changes

- [#1103](https://github.com/near/near-api-js/pull/1103) [`b713ae78`](https://github.com/near/near-api-js/commit/b713ae78969d530e7e69e21e315e3d3fdb5e68e9) Thanks [@austinabell](https://github.com/austinabell)! - Implement light client block retrieval and relevant types

### Patch Changes

- [#1106](https://github.com/near/near-api-js/pull/1106) [`bc53c32c`](https://github.com/near/near-api-js/commit/bc53c32c80694e6f22d9be97db44603591f0026b) Thanks [@austinabell](https://github.com/austinabell)! - Adds missing timestamp_nanosec field to light client proof header

- Updated dependencies [[`b713ae78`](https://github.com/near/near-api-js/commit/b713ae78969d530e7e69e21e315e3d3fdb5e68e9), [`bc53c32c`](https://github.com/near/near-api-js/commit/bc53c32c80694e6f22d9be97db44603591f0026b), [`b7b6c6a1`](https://github.com/near/near-api-js/commit/b7b6c6a1448050f60f6498f799654204f1998b91), [`d97d2a6e`](https://github.com/near/near-api-js/commit/d97d2a6e891350cdea418da2af2b2971bdf0467e), [`4704ee77`](https://github.com/near/near-api-js/commit/4704ee7717d9e92e7729037368e7ace84a9c7f1c), [`8c6bf391`](https://github.com/near/near-api-js/commit/8c6bf391a01af9adb81cb8731c45bdb17f5291c0)]:
  - @near-js/providers@0.0.3
  - @near-js/types@0.0.3
  - @near-js/accounts@0.1.0
  - @near-js/transactions@0.1.0
  - @near-js/crypto@0.0.3
  - @near-js/keystores@0.0.3
  - @near-js/utils@0.0.3
  - @near-js/wallet-account@0.0.3
  - @near-js/keystores-browser@0.0.3
  - @near-js/keystores-node@0.0.3
  - @near-js/signers@0.0.3

## 2.0.4

### Patch Changes

- [#1093](https://github.com/near/near-api-js/pull/1093) [`94311587`](https://github.com/near/near-api-js/commit/94311587ece172fb3e4d009ca0ecbfe9cea4447a) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Publish repackaging

## 2.0.3

### Patch Changes

- Updated dependencies [[`ca458cac`](https://github.com/near/near-api-js/commit/ca458cac683fab614b77eb5daa160e03b0640350)]:
  - @near-js/accounts@0.0.2
  - @near-js/crypto@0.0.2
  - @near-js/keystores@0.0.2
  - @near-js/keystores-browser@0.0.2
  - @near-js/keystores-node@0.0.2
  - @near-js/providers@0.0.2
  - @near-js/signers@0.0.2
  - @near-js/transactions@0.0.2
  - @near-js/types@0.0.2
  - @near-js/utils@0.0.2
  - @near-js/wallet-account@0.0.2

## 2.0.2

### Patch Changes

- [#1089](https://github.com/near/near-api-js/pull/1089) [`c1ffd501`](https://github.com/near/near-api-js/commit/c1ffd5016cd9bbc285c5ec2b63ff4403e675338e) Thanks [@andy-haynes](https://github.com/andy-haynes)! - CI update

## 2.0.1

### Patch Changes

- [#1087](https://github.com/near/near-api-js/pull/1087) [`4f9e3d4d`](https://github.com/near/near-api-js/commit/4f9e3d4d978adc4a073e0ae2cdba69c3e1600201) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Use new packages in @near-js/biometric-ed25519

## 2.0.0

### Major Changes

- [#1006](https://github.com/near/near-api-js/pull/1006) [`8ee564c0`](https://github.com/near/near-api-js/commit/8ee564c0f4786e3c9281892c73761bd6a9205074) Thanks [@morgsmccauley](https://github.com/morgsmccauley)! - Make `Account.signAndSendTransaction` `public` so transactions can be sent directly from `Account` instances

- [#1014](https://github.com/near/near-api-js/pull/1014) [`8feb1997`](https://github.com/near/near-api-js/commit/8feb199733a770b25b63b0bbc7d79fc8b0b1683c) Thanks [@esaminu](https://github.com/esaminu)! - Make `appKeyPrefix` a required arg to `WalletConnection` constructor

  Users that were doing

  ```typescript
  new WalletConnection(near);
  ```

  will now have to do

  ```typescript
  new WalletConnection(near, "undefined");
  ```

  If they want to access the keys they had potentially accumulated

- [#935](https://github.com/near/near-api-js/pull/935) [`c740afc8`](https://github.com/near/near-api-js/commit/c740afc897208d26165c4f8b2aae6db70694e70b) Thanks [@hcho112](https://github.com/hcho112)! - `account.viewFunction` now takes a single object argument rather than individual args. Callsites will now need to be updated like so:

  ```diff
  -await account.viewFunction(
  -  'wrap.near',
  -  'storage_balance_of',
  -  { account_id: 'example.near' }
  -);
  +await account.viewFunction({
  +  contractId: 'wrap.near',
  +  methodName: 'storage_balance_of',
  +  args: { account_id: 'example.near' },
  +});
  ```

- [#1056](https://github.com/near/near-api-js/pull/1056) [`b823ada7`](https://github.com/near/near-api-js/commit/b823ada740e64a45d4b9671fab791968b51de61a) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Major functionality in near-api-js has now been broken up into packages under @near-js

  Breaking changes:

  - `KeyPairEd25519` no longer supports the `fromString` static method. This method is now only available on the `KeyPair` class.

### Minor Changes

- [#1045](https://github.com/near/near-api-js/pull/1045) [`0c85da12`](https://github.com/near/near-api-js/commit/0c85da123473017683b2a53f83652938488dd086) Thanks [@itegulov](https://github.com/itegulov)! - `Contract` can now optionally be instantiated with ABI

### Patch Changes

- [#1003](https://github.com/near/near-api-js/pull/1003) [`726b7953`](https://github.com/near/near-api-js/commit/726b795312230357aa2bb8a8db8a217a0f18a663) Thanks [@marcinbodnar](https://github.com/marcinbodnar)! - Fix error types. WIth this changes both `JsonRpcProvider.query` and `JsonRpcProvider.sendJsonRpc` methods will return proper error type for these errors: `AccountDoesNotExist`, `AccessKeyDoesNotExist`, `CodeDoesNotExist`, `InvalidNonce`.

  An additional fix to `getErrorTypeFromErrorMessage` function. Now `getErrorTypeFromErrorMessage` will not change error type if it already exists.

## 1.1.0

### Minor Changes

- [#1007](https://github.com/near/near-api-js/pull/1007) [`fff4b44d`](https://github.com/near/near-api-js/commit/fff4b44d6abaccfe8fd112053c5ac2dd0ce00577) Thanks [@morgsmccauley](https://github.com/morgsmccauley)! - Introduce `getActiveDelegatedStakeBalance` to return delegated stake balance of an account

### Patch Changes

- [#1007](https://github.com/near/near-api-js/pull/1007) [`fff4b44d`](https://github.com/near/near-api-js/commit/fff4b44d6abaccfe8fd112053c5ac2dd0ce00577) Thanks [@morgsmccauley](https://github.com/morgsmccauley)! - Removed unused variables and dependencies.
