# @near-js/types

## 0.3.0

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

## 0.2.1

### Patch Changes

- [#1349](https://github.com/near/near-api-js/pull/1349) [`ecdf1741`](https://github.com/near/near-api-js/commit/ecdf1741fb692e71202c541c5b3692790baa65f0) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Fix TxExecutionStatus import.

- [#1347](https://github.com/near/near-api-js/pull/1347) [`92a6f5be`](https://github.com/near/near-api-js/commit/92a6f5be3f4b7be6f3e9b55077025921c3aad2cb) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Update tx execution status default value.

## 0.2.0

### Minor Changes

- [#1317](https://github.com/near/near-api-js/pull/1317) [`06baa81d`](https://github.com/near/near-api-js/commit/06baa81dc604cfe0463476de7a4dcdd39a6f716a) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Add support for nearcore 1.37 changes

## 0.1.0

### Minor Changes

- [#1223](https://github.com/near/near-api-js/pull/1223) [`9060b781`](https://github.com/near/near-api-js/commit/9060b7811668d71bdf21170273a42842c3691f9b) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Replace bn.js by BigInt.

## 0.0.4

### Patch Changes

- [#1113](https://github.com/near/near-api-js/pull/1113) [`bf81ddc1`](https://github.com/near/near-api-js/commit/bf81ddc11c958dece2244798bdfa6ab11e653940) Thanks [@austinabell](https://github.com/austinabell)! - added tokens_burnt and executor_id fields to ExecutionOutcome JSON response

## 0.0.3

### Patch Changes

- [#1103](https://github.com/near/near-api-js/pull/1103) [`b713ae78`](https://github.com/near/near-api-js/commit/b713ae78969d530e7e69e21e315e3d3fdb5e68e9) Thanks [@austinabell](https://github.com/austinabell)! - Implement light client block retrieval and relevant types

- [#1106](https://github.com/near/near-api-js/pull/1106) [`bc53c32c`](https://github.com/near/near-api-js/commit/bc53c32c80694e6f22d9be97db44603591f0026b) Thanks [@austinabell](https://github.com/austinabell)! - Adds missing timestamp_nanosec field to light client proof header

- [#1105](https://github.com/near/near-api-js/pull/1105) [`8c6bf391`](https://github.com/near/near-api-js/commit/8c6bf391a01af9adb81cb8731c45bdb17f5291c0) Thanks [@austinabell](https://github.com/austinabell)! - Adds missing version field in ValidatorStakeView

## 0.0.2

### Patch Changes

- [#1091](https://github.com/near/near-api-js/pull/1091) [`ca458cac`](https://github.com/near/near-api-js/commit/ca458cac683fab614b77eb5daa160e03b0640350) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Only include contents of lib/ in NPM packages
