# @near-js/crypto

## 2.2.4

### Patch Changes

- Updated dependencies []:
  - @near-js/types@2.2.4
  - @near-js/utils@2.2.4

## 2.2.3

### Patch Changes

- Updated dependencies []:
  - @near-js/types@2.2.3
  - @near-js/utils@2.2.3

## 2.2.2

### Patch Changes

- Updated dependencies []:
  - @near-js/types@2.2.2
  - @near-js/utils@2.2.2

## 2.2.1

### Patch Changes

- Updated dependencies []:
  - @near-js/types@2.2.1
  - @near-js/utils@2.2.1

## 2.2.0

### Patch Changes

- Updated dependencies []:
  - @near-js/types@2.2.0
  - @near-js/utils@2.2.0

## 2.1.0

### Minor Changes

- [#1586](https://github.com/near/near-api-js/pull/1586) [`fec4678`](https://github.com/near/near-api-js/commit/fec467887b4fc0895522ca37a77c1322244e6082) Thanks [@denbite](https://github.com/denbite)! - Mark `@near-js/*` packages as side-effect free for tree-shaking

### Patch Changes

- [#1581](https://github.com/near/near-api-js/pull/1581) [`ff2f6ea`](https://github.com/near/near-api-js/commit/ff2f6ea2ac5cb7ba9e62626cd07bece2e57e5c63) Thanks [@r-near](https://github.com/r-near)! - Remove unused build package and clean up workspace dependencies. The build package contained an unused cjsify utility that was replaced by tsup for CommonJS output generation.

- Updated dependencies [[`fec4678`](https://github.com/near/near-api-js/commit/fec467887b4fc0895522ca37a77c1322244e6082), [`ff2f6ea`](https://github.com/near/near-api-js/commit/ff2f6ea2ac5cb7ba9e62626cd07bece2e57e5c63), [`af571dc`](https://github.com/near/near-api-js/commit/af571dc8428b5c99a1df2add13630713bf9259c9)]:
  - @near-js/types@2.1.0
  - @near-js/utils@2.1.0

## 2.0.3

### Patch Changes

- [#1573](https://github.com/near/near-api-js/pull/1573) [`7ee6e1d`](https://github.com/near/near-api-js/commit/7ee6e1dceb49fd841e54524ae2b129f390580068) Thanks [@r-near](https://github.com/r-near)! - fix: separate runtime and type exports for esbuild compatibility

- Updated dependencies [[`7ee6e1d`](https://github.com/near/near-api-js/commit/7ee6e1dceb49fd841e54524ae2b129f390580068)]:
  - @near-js/types@2.0.3
  - @near-js/utils@2.0.3

## 2.0.2

### Patch Changes

- [#1559](https://github.com/near/near-api-js/pull/1559) [`59d3dc9`](https://github.com/near/near-api-js/commit/59d3dc9580be05662cb9a587e82359faccd69d1b) Thanks [@r-near](https://github.com/r-near)! - fix: ESM Module Resolution

- Updated dependencies [[`59d3dc9`](https://github.com/near/near-api-js/commit/59d3dc9580be05662cb9a587e82359faccd69d1b)]:
  - @near-js/types@2.0.2
  - @near-js/utils@2.0.2

## 2.0.1

### Patch Changes

- [#1554](https://github.com/near/near-api-js/pull/1554) [`13f93eb`](https://github.com/near/near-api-js/commit/13f93ebdac497bb473364da66a493344d955b27f) Thanks [@denbite](https://github.com/denbite)! - Redeploy recent release as patch

- Updated dependencies [[`13f93eb`](https://github.com/near/near-api-js/commit/13f93ebdac497bb473364da66a493344d955b27f)]:
  - @near-js/types@2.0.1
  - @near-js/utils@2.0.1

## 2.0.0

### Patch Changes

- Updated dependencies [[`a8e1046`](https://github.com/near/near-api-js/commit/a8e1046d4c184700bed93229f81e7875fca11b27)]:
  - @near-js/types@2.0.0
  - @near-js/utils@2.0.0

## 1.4.2

### Patch Changes

- Updated dependencies [[`c85d12d3`](https://github.com/near/near-api-js/commit/c85d12d36b1d8cd9d02178506dcf9cf0598fe7a8)]:
  - @near-js/utils@1.1.0

## 1.4.1

### Patch Changes

- [#1401](https://github.com/near/near-api-js/pull/1401) [`5b0bbbc1`](https://github.com/near/near-api-js/commit/5b0bbbc17ffe7d89d7767e405d2ca700dc2bba40) Thanks [@andy-haynes](https://github.com/andy-haynes)! - @near-js/client package

- Updated dependencies [[`5b0bbbc1`](https://github.com/near/near-api-js/commit/5b0bbbc17ffe7d89d7767e405d2ca700dc2bba40)]:
  - @near-js/types@0.3.1
  - @near-js/utils@1.0.1

## 1.4.0

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
  - @near-js/types@0.3.0
  - @near-js/utils@1.0.0

## 1.3.0

### Minor Changes

- [#1355](https://github.com/near/near-api-js/pull/1355) [`7d5a8244`](https://github.com/near/near-api-js/commit/7d5a8244a1683d7b5e82c4da1e40d834167a9a41) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Add Secp256k1 support

### Patch Changes

- Updated dependencies [[`bad95007`](https://github.com/near/near-api-js/commit/bad95007edde4ed9d5989ded7f2032b9f15f5c23)]:
  - @near-js/utils@0.3.0

## 1.2.4

### Patch Changes

- Updated dependencies [[`ecdf1741`](https://github.com/near/near-api-js/commit/ecdf1741fb692e71202c541c5b3692790baa65f0), [`92a6f5be`](https://github.com/near/near-api-js/commit/92a6f5be3f4b7be6f3e9b55077025921c3aad2cb)]:
  - @near-js/types@0.2.1
  - @near-js/utils@0.2.2

## 1.2.3

### Patch Changes

- Updated dependencies [[`06baa81d`](https://github.com/near/near-api-js/commit/06baa81dc604cfe0463476de7a4dcdd39a6f716a)]:
  - @near-js/types@0.2.0
  - @near-js/utils@0.2.1

## 1.2.2

### Patch Changes

- [#1223](https://github.com/near/near-api-js/pull/1223) [`9060b781`](https://github.com/near/near-api-js/commit/9060b7811668d71bdf21170273a42842c3691f9b) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Replace bn.js by BigInt.

- Updated dependencies [[`9060b781`](https://github.com/near/near-api-js/commit/9060b7811668d71bdf21170273a42842c3691f9b)]:
  - @near-js/types@0.1.0
  - @near-js/utils@0.2.0

## 1.2.1

### Patch Changes

- [#1298](https://github.com/near/near-api-js/pull/1298) [`c4655576`](https://github.com/near/near-api-js/commit/c4655576bacb1d8b85030dca5b9443649621c8ee) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Pass Uint8Array to getPublicKey method.

- Updated dependencies [[`662cc13d`](https://github.com/near/near-api-js/commit/662cc13d7961c3bdabed3ad51b1c57958739a3e6)]:
  - @near-js/utils@0.1.0

## 1.2.0

### Minor Changes

- [#1224](https://github.com/near/near-api-js/pull/1224) [`1900c490`](https://github.com/near/near-api-js/commit/1900c49060c3ea8279448cead7347049a23f421f) Thanks [@gtsonevv](https://github.com/gtsonevv)! - remove buggy dependencies - replace js-sha256 with noble-hashes - replace elliptic with noble-curves - remove error-polyfill package

- [#1222](https://github.com/near/near-api-js/pull/1222) [`c6cdc8c7`](https://github.com/near/near-api-js/commit/c6cdc8c724a6dd53114cc5f53fd58e57cea86b78) Thanks [@vikinatora](https://github.com/vikinatora)! - replaced crypto-browserify with randombytes

## 1.1.0

### Minor Changes

- [#1219](https://github.com/near/near-api-js/pull/1219) [`aeeb1502`](https://github.com/near/near-api-js/commit/aeeb15022a1c1deb99114eba0473739b0998fc50) Thanks [@gtsonevv](https://github.com/gtsonevv)! - add crypto-browserify

## 1.0.0

### Major Changes

- [#1168](https://github.com/near/near-api-js/pull/1168) [`61349aec`](https://github.com/near/near-api-js/commit/61349aeca3af830f702b24654e0f13cd428192d8) Thanks [@gagdiez](https://github.com/gagdiez)! - feat: updated borsh-js to v1.0.1

### Patch Changes

- [#1209](https://github.com/near/near-api-js/pull/1209) [`cdd8d1c8`](https://github.com/near/near-api-js/commit/cdd8d1c8c37db641bd995b2c470ad0b4fdddb93f) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Replace tweetnacl by @noble/curves

- Updated dependencies [[`695220e7`](https://github.com/near/near-api-js/commit/695220e75bc43834a7700cfc5491a7eebd324947), [`ecf29e2d`](https://github.com/near/near-api-js/commit/ecf29e2d56611a7773c79d5bb5bd20c8b7e738ea)]:
  - @near-js/utils@0.0.5

## 0.0.5

### Patch Changes

- [#1115](https://github.com/near/near-api-js/pull/1115) [`40fa6465`](https://github.com/near/near-api-js/commit/40fa64654fdaf3b463122c35521a6f72282974f2) Thanks [@isoldo](https://github.com/isoldo)! - Check length of decoded public key in PublicKey.fromString()

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
