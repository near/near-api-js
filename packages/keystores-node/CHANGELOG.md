# @near-js/keystores-node

## 0.1.0

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
  - @near-js/keystores@0.2.0

## 0.0.13

### Patch Changes

- Updated dependencies [[`9c7db11c`](https://github.com/near/near-api-js/commit/9c7db11c3c5c031a749dd72d5140f58056570e36), [`7d5a8244`](https://github.com/near/near-api-js/commit/7d5a8244a1683d7b5e82c4da1e40d834167a9a41)]:
  - @near-js/keystores@0.1.0
  - @near-js/crypto@1.3.0

## 0.0.12

### Patch Changes

- Updated dependencies []:
  - @near-js/crypto@1.2.4
  - @near-js/keystores@0.0.12

## 0.0.11

### Patch Changes

- Updated dependencies []:
  - @near-js/crypto@1.2.3
  - @near-js/keystores@0.0.11

## 0.0.10

### Patch Changes

- Updated dependencies [[`9060b781`](https://github.com/near/near-api-js/commit/9060b7811668d71bdf21170273a42842c3691f9b)]:
  - @near-js/crypto@1.2.2
  - @near-js/keystores@0.0.10

## 0.0.9

### Patch Changes

- Updated dependencies [[`c4655576`](https://github.com/near/near-api-js/commit/c4655576bacb1d8b85030dca5b9443649621c8ee)]:
  - @near-js/crypto@1.2.1
  - @near-js/keystores@0.0.9

## 0.0.8

### Patch Changes

- Updated dependencies [[`1900c490`](https://github.com/near/near-api-js/commit/1900c49060c3ea8279448cead7347049a23f421f), [`c6cdc8c7`](https://github.com/near/near-api-js/commit/c6cdc8c724a6dd53114cc5f53fd58e57cea86b78)]:
  - @near-js/crypto@1.2.0
  - @near-js/keystores@0.0.8

## 0.0.7

### Patch Changes

- Updated dependencies [[`aeeb1502`](https://github.com/near/near-api-js/commit/aeeb15022a1c1deb99114eba0473739b0998fc50)]:
  - @near-js/crypto@1.1.0
  - @near-js/keystores@0.0.7

## 0.0.6

### Patch Changes

- Updated dependencies [[`61349aec`](https://github.com/near/near-api-js/commit/61349aeca3af830f702b24654e0f13cd428192d8), [`cdd8d1c8`](https://github.com/near/near-api-js/commit/cdd8d1c8c37db641bd995b2c470ad0b4fdddb93f)]:
  - @near-js/crypto@1.0.0
  - @near-js/keystores@0.0.6

## 0.0.5

### Patch Changes

- Updated dependencies [[`40fa6465`](https://github.com/near/near-api-js/commit/40fa64654fdaf3b463122c35521a6f72282974f2)]:
  - @near-js/crypto@0.0.5
  - @near-js/keystores@0.0.5

## 0.0.4

### Patch Changes

- Updated dependencies []:
  - @near-js/crypto@0.0.4
  - @near-js/keystores@0.0.4

## 0.0.3

### Patch Changes

- Updated dependencies []:
  - @near-js/crypto@0.0.3
  - @near-js/keystores@0.0.3

## 0.0.2

### Patch Changes

- [#1091](https://github.com/near/near-api-js/pull/1091) [`ca458cac`](https://github.com/near/near-api-js/commit/ca458cac683fab614b77eb5daa160e03b0640350) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Only include contents of lib/ in NPM packages

- Updated dependencies [[`ca458cac`](https://github.com/near/near-api-js/commit/ca458cac683fab614b77eb5daa160e03b0640350)]:
  - @near-js/crypto@0.0.2
  - @near-js/keystores@0.0.2
