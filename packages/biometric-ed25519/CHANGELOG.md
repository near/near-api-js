# @near-js/biometric-ed25519

## 1.3.1

### Patch Changes

- Updated dependencies [[`5b0bbbc1`](https://github.com/near/near-api-js/commit/5b0bbbc17ffe7d89d7767e405d2ca700dc2bba40)]:
  - @near-js/crypto@1.4.1
  - @near-js/utils@1.0.1

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
  - @near-js/utils@1.0.0

## 1.2.5

### Patch Changes

- [#1355](https://github.com/near/near-api-js/pull/1355) [`7d5a8244`](https://github.com/near/near-api-js/commit/7d5a8244a1683d7b5e82c4da1e40d834167a9a41) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Add Secp256k1 support

- Updated dependencies [[`bad95007`](https://github.com/near/near-api-js/commit/bad95007edde4ed9d5989ded7f2032b9f15f5c23), [`7d5a8244`](https://github.com/near/near-api-js/commit/7d5a8244a1683d7b5e82c4da1e40d834167a9a41)]:
  - @near-js/utils@0.3.0
  - @near-js/crypto@1.3.0

## 1.2.4

### Patch Changes

- [#1359](https://github.com/near/near-api-js/pull/1359) [`71b2764e`](https://github.com/near/near-api-js/commit/71b2764e3a6a41637ee6220008e8fc53b0df0e09) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Add isDeviceSupported method

## 1.2.3

### Patch Changes

- Updated dependencies []:
  - @near-js/crypto@1.2.4
  - @near-js/utils@0.2.2

## 1.2.2

### Patch Changes

- Updated dependencies []:
  - @near-js/crypto@1.2.3
  - @near-js/utils@0.2.1

## 1.2.1

### Patch Changes

- [#1339](https://github.com/near/near-api-js/pull/1339) [`86cf5057`](https://github.com/near/near-api-js/commit/86cf5057516e9709273fe3cb23681bc4a6df1862) Thanks [@hcho112](https://github.com/hcho112)! - Bug fix on createKey and getKeys

## 1.2.0

### Minor Changes

- [#1331](https://github.com/near/near-api-js/pull/1331) [`bc2e982b`](https://github.com/near/near-api-js/commit/bc2e982b35a6777c33675a1502a40404c9dd9df2) Thanks [@hcho112](https://github.com/hcho112)! - Include sanitization on navigator.credentials response to support Bitwarden password manager

### Patch Changes

- [#1223](https://github.com/near/near-api-js/pull/1223) [`9060b781`](https://github.com/near/near-api-js/commit/9060b7811668d71bdf21170273a42842c3691f9b) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Replace bn.js by BigInt.

- Updated dependencies [[`9060b781`](https://github.com/near/near-api-js/commit/9060b7811668d71bdf21170273a42842c3691f9b)]:
  - @near-js/utils@0.2.0
  - @near-js/crypto@1.2.2

## 1.1.2

### Patch Changes

- [#1309](https://github.com/near/near-api-js/pull/1309) [`4b5aae44`](https://github.com/near/near-api-js/commit/4b5aae441fc3c10a5a3bf4d559ed2867c5e9abf1) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Fix recoverPublicKey(), createKey() and getKeys() methods.

## 1.1.1

### Patch Changes

- Updated dependencies [[`662cc13d`](https://github.com/near/near-api-js/commit/662cc13d7961c3bdabed3ad51b1c57958739a3e6), [`c4655576`](https://github.com/near/near-api-js/commit/c4655576bacb1d8b85030dca5b9443649621c8ee)]:
  - @near-js/utils@0.1.0
  - @near-js/crypto@1.2.1

## 1.1.0

### Minor Changes

- [#1224](https://github.com/near/near-api-js/pull/1224) [`1900c490`](https://github.com/near/near-api-js/commit/1900c49060c3ea8279448cead7347049a23f421f) Thanks [@gtsonevv](https://github.com/gtsonevv)! - remove buggy dependencies - replace js-sha256 with noble-hashes - replace elliptic with noble-curves - remove error-polyfill package

### Patch Changes

- [#1259](https://github.com/near/near-api-js/pull/1259) [`94cd0e65`](https://github.com/near/near-api-js/commit/94cd0e6511750beba87b823a1b87bf89f51ad7eb) Thanks [@gtsonevv](https://github.com/gtsonevv)! - pass the correct parameter to getPublicKey() in getKeys()

- Updated dependencies [[`1900c490`](https://github.com/near/near-api-js/commit/1900c49060c3ea8279448cead7347049a23f421f), [`c6cdc8c7`](https://github.com/near/near-api-js/commit/c6cdc8c724a6dd53114cc5f53fd58e57cea86b78)]:
  - @near-js/crypto@1.2.0

## 1.0.1

### Patch Changes

- Updated dependencies [[`aeeb1502`](https://github.com/near/near-api-js/commit/aeeb15022a1c1deb99114eba0473739b0998fc50)]:
  - @near-js/crypto@1.1.0

## 1.0.0

### Major Changes

- [#1168](https://github.com/near/near-api-js/pull/1168) [`61349aec`](https://github.com/near/near-api-js/commit/61349aeca3af830f702b24654e0f13cd428192d8) Thanks [@gagdiez](https://github.com/gagdiez)! - feat: updated borsh-js to v1.0.1

### Minor Changes

- [#1191](https://github.com/near/near-api-js/pull/1191) [`6a67ce35`](https://github.com/near/near-api-js/commit/6a67ce35a688c6cfa4105adf0e3b06fff19f0892) Thanks [@hcho112](https://github.com/hcho112)! - Handing null response on create key flow

### Patch Changes

- Updated dependencies [[`695220e7`](https://github.com/near/near-api-js/commit/695220e75bc43834a7700cfc5491a7eebd324947), [`ecf29e2d`](https://github.com/near/near-api-js/commit/ecf29e2d56611a7773c79d5bb5bd20c8b7e738ea), [`61349aec`](https://github.com/near/near-api-js/commit/61349aeca3af830f702b24654e0f13cd428192d8), [`cdd8d1c8`](https://github.com/near/near-api-js/commit/cdd8d1c8c37db641bd995b2c470ad0b4fdddb93f)]:
  - @near-js/utils@0.0.5
  - @near-js/crypto@1.0.0

## 0.3.0

### Minor Changes

- [#1148](https://github.com/near/near-api-js/pull/1148) [`60b59044`](https://github.com/near/near-api-js/commit/60b5904439fff25fab0cebed0b9b041938890964) Thanks [@hcho112](https://github.com/hcho112)! - bugfix and improvements on biometric-ed25519

## 0.2.0

### Minor Changes

- [#1139](https://github.com/near/near-api-js/pull/1139) [`60c65dd1`](https://github.com/near/near-api-js/commit/60c65dd1b8609551c270a5d53b9f70970aa1bcd8) Thanks [@hcho112](https://github.com/hcho112)! - Introducing a new util function, isPassKeyAvailable on biometric-ed25519 package

### Patch Changes

- Updated dependencies [[`40fa6465`](https://github.com/near/near-api-js/commit/40fa64654fdaf3b463122c35521a6f72282974f2)]:
  - @near-js/crypto@0.0.5

## 0.1.0

### Minor Changes

- [#1135](https://github.com/near/near-api-js/pull/1135) [`28be70e6`](https://github.com/near/near-api-js/commit/28be70e6d69aa807bde82eaee2ea8b3bda3d3f95) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Remove module-scoped globals and update build configuration

## 0.0.11

### Patch Changes

- [#1132](https://github.com/near/near-api-js/pull/1132) [`f9b094ee`](https://github.com/near/near-api-js/commit/f9b094ee37b2ecee046ee5d6a8a4866ed580d8de) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Remove yarn.lock

## 0.0.10

### Patch Changes

- [#1129](https://github.com/near/near-api-js/pull/1129) [`aeeda99c`](https://github.com/near/near-api-js/commit/aeeda99c435f95d1bd26046a3f480e84a8945c88) Thanks [@MaximusHaximus](https://github.com/MaximusHaximus)! - Remove account length limit

## 0.0.9

### Patch Changes

- [#1125](https://github.com/near/near-api-js/pull/1125) [`5808d3a7`](https://github.com/near/near-api-js/commit/5808d3a7cad6ebfe19e2e249eebca8387b9d7495) Thanks [@esaminu](https://github.com/esaminu)! - This PR fixes a bug with the getKeys method in the biometric-ed25519 package. This method is currently broken due to not awaiting an async function and trying to access undefined properties on the promise.

## 0.0.8

### Patch Changes

- Updated dependencies []:
  - @near-js/crypto@0.0.4

## 0.0.7

### Patch Changes

- Updated dependencies []:
  - @near-js/crypto@0.0.3

## 0.0.6

### Patch Changes

- [#1091](https://github.com/near/near-api-js/pull/1091) [`ca458cac`](https://github.com/near/near-api-js/commit/ca458cac683fab614b77eb5daa160e03b0640350) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Only include contents of lib/ in NPM packages

- Updated dependencies [[`ca458cac`](https://github.com/near/near-api-js/commit/ca458cac683fab614b77eb5daa160e03b0640350)]:
  - @near-js/crypto@0.0.2

## 0.0.5

### Patch Changes

- [#1087](https://github.com/near/near-api-js/pull/1087) [`4f9e3d4d`](https://github.com/near/near-api-js/commit/4f9e3d4d978adc4a073e0ae2cdba69c3e1600201) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Use new packages in @near-js/biometric-ed25519

## 0.0.4

### Patch Changes

- Updated dependencies [[`8ee564c0`](https://github.com/near/near-api-js/commit/8ee564c0f4786e3c9281892c73761bd6a9205074), [`8feb1997`](https://github.com/near/near-api-js/commit/8feb199733a770b25b63b0bbc7d79fc8b0b1683c), [`c740afc8`](https://github.com/near/near-api-js/commit/c740afc897208d26165c4f8b2aae6db70694e70b), [`b823ada7`](https://github.com/near/near-api-js/commit/b823ada740e64a45d4b9671fab791968b51de61a), [`726b7953`](https://github.com/near/near-api-js/commit/726b795312230357aa2bb8a8db8a217a0f18a663), [`0c85da12`](https://github.com/near/near-api-js/commit/0c85da123473017683b2a53f83652938488dd086)]:
  - near-api-js@2.0.0
