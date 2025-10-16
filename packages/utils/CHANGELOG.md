# @near-js/utils

## 2.3.4

### Patch Changes

- Updated dependencies []:
  - @near-js/types@2.3.4

## 2.3.3

### Patch Changes

- Updated dependencies []:
  - @near-js/types@2.3.3

## 2.3.2

### Patch Changes

- Updated dependencies []:
  - @near-js/types@2.3.2

## 2.3.1

### Patch Changes

- Updated dependencies []:
  - @near-js/types@2.3.1

## 2.3.0

### Patch Changes

- [#1621](https://github.com/near/near-api-js/pull/1621) [`0a99da4`](https://github.com/near/near-api-js/commit/0a99da4d40cb2308833d8372f153562b64aa6ceb) Thanks [@denbite](https://github.com/denbite)! - Add deprecation annotations and warnings to functions/classes that will be removed in the next major release

- Updated dependencies [[`0a99da4`](https://github.com/near/near-api-js/commit/0a99da4d40cb2308833d8372f153562b64aa6ceb)]:
  - @near-js/types@2.3.0

## 2.2.6

### Patch Changes

- Updated dependencies []:
  - @near-js/types@2.2.6

## 2.2.5

### Patch Changes

- Updated dependencies []:
  - @near-js/types@2.2.5

## 2.2.4

### Patch Changes

- Updated dependencies []:
  - @near-js/types@2.2.4

## 2.2.3

### Patch Changes

- Updated dependencies []:
  - @near-js/types@2.2.3

## 2.2.2

### Patch Changes

- Updated dependencies []:
  - @near-js/types@2.2.2

## 2.2.1

### Patch Changes

- Updated dependencies []:
  - @near-js/types@2.2.1

## 2.2.0

### Patch Changes

- Updated dependencies []:
  - @near-js/types@2.2.0

## 2.1.0

### Minor Changes

- [#1586](https://github.com/near/near-api-js/pull/1586) [`fec4678`](https://github.com/near/near-api-js/commit/fec467887b4fc0895522ca37a77c1322244e6082) Thanks [@denbite](https://github.com/denbite)! - Mark `@near-js/*` packages as side-effect free for tree-shaking

### Patch Changes

- [#1581](https://github.com/near/near-api-js/pull/1581) [`ff2f6ea`](https://github.com/near/near-api-js/commit/ff2f6ea2ac5cb7ba9e62626cd07bece2e57e5c63) Thanks [@r-near](https://github.com/r-near)! - Remove unused build package and clean up workspace dependencies. The build package contained an unused cjsify utility that was replaced by tsup for CommonJS output generation.

- [#1584](https://github.com/near/near-api-js/pull/1584) [`af571dc`](https://github.com/near/near-api-js/commit/af571dc8428b5c99a1df2add13630713bf9259c9) Thanks [@denbite](https://github.com/denbite)! - Fix import issues

- Updated dependencies [[`fec4678`](https://github.com/near/near-api-js/commit/fec467887b4fc0895522ca37a77c1322244e6082), [`ff2f6ea`](https://github.com/near/near-api-js/commit/ff2f6ea2ac5cb7ba9e62626cd07bece2e57e5c63)]:
  - @near-js/types@2.1.0

## 2.0.3

### Patch Changes

- Updated dependencies [[`7ee6e1d`](https://github.com/near/near-api-js/commit/7ee6e1dceb49fd841e54524ae2b129f390580068)]:
  - @near-js/types@2.0.3

## 2.0.2

### Patch Changes

- Updated dependencies [[`59d3dc9`](https://github.com/near/near-api-js/commit/59d3dc9580be05662cb9a587e82359faccd69d1b)]:
  - @near-js/types@2.0.2

## 2.0.1

### Patch Changes

- [#1554](https://github.com/near/near-api-js/pull/1554) [`13f93eb`](https://github.com/near/near-api-js/commit/13f93ebdac497bb473364da66a493344d955b27f) Thanks [@denbite](https://github.com/denbite)! - Redeploy recent release as patch

- Updated dependencies [[`13f93eb`](https://github.com/near/near-api-js/commit/13f93ebdac497bb473364da66a493344d955b27f)]:
  - @near-js/types@2.0.1

## 2.0.0

### Patch Changes

- Updated dependencies [[`a8e1046`](https://github.com/near/near-api-js/commit/a8e1046d4c184700bed93229f81e7875fca11b27)]:
  - @near-js/types@2.0.0

## 1.1.0

### Minor Changes

- [#1433](https://github.com/near/near-api-js/pull/1433) [`c85d12d3`](https://github.com/near/near-api-js/commit/c85d12d36b1d8cd9d02178506dcf9cf0598fe7a8) Thanks [@r-near](https://github.com/r-near)! - Update base58 dependency

## 1.0.1

### Patch Changes

- [#1401](https://github.com/near/near-api-js/pull/1401) [`5b0bbbc1`](https://github.com/near/near-api-js/commit/5b0bbbc17ffe7d89d7767e405d2ca700dc2bba40) Thanks [@andy-haynes](https://github.com/andy-haynes)! - @near-js/client package

- Updated dependencies [[`5b0bbbc1`](https://github.com/near/near-api-js/commit/5b0bbbc17ffe7d89d7767e405d2ca700dc2bba40)]:
  - @near-js/types@0.3.1

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
  - @near-js/types@0.3.0

## 0.3.0

### Minor Changes

- [#1363](https://github.com/near/near-api-js/pull/1363) [`bad95007`](https://github.com/near/near-api-js/commit/bad95007edde4ed9d5989ded7f2032b9f15f5c23) Thanks [@jakmeier](https://github.com/jakmeier)! - New transaction submission errors: ShardCongested, ShardStuck, ReceiptSizeExceeded

## 0.2.2

### Patch Changes

- Updated dependencies [[`ecdf1741`](https://github.com/near/near-api-js/commit/ecdf1741fb692e71202c541c5b3692790baa65f0), [`92a6f5be`](https://github.com/near/near-api-js/commit/92a6f5be3f4b7be6f3e9b55077025921c3aad2cb)]:
  - @near-js/types@0.2.1

## 0.2.1

### Patch Changes

- Updated dependencies [[`06baa81d`](https://github.com/near/near-api-js/commit/06baa81dc604cfe0463476de7a4dcdd39a6f716a)]:
  - @near-js/types@0.2.0

## 0.2.0

### Minor Changes

- [#1223](https://github.com/near/near-api-js/pull/1223) [`9060b781`](https://github.com/near/near-api-js/commit/9060b7811668d71bdf21170273a42842c3691f9b) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Replace bn.js by BigInt.

### Patch Changes

- Updated dependencies [[`9060b781`](https://github.com/near/near-api-js/commit/9060b7811668d71bdf21170273a42842c3691f9b)]:
  - @near-js/types@0.1.0

## 0.1.0

### Minor Changes

- [#1275](https://github.com/near/near-api-js/pull/1275) [`662cc13d`](https://github.com/near/near-api-js/commit/662cc13d7961c3bdabed3ad51b1c57958739a3e6) Thanks [@denbite](https://github.com/denbite)! - Display user-friendly messages for JSON RPC errors:

  - MethodNotFound
  - CodeDoesNotExist
  - AccessKeyDoesNotExist
  - AccountDoesNotExist

## 0.0.5

### Patch Changes

- [#1195](https://github.com/near/near-api-js/pull/1195) [`695220e7`](https://github.com/near/near-api-js/commit/695220e75bc43834a7700cfc5491a7eebd324947) Thanks [@ShaunSHamilton](https://github.com/ShaunSHamilton)! - add check for global 'process' object

- [#1215](https://github.com/near/near-api-js/pull/1215) [`ecf29e2d`](https://github.com/near/near-api-js/commit/ecf29e2d56611a7773c79d5bb5bd20c8b7e738ea) Thanks [@denbite](https://github.com/denbite)! - Internal logging library with capabilities for integration with modern logging libraries like Pino, Winston, etc

## 0.0.4

### Patch Changes

- Updated dependencies [[`bf81ddc1`](https://github.com/near/near-api-js/commit/bf81ddc11c958dece2244798bdfa6ab11e653940)]:
  - @near-js/types@0.0.4

## 0.0.3

### Patch Changes

- Updated dependencies [[`b713ae78`](https://github.com/near/near-api-js/commit/b713ae78969d530e7e69e21e315e3d3fdb5e68e9), [`bc53c32c`](https://github.com/near/near-api-js/commit/bc53c32c80694e6f22d9be97db44603591f0026b), [`8c6bf391`](https://github.com/near/near-api-js/commit/8c6bf391a01af9adb81cb8731c45bdb17f5291c0)]:
  - @near-js/types@0.0.3

## 0.0.2

### Patch Changes

- [#1091](https://github.com/near/near-api-js/pull/1091) [`ca458cac`](https://github.com/near/near-api-js/commit/ca458cac683fab614b77eb5daa160e03b0640350) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Only include contents of lib/ in NPM packages

- Updated dependencies [[`ca458cac`](https://github.com/near/near-api-js/commit/ca458cac683fab614b77eb5daa160e03b0640350)]:
  - @near-js/types@0.0.2
