# @near-js/providers

## 2.3.3

### Patch Changes

- [#1637](https://github.com/near/near-api-js/pull/1637) [`1a89d12`](https://github.com/near/near-api-js/commit/1a89d12dd74c9100058f6a7d6238a14a3bea4be4) Thanks [@gagdiez](https://github.com/gagdiez)! - Using optimistic finality by default in providers

- Updated dependencies []:
  - @near-js/crypto@2.3.3
  - @near-js/transactions@2.3.3
  - @near-js/types@2.3.3
  - @near-js/utils@2.3.3

## 2.3.2

### Patch Changes

- Updated dependencies []:
  - @near-js/crypto@2.3.2
  - @near-js/transactions@2.3.2
  - @near-js/types@2.3.2
  - @near-js/utils@2.3.2

## 2.3.1

### Patch Changes

- Updated dependencies []:
  - @near-js/crypto@2.3.1
  - @near-js/transactions@2.3.1
  - @near-js/types@2.3.1
  - @near-js/utils@2.3.1

## 2.3.0

### Patch Changes

- Updated dependencies [[`0a99da4`](https://github.com/near/near-api-js/commit/0a99da4d40cb2308833d8372f153562b64aa6ceb)]:
  - @near-js/types@2.3.0
  - @near-js/utils@2.3.0
  - @near-js/crypto@2.3.0
  - @near-js/transactions@2.3.0

## 2.2.6

### Patch Changes

- Updated dependencies []:
  - @near-js/crypto@2.2.6
  - @near-js/transactions@2.2.6
  - @near-js/types@2.2.6
  - @near-js/utils@2.2.6

## 2.2.5

### Patch Changes

- [#1613](https://github.com/near/near-api-js/pull/1613) [`b78f334`](https://github.com/near/near-api-js/commit/b78f3343a2d338c01b81c232a67e80dd6ccef6c0) Thanks [@denbite](https://github.com/denbite)! - Provide default value `{}` for headers as `connection.headers` could be `undefined` in some cases

- [#1613](https://github.com/near/near-api-js/pull/1613) [`e8a01e9`](https://github.com/near/near-api-js/commit/e8a01e998c465df1bb1bda4b3967a6e597f85cad) Thanks [@denbite](https://github.com/denbite)! - Update interfaces of `JsonRpcProvider` and `FailoverRpcProvider` to be aligned with `Provider`

- [#1613](https://github.com/near/near-api-js/pull/1613) [`d399fe5`](https://github.com/near/near-api-js/commit/d399fe561cbeabe09c9877f23b47b57a16896f41) Thanks [@denbite](https://github.com/denbite)! - Make parameter type of function `Provider.gasPrice` nullable (to be aligned with actual implemention in `JsonRpcProvider`)

- Updated dependencies []:
  - @near-js/crypto@2.2.5
  - @near-js/transactions@2.2.5
  - @near-js/types@2.2.5
  - @near-js/utils@2.2.5

## 2.2.4

### Patch Changes

- Updated dependencies [[`30403a7`](https://github.com/near/near-api-js/commit/30403a7840a119f08cd6372f7bdc18017572d810)]:
  - @near-js/transactions@2.2.4
  - @near-js/crypto@2.2.4
  - @near-js/types@2.2.4
  - @near-js/utils@2.2.4

## 2.2.3

### Patch Changes

- [#1604](https://github.com/near/near-api-js/pull/1604) [`edcadb6`](https://github.com/near/near-api-js/commit/edcadb6e3125ab16a85032de27feb60d0a3307f5) Thanks [@denbite](https://github.com/denbite)! - Added generic type for `Provider.callFunction` to allow client explicitly specify expected return type

- Updated dependencies []:
  - @near-js/crypto@2.2.3
  - @near-js/transactions@2.2.3
  - @near-js/types@2.2.3
  - @near-js/utils@2.2.3

## 2.2.2

### Patch Changes

- Updated dependencies []:
  - @near-js/crypto@2.2.2
  - @near-js/transactions@2.2.2
  - @near-js/types@2.2.2
  - @near-js/utils@2.2.2

## 2.2.1

### Patch Changes

- Updated dependencies [[`f65647f`](https://github.com/near/near-api-js/commit/f65647f6f3e3f5dc18a7d6f24cbeba255ee8476a)]:
  - @near-js/transactions@2.2.1
  - @near-js/crypto@2.2.1
  - @near-js/types@2.2.1
  - @near-js/utils@2.2.1

## 2.2.0

### Patch Changes

- Updated dependencies []:
  - @near-js/crypto@2.2.0
  - @near-js/transactions@2.2.0
  - @near-js/types@2.2.0
  - @near-js/utils@2.2.0

## 2.1.0

### Minor Changes

- [#1586](https://github.com/near/near-api-js/pull/1586) [`fec4678`](https://github.com/near/near-api-js/commit/fec467887b4fc0895522ca37a77c1322244e6082) Thanks [@denbite](https://github.com/denbite)! - Mark `@near-js/*` packages as side-effect free for tree-shaking

### Patch Changes

- [#1581](https://github.com/near/near-api-js/pull/1581) [`ff2f6ea`](https://github.com/near/near-api-js/commit/ff2f6ea2ac5cb7ba9e62626cd07bece2e57e5c63) Thanks [@r-near](https://github.com/r-near)! - Remove unused build package and clean up workspace dependencies. The build package contained an unused cjsify utility that was replaced by tsup for CommonJS output generation.

- Updated dependencies [[`fec4678`](https://github.com/near/near-api-js/commit/fec467887b4fc0895522ca37a77c1322244e6082), [`ff2f6ea`](https://github.com/near/near-api-js/commit/ff2f6ea2ac5cb7ba9e62626cd07bece2e57e5c63), [`c511649`](https://github.com/near/near-api-js/commit/c511649536035f3fe78b8c14907dc814dfb1a310), [`99f3486`](https://github.com/near/near-api-js/commit/99f34864317725467a097dc3c7a3cc5f7a5b43d4), [`af571dc`](https://github.com/near/near-api-js/commit/af571dc8428b5c99a1df2add13630713bf9259c9)]:
  - @near-js/transactions@2.1.0
  - @near-js/crypto@2.1.0
  - @near-js/types@2.1.0
  - @near-js/utils@2.1.0

## 2.0.3

### Patch Changes

- [#1573](https://github.com/near/near-api-js/pull/1573) [`7ee6e1d`](https://github.com/near/near-api-js/commit/7ee6e1dceb49fd841e54524ae2b129f390580068) Thanks [@r-near](https://github.com/r-near)! - fix: separate runtime and type exports for esbuild compatibility

- Updated dependencies [[`7ee6e1d`](https://github.com/near/near-api-js/commit/7ee6e1dceb49fd841e54524ae2b129f390580068)]:
  - @near-js/crypto@2.0.3
  - @near-js/types@2.0.3
  - @near-js/transactions@2.0.3
  - @near-js/utils@2.0.3

## 2.0.2

### Patch Changes

- [#1559](https://github.com/near/near-api-js/pull/1559) [`59d3dc9`](https://github.com/near/near-api-js/commit/59d3dc9580be05662cb9a587e82359faccd69d1b) Thanks [@r-near](https://github.com/r-near)! - fix: ESM Module Resolution

- Updated dependencies [[`59d3dc9`](https://github.com/near/near-api-js/commit/59d3dc9580be05662cb9a587e82359faccd69d1b)]:
  - @near-js/crypto@2.0.2
  - @near-js/transactions@2.0.2
  - @near-js/types@2.0.2
  - @near-js/utils@2.0.2

## 2.0.1

### Patch Changes

- [#1554](https://github.com/near/near-api-js/pull/1554) [`13f93eb`](https://github.com/near/near-api-js/commit/13f93ebdac497bb473364da66a493344d955b27f) Thanks [@denbite](https://github.com/denbite)! - Redeploy recent release as patch

- Updated dependencies [[`13f93eb`](https://github.com/near/near-api-js/commit/13f93ebdac497bb473364da66a493344d955b27f)]:
  - @near-js/crypto@2.0.1
  - @near-js/transactions@2.0.1
  - @near-js/types@2.0.1
  - @near-js/utils@2.0.1

## 2.0.0

### Major Changes

In this major release we have tried to cover all existing RPC methods, including the new:

- `callFunction`
- `viewAccessKey`
- `viewAccessKeyList`
- `viewContractCode`
- `viewContractState`
- `getNetworkId`
- ... etc

This way, users now will have access to most of the RPC methods available in NEAR. We also added two useful functions for validators, namely:

- `getCurrentEpochSeatPrice`
- `getNextEpochSeatPrice`

- [#1513](https://github.com/near/near-api-js/pull/1513) [`a8e1046`](https://github.com/near/near-api-js/commit/a8e1046d4c184700bed93229f81e7875fca11b27) Thanks [@denbite](https://github.com/denbite)! - Major update for Signer and Account APIs to streamline development

### Patch Changes

- Updated dependencies [[`a8e1046`](https://github.com/near/near-api-js/commit/a8e1046d4c184700bed93229f81e7875fca11b27)]:
  - @near-js/transactions@2.0.0
  - @near-js/types@2.0.0
  - @near-js/crypto@2.0.0
  - @near-js/utils@2.0.0

## 1.0.3

### Patch Changes

- [#1467](https://github.com/near/near-api-js/pull/1467) [`e408cfc`](https://github.com/near/near-api-js/commit/e408cfc4b4be4ea82e1e34314d9ee92885d03253) Thanks [@dependabot](https://github.com/apps/dependabot)! - build(deps): bump exponential-backoff from 3.1.1 to 3.1.2

- Updated dependencies [[`9cb5f56`](https://github.com/near/near-api-js/commit/9cb5f5621364c370fb2321f6a22dbee146f0f368)]:
  - @near-js/transactions@1.3.3

## 1.0.2

### Patch Changes

- [#1450](https://github.com/near/near-api-js/pull/1450) [`ef530cf6`](https://github.com/near/near-api-js/commit/ef530cf62b0ed0d7eb2a77482c4d908449a863c2) Thanks [@talentlessguy](https://github.com/talentlessguy)! - drop unfetch polyfill

- Updated dependencies [[`c85d12d3`](https://github.com/near/near-api-js/commit/c85d12d36b1d8cd9d02178506dcf9cf0598fe7a8)]:
  - @near-js/utils@1.1.0
  - @near-js/transactions@1.3.2

## 1.0.1

### Patch Changes

- [#1401](https://github.com/near/near-api-js/pull/1401) [`5b0bbbc1`](https://github.com/near/near-api-js/commit/5b0bbbc17ffe7d89d7767e405d2ca700dc2bba40) Thanks [@andy-haynes](https://github.com/andy-haynes)! - @near-js/client package

- Updated dependencies [[`5b0bbbc1`](https://github.com/near/near-api-js/commit/5b0bbbc17ffe7d89d7767e405d2ca700dc2bba40)]:
  - @near-js/types@0.3.1
  - @near-js/utils@1.0.1
  - @near-js/transactions@1.3.1

## 1.0.0

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
  - @near-js/transactions@1.3.0
  - @near-js/types@0.3.0
  - @near-js/utils@1.0.0

## 0.2.3

### Patch Changes

- Updated dependencies [[`bad95007`](https://github.com/near/near-api-js/commit/bad95007edde4ed9d5989ded7f2032b9f15f5c23), [`7d5a8244`](https://github.com/near/near-api-js/commit/7d5a8244a1683d7b5e82c4da1e40d834167a9a41)]:
  - @near-js/utils@0.3.0
  - @near-js/transactions@1.2.3

## 0.2.2

### Patch Changes

- [#1349](https://github.com/near/near-api-js/pull/1349) [`ecdf1741`](https://github.com/near/near-api-js/commit/ecdf1741fb692e71202c541c5b3692790baa65f0) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Fix TxExecutionStatus import.

- [#1347](https://github.com/near/near-api-js/pull/1347) [`92a6f5be`](https://github.com/near/near-api-js/commit/92a6f5be3f4b7be6f3e9b55077025921c3aad2cb) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Update tx execution status default value.

- Updated dependencies [[`ecdf1741`](https://github.com/near/near-api-js/commit/ecdf1741fb692e71202c541c5b3692790baa65f0), [`92a6f5be`](https://github.com/near/near-api-js/commit/92a6f5be3f4b7be6f3e9b55077025921c3aad2cb)]:
  - @near-js/types@0.2.1
  - @near-js/transactions@1.2.2
  - @near-js/utils@0.2.2

## 0.2.1

### Patch Changes

- Updated dependencies [[`06baa81d`](https://github.com/near/near-api-js/commit/06baa81dc604cfe0463476de7a4dcdd39a6f716a)]:
  - @near-js/types@0.2.0
  - @near-js/transactions@1.2.1
  - @near-js/utils@0.2.1

## 0.2.0

### Minor Changes

- [#1334](https://github.com/near/near-api-js/pull/1334) [`3f363113`](https://github.com/near/near-api-js/commit/3f363113e102d0acf29b7b2635acf6160a028cc3) Thanks [@denbite](https://github.com/denbite)! - Introduce FailoverRpcProvider that switches between providers in case of a failure of one of them

### Patch Changes

- [#1223](https://github.com/near/near-api-js/pull/1223) [`9060b781`](https://github.com/near/near-api-js/commit/9060b7811668d71bdf21170273a42842c3691f9b) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Replace bn.js by BigInt.

- Updated dependencies [[`9060b781`](https://github.com/near/near-api-js/commit/9060b7811668d71bdf21170273a42842c3691f9b)]:
  - @near-js/transactions@1.2.0
  - @near-js/types@0.1.0
  - @near-js/utils@0.2.0

## 0.1.1

### Patch Changes

- Updated dependencies [[`42dc7e2a`](https://github.com/near/near-api-js/commit/42dc7e2ac794e973987bed7b89da5ef2d3c6c8ac)]:
  - @near-js/transactions@1.1.2

## 0.1.0

### Minor Changes

- [#1275](https://github.com/near/near-api-js/pull/1275) [`662cc13d`](https://github.com/near/near-api-js/commit/662cc13d7961c3bdabed3ad51b1c57958739a3e6) Thanks [@denbite](https://github.com/denbite)! - Display user-friendly messages for JSON RPC errors:

  - MethodNotFound
  - CodeDoesNotExist
  - AccessKeyDoesNotExist
  - AccountDoesNotExist

### Patch Changes

- Updated dependencies [[`662cc13d`](https://github.com/near/near-api-js/commit/662cc13d7961c3bdabed3ad51b1c57958739a3e6)]:
  - @near-js/utils@0.1.0
  - @near-js/transactions@1.1.1

## 0.0.10

### Patch Changes

- Updated dependencies [[`1900c490`](https://github.com/near/near-api-js/commit/1900c49060c3ea8279448cead7347049a23f421f)]:
  - @near-js/transactions@1.1.0

## 0.0.9

### Patch Changes

- Updated dependencies []:
  - @near-js/transactions@1.0.1

## 0.0.8

### Patch Changes

- [#1195](https://github.com/near/near-api-js/pull/1195) [`695220e7`](https://github.com/near/near-api-js/commit/695220e75bc43834a7700cfc5491a7eebd324947) Thanks [@ShaunSHamilton](https://github.com/ShaunSHamilton)! - add check for global 'process' object

- [#1205](https://github.com/near/near-api-js/pull/1205) [`0be6c420`](https://github.com/near/near-api-js/commit/0be6c4209f56c0595bf66e217b7ac01444981b99) Thanks [@denbite](https://github.com/denbite)! - retry RPC request on 408 HTTP error

- [#1215](https://github.com/near/near-api-js/pull/1215) [`ecf29e2d`](https://github.com/near/near-api-js/commit/ecf29e2d56611a7773c79d5bb5bd20c8b7e738ea) Thanks [@denbite](https://github.com/denbite)! - Internal logging library with capabilities for integration with modern logging libraries like Pino, Winston, etc

- [#1209](https://github.com/near/near-api-js/pull/1209) [`cdd8d1c8`](https://github.com/near/near-api-js/commit/cdd8d1c8c37db641bd995b2c470ad0b4fdddb93f) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Replace tweetnacl by @noble/curves

- [#1194](https://github.com/near/near-api-js/pull/1194) [`038b9b9f`](https://github.com/near/near-api-js/commit/038b9b9fd57f73e537041d4b90ed07bf3cd811d9) Thanks [@andrew-scott-fischer](https://github.com/andrew-scott-fischer)! - fixes override of global fetch property

- Updated dependencies [[`695220e7`](https://github.com/near/near-api-js/commit/695220e75bc43834a7700cfc5491a7eebd324947), [`ecf29e2d`](https://github.com/near/near-api-js/commit/ecf29e2d56611a7773c79d5bb5bd20c8b7e738ea), [`61349aec`](https://github.com/near/near-api-js/commit/61349aeca3af830f702b24654e0f13cd428192d8)]:
  - @near-js/utils@0.0.5
  - @near-js/transactions@1.0.0

## 0.0.7

### Patch Changes

- Updated dependencies []:
  - @near-js/transactions@0.2.1

## 0.0.6

### Patch Changes

- Updated dependencies [[`e21ff896`](https://github.com/near/near-api-js/commit/e21ff89601c858fb703169e3bb53c6d96cff5342), [`00b4d2ba`](https://github.com/near/near-api-js/commit/00b4d2ba3f9f3a1f90343e34cb9bde8cdb607ceb)]:
  - @near-js/transactions@0.2.0

## 0.0.5

### Patch Changes

- Updated dependencies [[`bf81ddc1`](https://github.com/near/near-api-js/commit/bf81ddc11c958dece2244798bdfa6ab11e653940)]:
  - @near-js/types@0.0.4
  - @near-js/transactions@0.1.1
  - @near-js/utils@0.0.4

## 0.0.4

### Patch Changes

- [#1111](https://github.com/near/near-api-js/pull/1111) [`d6d53ab1`](https://github.com/near/near-api-js/commit/d6d53ab1b90e3d4041080dd4a6e22d24900c1ca5) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Only fall back on `node-fetch` when global.fetch is `undefined`

## 0.0.3

### Patch Changes

- [#1103](https://github.com/near/near-api-js/pull/1103) [`b713ae78`](https://github.com/near/near-api-js/commit/b713ae78969d530e7e69e21e315e3d3fdb5e68e9) Thanks [@austinabell](https://github.com/austinabell)! - Implement light client block retrieval and relevant types

- [#1097](https://github.com/near/near-api-js/pull/1097) [`d97d2a6e`](https://github.com/near/near-api-js/commit/d97d2a6e891350cdea418da2af2b2971bdf0467e) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Add support for delegate actions and meta transactions

- [#1071](https://github.com/near/near-api-js/pull/1071) [`4704ee77`](https://github.com/near/near-api-js/commit/4704ee7717d9e92e7729037368e7ace84a9c7f1c) Thanks [@kiskesis](https://github.com/kiskesis)! - Fix Provider.validators method signature to accept a `null` argument

- Updated dependencies [[`b713ae78`](https://github.com/near/near-api-js/commit/b713ae78969d530e7e69e21e315e3d3fdb5e68e9), [`bc53c32c`](https://github.com/near/near-api-js/commit/bc53c32c80694e6f22d9be97db44603591f0026b), [`d97d2a6e`](https://github.com/near/near-api-js/commit/d97d2a6e891350cdea418da2af2b2971bdf0467e), [`8c6bf391`](https://github.com/near/near-api-js/commit/8c6bf391a01af9adb81cb8731c45bdb17f5291c0)]:
  - @near-js/types@0.0.3
  - @near-js/transactions@0.1.0
  - @near-js/utils@0.0.3

## 0.0.2

### Patch Changes

- [#1091](https://github.com/near/near-api-js/pull/1091) [`ca458cac`](https://github.com/near/near-api-js/commit/ca458cac683fab614b77eb5daa160e03b0640350) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Only include contents of lib/ in NPM packages

- Updated dependencies [[`ca458cac`](https://github.com/near/near-api-js/commit/ca458cac683fab614b77eb5daa160e03b0640350)]:
  - @near-js/transactions@0.0.2
  - @near-js/types@0.0.2
  - @near-js/utils@0.0.2
