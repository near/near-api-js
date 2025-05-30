# @near-js/client

## 2.1.0

### Patch Changes

- [#1559](https://github.com/near/near-api-js/pull/1559) [`59d3dc9`](https://github.com/near/near-api-js/commit/59d3dc9580be05662cb9a587e82359faccd69d1b) Thanks [@r-near](https://github.com/r-near)! - fix: ESM Module Resolution

- Updated dependencies [[`4971e77`](https://github.com/near/near-api-js/commit/4971e77818d4239ed45552efef0dbc3adb4541c2), [`59d3dc9`](https://github.com/near/near-api-js/commit/59d3dc9580be05662cb9a587e82359faccd69d1b)]:
  - @near-js/accounts@2.1.0
  - @near-js/crypto@2.1.0
  - @near-js/keystores@2.1.0
  - @near-js/providers@2.1.0
  - @near-js/signers@2.1.0
  - @near-js/transactions@2.1.0
  - @near-js/types@2.1.0
  - @near-js/utils@2.1.0

## 2.0.1

### Patch Changes

- [#1554](https://github.com/near/near-api-js/pull/1554) [`13f93eb`](https://github.com/near/near-api-js/commit/13f93ebdac497bb473364da66a493344d955b27f) Thanks [@denbite](https://github.com/denbite)! - Redeploy recent release as patch

- Updated dependencies [[`13f93eb`](https://github.com/near/near-api-js/commit/13f93ebdac497bb473364da66a493344d955b27f)]:
  - @near-js/accounts@2.0.1
  - @near-js/crypto@2.0.1
  - @near-js/keystores@2.0.1
  - @near-js/providers@2.0.1
  - @near-js/signers@2.0.1
  - @near-js/transactions@2.0.1
  - @near-js/types@2.0.1
  - @near-js/utils@2.0.1

## 2.0.0

### Major Changes

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
  - @near-js/utils@2.0.0

## 0.0.4

### Patch Changes

- [#1495](https://github.com/near/near-api-js/pull/1495) [`9cb5f56`](https://github.com/near/near-api-js/commit/9cb5f5621364c370fb2321f6a22dbee146f0f368) Thanks [@AlexKushnir1](https://github.com/AlexKushnir1)! - client: The signer implementation was incorrectly handling transactions by not hashing the encoded transaction before signing

  transactions: Non trivial arguments given to the test so people could use them as an example.

- [#1492](https://github.com/near/near-api-js/pull/1492) [`518e3c6`](https://github.com/near/near-api-js/commit/518e3c68d3d2242c6f9eba411e44f7ea372243ae) Thanks [@frol](https://github.com/frol)! - Fixed "Cannot mix BigInt and other types" error when signing transactions with explicitly provided nonce

- Updated dependencies [[`e408cfc`](https://github.com/near/near-api-js/commit/e408cfc4b4be4ea82e1e34314d9ee92885d03253), [`9cb5f56`](https://github.com/near/near-api-js/commit/9cb5f5621364c370fb2321f6a22dbee146f0f368)]:
  - @near-js/providers@1.0.3
  - @near-js/transactions@1.3.3

## 0.0.3

### Patch Changes

- [#1450](https://github.com/near/near-api-js/pull/1450) [`ef530cf6`](https://github.com/near/near-api-js/commit/ef530cf62b0ed0d7eb2a77482c4d908449a863c2) Thanks [@talentlessguy](https://github.com/talentlessguy)! - drop unfetch polyfill

- Updated dependencies [[`ef530cf6`](https://github.com/near/near-api-js/commit/ef530cf62b0ed0d7eb2a77482c4d908449a863c2), [`c85d12d3`](https://github.com/near/near-api-js/commit/c85d12d36b1d8cd9d02178506dcf9cf0598fe7a8)]:
  - @near-js/providers@1.0.2
  - @near-js/utils@1.1.0
  - @near-js/crypto@1.4.2
  - @near-js/transactions@1.3.2
  - @near-js/keystores@0.2.2
  - @near-js/signers@0.2.2

## 0.0.2

### Patch Changes

- [#1401](https://github.com/near/near-api-js/pull/1401) [`5b0bbbc1`](https://github.com/near/near-api-js/commit/5b0bbbc17ffe7d89d7767e405d2ca700dc2bba40) Thanks [@andy-haynes](https://github.com/andy-haynes)! - @near-js/client package

- Updated dependencies [[`5b0bbbc1`](https://github.com/near/near-api-js/commit/5b0bbbc17ffe7d89d7767e405d2ca700dc2bba40)]:
  - @near-js/crypto@1.4.1
  - @near-js/providers@1.0.1
  - @near-js/types@0.3.1
  - @near-js/utils@1.0.1
  - @near-js/keystores@0.2.1
  - @near-js/signers@0.2.1
  - @near-js/transactions@1.3.1
