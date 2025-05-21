# @near-js/tokens

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
