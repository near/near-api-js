# @near-js/tokens

## 2.3.3

## 2.3.2

## 2.3.1

## 2.3.0

## 2.2.6

### Patch Changes

- [#1618](https://github.com/near/near-api-js/pull/1618) [`e278044`](https://github.com/near/near-api-js/commit/e2780447308b840b17c599a00057e54f94902047) Thanks [@AlexKushnir1](https://github.com/AlexKushnir1)! - Add optional 'precision' param in 'toDecimal' method to limit digits after the decimal point (rounded down), and add unit tests for it

## 2.2.5

## 2.2.4

## 2.2.3

## 2.2.2

## 2.2.1

## 2.2.0

## 2.1.0

### Minor Changes

- [#1586](https://github.com/near/near-api-js/pull/1586) [`fec4678`](https://github.com/near/near-api-js/commit/fec467887b4fc0895522ca37a77c1322244e6082) Thanks [@denbite](https://github.com/denbite)! - Mark `@near-js/*` packages as side-effect free for tree-shaking

### Patch Changes

- [#1583](https://github.com/near/near-api-js/pull/1583) [`23bfc92`](https://github.com/near/near-api-js/commit/23bfc92159b5c0402cb0b55d49818a0532e9f268) Thanks [@r-near](https://github.com/r-near)! - Fix package exports and remove invalid dependency

  Remove invalid "build" dependency and add proper exports for ft/, nft/, and ft/format subdirectories. Updates export validation to use node16 profile since Node10 is past end-of-life.

## 2.0.3

## 2.0.2

### Patch Changes

- [#1560](https://github.com/near/near-api-js/pull/1560) [`3349d4b`](https://github.com/near/near-api-js/commit/3349d4b542bab2a2150326918bdc0b40e3b7fdbe) Thanks [@denbite](https://github.com/denbite)! - Fix the bug with `ft_balance_of` always returning `undefined` for FungibleToken

- [#1559](https://github.com/near/near-api-js/pull/1559) [`59d3dc9`](https://github.com/near/near-api-js/commit/59d3dc9580be05662cb9a587e82359faccd69d1b) Thanks [@r-near](https://github.com/r-near)! - fix: ESM Module Resolution

## 2.0.1

### Patch Changes

- [#1554](https://github.com/near/near-api-js/pull/1554) [`13f93eb`](https://github.com/near/near-api-js/commit/13f93ebdac497bb473364da66a493344d955b27f) Thanks [@denbite](https://github.com/denbite)! - Redeploy recent release as patch

## 2.0.0

### Major Changes

New package, allows to work with tokens on the NEAR blockchain, this includes the Native NEAR, Fungible Tokens and Non-Fungible Tokens.

Tokens implement the `getBalance` and `transfer` methods, as well as conversion utils such as `toUnits` and `toDecimal`

In this first release, the following tokens are supported:

- NEAR
- USDT
- USDC
- wNEAR

- [#1513](https://github.com/near/near-api-js/pull/1513) [`a8e1046`](https://github.com/near/near-api-js/commit/a8e1046d4c184700bed93229f81e7875fca11b27) Thanks [@denbite](https://github.com/denbite)! - Major update for Signer and Account APIs to streamline development
