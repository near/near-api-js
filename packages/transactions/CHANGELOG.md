# @near-js/transactions

## 2.2.3

### Patch Changes

- Updated dependencies []:
  - @near-js/crypto@2.2.3
  - @near-js/types@2.2.3
  - @near-js/utils@2.2.3

## 2.2.2

### Patch Changes

- Updated dependencies []:
  - @near-js/crypto@2.2.2
  - @near-js/types@2.2.2
  - @near-js/utils@2.2.2

## 2.2.1

### Patch Changes

- [#1598](https://github.com/near/near-api-js/pull/1598) [`f65647f`](https://github.com/near/near-api-js/commit/f65647f6f3e3f5dc18a7d6f24cbeba255ee8476a) Thanks [@Elabar](https://github.com/Elabar)! - Add global contract action to classic actions

- Updated dependencies []:
  - @near-js/crypto@2.2.1
  - @near-js/types@2.2.1
  - @near-js/utils@2.2.1

## 2.2.0

### Patch Changes

- Updated dependencies []:
  - @near-js/crypto@2.2.0
  - @near-js/types@2.2.0
  - @near-js/utils@2.2.0

## 2.1.0

### Minor Changes

- [#1586](https://github.com/near/near-api-js/pull/1586) [`fec4678`](https://github.com/near/near-api-js/commit/fec467887b4fc0895522ca37a77c1322244e6082) Thanks [@denbite](https://github.com/denbite)! - Mark `@near-js/*` packages as side-effect free for tree-shaking

- [#1577](https://github.com/near/near-api-js/pull/1577) [`99f3486`](https://github.com/near/near-api-js/commit/99f34864317725467a097dc3c7a3cc5f7a5b43d4) Thanks [@r-near](https://github.com/r-near)! - feat: add global contracts support to Account class

  Add `deployGlobalContract()` and `useGlobalContract()` methods to the Account class with simplified APIs for NEP-591 global contracts support.

  - `deployGlobalContract(code, deployMode)` accepts "codeHash" or "accountId" string literals
  - `useGlobalContract(contractIdentifier)` auto-detects string (account ID) or Uint8Array (code hash) parameters
  - Includes cookbook example demonstrating usage patterns

  This enables developers to easily deploy and use global contracts without manually creating complex type objects.

### Patch Changes

- [#1581](https://github.com/near/near-api-js/pull/1581) [`ff2f6ea`](https://github.com/near/near-api-js/commit/ff2f6ea2ac5cb7ba9e62626cd07bece2e57e5c63) Thanks [@r-near](https://github.com/r-near)! - Remove unused build package and clean up workspace dependencies. The build package contained an unused cjsify utility that was replaced by tsup for CommonJS output generation.

- [#1578](https://github.com/near/near-api-js/pull/1578) [`c511649`](https://github.com/near/near-api-js/commit/c511649536035f3fe78b8c14907dc814dfb1a310) Thanks [@r-near](https://github.com/r-near)! - Fix instanceof check for SignedTransaction to prevent cross-package version errors

- Updated dependencies [[`fec4678`](https://github.com/near/near-api-js/commit/fec467887b4fc0895522ca37a77c1322244e6082), [`ff2f6ea`](https://github.com/near/near-api-js/commit/ff2f6ea2ac5cb7ba9e62626cd07bece2e57e5c63), [`af571dc`](https://github.com/near/near-api-js/commit/af571dc8428b5c99a1df2add13630713bf9259c9)]:
  - @near-js/crypto@2.1.0
  - @near-js/types@2.1.0
  - @near-js/utils@2.1.0

## 2.0.3

### Patch Changes

- Updated dependencies [[`7ee6e1d`](https://github.com/near/near-api-js/commit/7ee6e1dceb49fd841e54524ae2b129f390580068)]:
  - @near-js/crypto@2.0.3
  - @near-js/types@2.0.3
  - @near-js/utils@2.0.3

## 2.0.2

### Patch Changes

- [#1559](https://github.com/near/near-api-js/pull/1559) [`59d3dc9`](https://github.com/near/near-api-js/commit/59d3dc9580be05662cb9a587e82359faccd69d1b) Thanks [@r-near](https://github.com/r-near)! - fix: ESM Module Resolution

- Updated dependencies [[`59d3dc9`](https://github.com/near/near-api-js/commit/59d3dc9580be05662cb9a587e82359faccd69d1b)]:
  - @near-js/crypto@2.0.2
  - @near-js/types@2.0.2
  - @near-js/utils@2.0.2

## 2.0.1

### Patch Changes

- [#1554](https://github.com/near/near-api-js/pull/1554) [`13f93eb`](https://github.com/near/near-api-js/commit/13f93ebdac497bb473364da66a493344d955b27f) Thanks [@denbite](https://github.com/denbite)! - Redeploy recent release as patch

- Updated dependencies [[`13f93eb`](https://github.com/near/near-api-js/commit/13f93ebdac497bb473364da66a493344d955b27f)]:
  - @near-js/crypto@2.0.1
  - @near-js/types@2.0.1
  - @near-js/utils@2.0.1

## 2.0.0

### Major Changes

- [#1513](https://github.com/near/near-api-js/pull/1513) [`a8e1046`](https://github.com/near/near-api-js/commit/a8e1046d4c184700bed93229f81e7875fca11b27) Thanks [@denbite](https://github.com/denbite)! - Major update for Signer and Account APIs to streamline development

### Patch Changes

- Updated dependencies [[`a8e1046`](https://github.com/near/near-api-js/commit/a8e1046d4c184700bed93229f81e7875fca11b27)]:
  - @near-js/types@2.0.0
  - @near-js/crypto@2.0.0
  - @near-js/utils@2.0.0

## 1.3.3

### Patch Changes

- [#1495](https://github.com/near/near-api-js/pull/1495) [`9cb5f56`](https://github.com/near/near-api-js/commit/9cb5f5621364c370fb2321f6a22dbee146f0f368) Thanks [@AlexKushnir1](https://github.com/AlexKushnir1)! - client: The signer implementation was incorrectly handling transactions by not hashing the encoded transaction before signing

  transactions: Non trivial arguments given to the test so people could use them as an example.

## 1.3.2

### Patch Changes

- Updated dependencies [[`c85d12d3`](https://github.com/near/near-api-js/commit/c85d12d36b1d8cd9d02178506dcf9cf0598fe7a8)]:
  - @near-js/utils@1.1.0
  - @near-js/crypto@1.4.2
  - @near-js/signers@0.2.2

## 1.3.1

### Patch Changes

- Updated dependencies [[`5b0bbbc1`](https://github.com/near/near-api-js/commit/5b0bbbc17ffe7d89d7767e405d2ca700dc2bba40)]:
  - @near-js/crypto@1.4.1
  - @near-js/types@0.3.1
  - @near-js/utils@1.0.1
  - @near-js/signers@0.2.1

## 1.3.0

### Minor Changes

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
  - @near-js/crypto@1.4.0
  - @near-js/signers@0.2.0
  - @near-js/types@0.3.0
  - @near-js/utils@1.0.0

## 1.2.3

### Patch Changes

- [#1355](https://github.com/near/near-api-js/pull/1355) [`7d5a8244`](https://github.com/near/near-api-js/commit/7d5a8244a1683d7b5e82c4da1e40d834167a9a41) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Add Secp256k1 support

- Updated dependencies [[`bad95007`](https://github.com/near/near-api-js/commit/bad95007edde4ed9d5989ded7f2032b9f15f5c23), [`7d5a8244`](https://github.com/near/near-api-js/commit/7d5a8244a1683d7b5e82c4da1e40d834167a9a41)]:
  - @near-js/utils@0.3.0
  - @near-js/crypto@1.3.0
  - @near-js/signers@0.1.5

## 1.2.2

### Patch Changes

- Updated dependencies [[`ecdf1741`](https://github.com/near/near-api-js/commit/ecdf1741fb692e71202c541c5b3692790baa65f0), [`92a6f5be`](https://github.com/near/near-api-js/commit/92a6f5be3f4b7be6f3e9b55077025921c3aad2cb)]:
  - @near-js/types@0.2.1
  - @near-js/crypto@1.2.4
  - @near-js/utils@0.2.2
  - @near-js/signers@0.1.4

## 1.2.1

### Patch Changes

- Updated dependencies [[`06baa81d`](https://github.com/near/near-api-js/commit/06baa81dc604cfe0463476de7a4dcdd39a6f716a)]:
  - @near-js/types@0.2.0
  - @near-js/crypto@1.2.3
  - @near-js/utils@0.2.1
  - @near-js/signers@0.1.3

## 1.2.0

### Minor Changes

- [#1223](https://github.com/near/near-api-js/pull/1223) [`9060b781`](https://github.com/near/near-api-js/commit/9060b7811668d71bdf21170273a42842c3691f9b) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Replace bn.js by BigInt.

### Patch Changes

- Updated dependencies [[`9060b781`](https://github.com/near/near-api-js/commit/9060b7811668d71bdf21170273a42842c3691f9b)]:
  - @near-js/types@0.1.0
  - @near-js/utils@0.2.0
  - @near-js/crypto@1.2.2
  - @near-js/signers@0.1.2

## 1.1.2

### Patch Changes

- [#1314](https://github.com/near/near-api-js/pull/1314) [`42dc7e2a`](https://github.com/near/near-api-js/commit/42dc7e2ac794e973987bed7b89da5ef2d3c6c8ac) Thanks [@gagdiez](https://github.com/gagdiez)! - Fixed delegateAction Schema

## 1.1.1

### Patch Changes

- Updated dependencies [[`662cc13d`](https://github.com/near/near-api-js/commit/662cc13d7961c3bdabed3ad51b1c57958739a3e6), [`c4655576`](https://github.com/near/near-api-js/commit/c4655576bacb1d8b85030dca5b9443649621c8ee)]:
  - @near-js/utils@0.1.0
  - @near-js/crypto@1.2.1
  - @near-js/signers@0.1.1

## 1.1.0

### Minor Changes

- [#1224](https://github.com/near/near-api-js/pull/1224) [`1900c490`](https://github.com/near/near-api-js/commit/1900c49060c3ea8279448cead7347049a23f421f) Thanks [@gtsonevv](https://github.com/gtsonevv)! - remove buggy dependencies - replace js-sha256 with noble-hashes - replace elliptic with noble-curves - remove error-polyfill package

### Patch Changes

- Updated dependencies [[`1900c490`](https://github.com/near/near-api-js/commit/1900c49060c3ea8279448cead7347049a23f421f), [`c6cdc8c7`](https://github.com/near/near-api-js/commit/c6cdc8c724a6dd53114cc5f53fd58e57cea86b78)]:
  - @near-js/crypto@1.2.0
  - @near-js/signers@0.1.0

## 1.0.1

### Patch Changes

- Updated dependencies [[`aeeb1502`](https://github.com/near/near-api-js/commit/aeeb15022a1c1deb99114eba0473739b0998fc50)]:
  - @near-js/crypto@1.1.0
  - @near-js/signers@0.0.7

## 1.0.0

### Major Changes

- [#1168](https://github.com/near/near-api-js/pull/1168) [`61349aec`](https://github.com/near/near-api-js/commit/61349aeca3af830f702b24654e0f13cd428192d8) Thanks [@gagdiez](https://github.com/gagdiez)! - feat: updated borsh-js to v1.0.1

### Patch Changes

- Updated dependencies [[`695220e7`](https://github.com/near/near-api-js/commit/695220e75bc43834a7700cfc5491a7eebd324947), [`ecf29e2d`](https://github.com/near/near-api-js/commit/ecf29e2d56611a7773c79d5bb5bd20c8b7e738ea), [`61349aec`](https://github.com/near/near-api-js/commit/61349aeca3af830f702b24654e0f13cd428192d8), [`cdd8d1c8`](https://github.com/near/near-api-js/commit/cdd8d1c8c37db641bd995b2c470ad0b4fdddb93f)]:
  - @near-js/utils@0.0.5
  - @near-js/crypto@1.0.0
  - @near-js/signers@0.0.6

## 0.2.1

### Patch Changes

- Updated dependencies [[`40fa6465`](https://github.com/near/near-api-js/commit/40fa64654fdaf3b463122c35521a6f72282974f2)]:
  - @near-js/crypto@0.0.5
  - @near-js/signers@0.0.5

## 0.2.0

### Minor Changes

- [#1128](https://github.com/near/near-api-js/pull/1128) [`e21ff896`](https://github.com/near/near-api-js/commit/e21ff89601c858fb703169e3bb53c6d96cff5342) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Compatiblity shim for NearSocial/VM

### Patch Changes

- [#1110](https://github.com/near/near-api-js/pull/1110) [`00b4d2ba`](https://github.com/near/near-api-js/commit/00b4d2ba3f9f3a1f90343e34cb9bde8cdb607ceb) Thanks [@austinabell](https://github.com/austinabell)! - Update enum fields to all be optional

## 0.1.1

### Patch Changes

- Updated dependencies [[`bf81ddc1`](https://github.com/near/near-api-js/commit/bf81ddc11c958dece2244798bdfa6ab11e653940)]:
  - @near-js/types@0.0.4
  - @near-js/crypto@0.0.4
  - @near-js/utils@0.0.4
  - @near-js/signers@0.0.4

## 0.1.0

### Minor Changes

- [#1097](https://github.com/near/near-api-js/pull/1097) [`d97d2a6e`](https://github.com/near/near-api-js/commit/d97d2a6e891350cdea418da2af2b2971bdf0467e) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Add support for delegate actions and meta transactions

### Patch Changes

- Updated dependencies [[`b713ae78`](https://github.com/near/near-api-js/commit/b713ae78969d530e7e69e21e315e3d3fdb5e68e9), [`bc53c32c`](https://github.com/near/near-api-js/commit/bc53c32c80694e6f22d9be97db44603591f0026b), [`8c6bf391`](https://github.com/near/near-api-js/commit/8c6bf391a01af9adb81cb8731c45bdb17f5291c0)]:
  - @near-js/types@0.0.3
  - @near-js/crypto@0.0.3
  - @near-js/utils@0.0.3
  - @near-js/signers@0.0.3

## 0.0.2

### Patch Changes

- [#1091](https://github.com/near/near-api-js/pull/1091) [`ca458cac`](https://github.com/near/near-api-js/commit/ca458cac683fab614b77eb5daa160e03b0640350) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Only include contents of lib/ in NPM packages

- Updated dependencies [[`ca458cac`](https://github.com/near/near-api-js/commit/ca458cac683fab614b77eb5daa160e03b0640350)]:
  - @near-js/crypto@0.0.2
  - @near-js/signers@0.0.2
  - @near-js/types@0.0.2
  - @near-js/utils@0.0.2
