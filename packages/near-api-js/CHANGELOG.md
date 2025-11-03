# near-api-js

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
