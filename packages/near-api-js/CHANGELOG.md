# near-api-js

## 5.0.0

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
  - @near-js/accounts@1.3.0
  - @near-js/crypto@1.4.0
  - @near-js/keystores@0.2.0
  - @near-js/keystores-browser@0.2.0
  - @near-js/keystores-node@0.1.0
  - @near-js/providers@1.0.0
  - @near-js/signers@0.2.0
  - @near-js/transactions@1.3.0
  - @near-js/types@0.3.0
  - @near-js/utils@1.0.0
  - @near-js/wallet-account@1.3.0

## 4.0.4

### Patch Changes

- [#1355](https://github.com/near/near-api-js/pull/1355) [`7d5a8244`](https://github.com/near/near-api-js/commit/7d5a8244a1683d7b5e82c4da1e40d834167a9a41) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Add Secp256k1 support

- Updated dependencies [[`9c7db11c`](https://github.com/near/near-api-js/commit/9c7db11c3c5c031a749dd72d5140f58056570e36), [`bad95007`](https://github.com/near/near-api-js/commit/bad95007edde4ed9d5989ded7f2032b9f15f5c23), [`7d5a8244`](https://github.com/near/near-api-js/commit/7d5a8244a1683d7b5e82c4da1e40d834167a9a41)]:
  - @near-js/keystores@0.1.0
  - @near-js/keystores-browser@0.1.0
  - @near-js/utils@0.3.0
  - @near-js/crypto@1.3.0
  - @near-js/accounts@1.2.2
  - @near-js/signers@0.1.5
  - @near-js/transactions@1.2.3
  - @near-js/wallet-account@1.2.3
  - @near-js/keystores-node@0.0.13
  - @near-js/providers@0.2.3

## 4.0.3

### Patch Changes

- [#1360](https://github.com/near/near-api-js/pull/1360) [`e90e648c`](https://github.com/near/near-api-js/commit/e90e648ca4d6c3505141ad2ec666bbd9375b1289) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Export encodeTransaction method in near-api-js package

## 4.0.2

### Patch Changes

- Updated dependencies [[`ecdf1741`](https://github.com/near/near-api-js/commit/ecdf1741fb692e71202c541c5b3692790baa65f0), [`92a6f5be`](https://github.com/near/near-api-js/commit/92a6f5be3f4b7be6f3e9b55077025921c3aad2cb)]:
  - @near-js/providers@0.2.2
  - @near-js/types@0.2.1
  - @near-js/accounts@1.2.1
  - @near-js/wallet-account@1.2.2
  - @near-js/crypto@1.2.4
  - @near-js/keystores@0.0.12
  - @near-js/transactions@1.2.2
  - @near-js/utils@0.2.2
  - @near-js/keystores-browser@0.0.12
  - @near-js/keystores-node@0.0.12
  - @near-js/signers@0.1.4

## 4.0.1

### Patch Changes

- Updated dependencies [[`06baa81d`](https://github.com/near/near-api-js/commit/06baa81dc604cfe0463476de7a4dcdd39a6f716a)]:
  - @near-js/accounts@1.2.0
  - @near-js/types@0.2.0
  - @near-js/wallet-account@1.2.1
  - @near-js/crypto@1.2.3
  - @near-js/keystores@0.0.11
  - @near-js/providers@0.2.1
  - @near-js/transactions@1.2.1
  - @near-js/utils@0.2.1
  - @near-js/keystores-browser@0.0.11
  - @near-js/keystores-node@0.0.11
  - @near-js/signers@0.1.3

## 4.0.0

### Major Changes

- [#1223](https://github.com/near/near-api-js/pull/1223) [`9060b781`](https://github.com/near/near-api-js/commit/9060b7811668d71bdf21170273a42842c3691f9b) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Replace bn.js by BigInt.

### Patch Changes

- [#1292](https://github.com/near/near-api-js/pull/1292) [`f739324b`](https://github.com/near/near-api-js/commit/f739324b2959712281d957eb26a09e5d68e32c80) Thanks [@gtsonevv](https://github.com/gtsonevv)! - replace ajv with is-my-json-valid

- Updated dependencies [[`9060b781`](https://github.com/near/near-api-js/commit/9060b7811668d71bdf21170273a42842c3691f9b), [`cc401a6c`](https://github.com/near/near-api-js/commit/cc401a6c893398e2185c35765ca316f68ac86074), [`3f363113`](https://github.com/near/near-api-js/commit/3f363113e102d0acf29b7b2635acf6160a028cc3), [`f739324b`](https://github.com/near/near-api-js/commit/f739324b2959712281d957eb26a09e5d68e32c80)]:
  - @near-js/accounts@1.1.0
  - @near-js/transactions@1.2.0
  - @near-js/types@0.1.0
  - @near-js/utils@0.2.0
  - @near-js/crypto@1.2.2
  - @near-js/providers@0.2.0
  - @near-js/wallet-account@1.2.0
  - @near-js/keystores@0.0.10
  - @near-js/keystores-browser@0.0.10
  - @near-js/keystores-node@0.0.10
  - @near-js/signers@0.1.2

## 3.0.4

### Patch Changes

- Updated dependencies [[`42dc7e2a`](https://github.com/near/near-api-js/commit/42dc7e2ac794e973987bed7b89da5ef2d3c6c8ac)]:
  - @near-js/transactions@1.1.2
  - @near-js/accounts@1.0.4
  - @near-js/providers@0.1.1
  - @near-js/wallet-account@1.1.1

## 3.0.3

### Patch Changes

- Updated dependencies [[`662cc13d`](https://github.com/near/near-api-js/commit/662cc13d7961c3bdabed3ad51b1c57958739a3e6), [`c4655576`](https://github.com/near/near-api-js/commit/c4655576bacb1d8b85030dca5b9443649621c8ee), [`15885dd1`](https://github.com/near/near-api-js/commit/15885dd10ba9b562043a36dc80c449b7c3588313)]:
  - @near-js/providers@0.1.0
  - @near-js/utils@0.1.0
  - @near-js/crypto@1.2.1
  - @near-js/wallet-account@1.1.0
  - @near-js/accounts@1.0.3
  - @near-js/transactions@1.1.1
  - @near-js/keystores@0.0.9
  - @near-js/keystores-browser@0.0.9
  - @near-js/keystores-node@0.0.9
  - @near-js/signers@0.1.1

## 3.0.2

### Patch Changes

- Updated dependencies [[`1900c490`](https://github.com/near/near-api-js/commit/1900c49060c3ea8279448cead7347049a23f421f), [`c6cdc8c7`](https://github.com/near/near-api-js/commit/c6cdc8c724a6dd53114cc5f53fd58e57cea86b78)]:
  - @near-js/crypto@1.2.0
  - @near-js/signers@0.1.0
  - @near-js/transactions@1.1.0
  - @near-js/accounts@1.0.2
  - @near-js/keystores@0.0.8
  - @near-js/keystores-browser@0.0.8
  - @near-js/keystores-node@0.0.8
  - @near-js/wallet-account@1.0.2
  - @near-js/providers@0.0.10

## 3.0.1

### Patch Changes

- Updated dependencies [[`aeeb1502`](https://github.com/near/near-api-js/commit/aeeb15022a1c1deb99114eba0473739b0998fc50)]:
  - @near-js/crypto@1.1.0
  - @near-js/accounts@1.0.1
  - @near-js/keystores@0.0.7
  - @near-js/keystores-browser@0.0.7
  - @near-js/keystores-node@0.0.7
  - @near-js/signers@0.0.7
  - @near-js/transactions@1.0.1
  - @near-js/wallet-account@1.0.1
  - @near-js/providers@0.0.9

## 3.0.0

### Major Changes

- [#1168](https://github.com/near/near-api-js/pull/1168) [`61349aec`](https://github.com/near/near-api-js/commit/61349aeca3af830f702b24654e0f13cd428192d8) Thanks [@gagdiez](https://github.com/gagdiez)! - feat: updated borsh-js to v1.0.1

### Minor Changes

- [#1215](https://github.com/near/near-api-js/pull/1215) [`ecf29e2d`](https://github.com/near/near-api-js/commit/ecf29e2d56611a7773c79d5bb5bd20c8b7e738ea) Thanks [@denbite](https://github.com/denbite)! - Internal logging library with capabilities for integration with modern logging libraries like Pino, Winston, etc

### Patch Changes

- [#1195](https://github.com/near/near-api-js/pull/1195) [`695220e7`](https://github.com/near/near-api-js/commit/695220e75bc43834a7700cfc5491a7eebd324947) Thanks [@ShaunSHamilton](https://github.com/ShaunSHamilton)! - add check for global 'process' object

- [#1209](https://github.com/near/near-api-js/pull/1209) [`cdd8d1c8`](https://github.com/near/near-api-js/commit/cdd8d1c8c37db641bd995b2c470ad0b4fdddb93f) Thanks [@gtsonevv](https://github.com/gtsonevv)! - Replace tweetnacl by @noble/curves

- [#1194](https://github.com/near/near-api-js/pull/1194) [`038b9b9f`](https://github.com/near/near-api-js/commit/038b9b9fd57f73e537041d4b90ed07bf3cd811d9) Thanks [@andrew-scott-fischer](https://github.com/andrew-scott-fischer)! - fixes override of global fetch property

- Updated dependencies [[`0f764ee0`](https://github.com/near/near-api-js/commit/0f764ee03b5747fbf8a971c7b04ef8326238a1d0), [`695220e7`](https://github.com/near/near-api-js/commit/695220e75bc43834a7700cfc5491a7eebd324947), [`0be6c420`](https://github.com/near/near-api-js/commit/0be6c4209f56c0595bf66e217b7ac01444981b99), [`ecf29e2d`](https://github.com/near/near-api-js/commit/ecf29e2d56611a7773c79d5bb5bd20c8b7e738ea), [`61349aec`](https://github.com/near/near-api-js/commit/61349aeca3af830f702b24654e0f13cd428192d8), [`cdd8d1c8`](https://github.com/near/near-api-js/commit/cdd8d1c8c37db641bd995b2c470ad0b4fdddb93f), [`038b9b9f`](https://github.com/near/near-api-js/commit/038b9b9fd57f73e537041d4b90ed07bf3cd811d9)]:
  - @near-js/accounts@1.0.0
  - @near-js/providers@0.0.8
  - @near-js/utils@0.0.5
  - @near-js/wallet-account@1.0.0
  - @near-js/crypto@1.0.0
  - @near-js/transactions@1.0.0
  - @near-js/keystores@0.0.6
  - @near-js/keystores-browser@0.0.6
  - @near-js/keystores-node@0.0.6
  - @near-js/signers@0.0.6

## 2.1.4

### Patch Changes

- Updated dependencies [[`40fa6465`](https://github.com/near/near-api-js/commit/40fa64654fdaf3b463122c35521a6f72282974f2)]:
  - @near-js/crypto@0.0.5
  - @near-js/accounts@0.1.4
  - @near-js/keystores@0.0.5
  - @near-js/keystores-browser@0.0.5
  - @near-js/keystores-node@0.0.5
  - @near-js/signers@0.0.5
  - @near-js/transactions@0.2.1
  - @near-js/wallet-account@0.0.7
  - @near-js/providers@0.0.7

## 2.1.3

### Patch Changes

- [#1128](https://github.com/near/near-api-js/pull/1128) [`e21ff896`](https://github.com/near/near-api-js/commit/e21ff89601c858fb703169e3bb53c6d96cff5342) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Compatibility shim for NearSocial/VM

- Updated dependencies [[`e21ff896`](https://github.com/near/near-api-js/commit/e21ff89601c858fb703169e3bb53c6d96cff5342), [`00b4d2ba`](https://github.com/near/near-api-js/commit/00b4d2ba3f9f3a1f90343e34cb9bde8cdb607ceb)]:
  - @near-js/transactions@0.2.0
  - @near-js/accounts@0.1.3
  - @near-js/providers@0.0.6
  - @near-js/wallet-account@0.0.6

## 2.1.2

### Patch Changes

- [#1124](https://github.com/near/near-api-js/pull/1124) [`c1dcf3b8`](https://github.com/near/near-api-js/commit/c1dcf3b8207e7de358e1d711d55da938d5d9ff8d) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Allow use of legacy `deps.keyStore` path in NearConfig

- Updated dependencies [[`bf81ddc1`](https://github.com/near/near-api-js/commit/bf81ddc11c958dece2244798bdfa6ab11e653940), [`c1dcf3b8`](https://github.com/near/near-api-js/commit/c1dcf3b8207e7de358e1d711d55da938d5d9ff8d)]:
  - @near-js/types@0.0.4
  - @near-js/wallet-account@0.0.5
  - @near-js/accounts@0.1.2
  - @near-js/crypto@0.0.4
  - @near-js/keystores@0.0.4
  - @near-js/providers@0.0.5
  - @near-js/transactions@0.1.1
  - @near-js/utils@0.0.4
  - @near-js/keystores-browser@0.0.4
  - @near-js/keystores-node@0.0.4
  - @near-js/signers@0.0.4

## 2.1.1

### Patch Changes

- Updated dependencies [[`d6d53ab1`](https://github.com/near/near-api-js/commit/d6d53ab1b90e3d4041080dd4a6e22d24900c1ca5)]:
  - @near-js/providers@0.0.4
  - @near-js/accounts@0.1.1
  - @near-js/wallet-account@0.0.4

## 2.1.0

### Minor Changes

- [#1103](https://github.com/near/near-api-js/pull/1103) [`b713ae78`](https://github.com/near/near-api-js/commit/b713ae78969d530e7e69e21e315e3d3fdb5e68e9) Thanks [@austinabell](https://github.com/austinabell)! - Implement light client block retrieval and relevant types

### Patch Changes

- [#1106](https://github.com/near/near-api-js/pull/1106) [`bc53c32c`](https://github.com/near/near-api-js/commit/bc53c32c80694e6f22d9be97db44603591f0026b) Thanks [@austinabell](https://github.com/austinabell)! - Adds missing timestamp_nanosec field to light client proof header

- Updated dependencies [[`b713ae78`](https://github.com/near/near-api-js/commit/b713ae78969d530e7e69e21e315e3d3fdb5e68e9), [`bc53c32c`](https://github.com/near/near-api-js/commit/bc53c32c80694e6f22d9be97db44603591f0026b), [`b7b6c6a1`](https://github.com/near/near-api-js/commit/b7b6c6a1448050f60f6498f799654204f1998b91), [`d97d2a6e`](https://github.com/near/near-api-js/commit/d97d2a6e891350cdea418da2af2b2971bdf0467e), [`4704ee77`](https://github.com/near/near-api-js/commit/4704ee7717d9e92e7729037368e7ace84a9c7f1c), [`8c6bf391`](https://github.com/near/near-api-js/commit/8c6bf391a01af9adb81cb8731c45bdb17f5291c0)]:
  - @near-js/providers@0.0.3
  - @near-js/types@0.0.3
  - @near-js/accounts@0.1.0
  - @near-js/transactions@0.1.0
  - @near-js/crypto@0.0.3
  - @near-js/keystores@0.0.3
  - @near-js/utils@0.0.3
  - @near-js/wallet-account@0.0.3
  - @near-js/keystores-browser@0.0.3
  - @near-js/keystores-node@0.0.3
  - @near-js/signers@0.0.3

## 2.0.4

### Patch Changes

- [#1093](https://github.com/near/near-api-js/pull/1093) [`94311587`](https://github.com/near/near-api-js/commit/94311587ece172fb3e4d009ca0ecbfe9cea4447a) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Publish repackaging

## 2.0.3

### Patch Changes

- Updated dependencies [[`ca458cac`](https://github.com/near/near-api-js/commit/ca458cac683fab614b77eb5daa160e03b0640350)]:
  - @near-js/accounts@0.0.2
  - @near-js/crypto@0.0.2
  - @near-js/keystores@0.0.2
  - @near-js/keystores-browser@0.0.2
  - @near-js/keystores-node@0.0.2
  - @near-js/providers@0.0.2
  - @near-js/signers@0.0.2
  - @near-js/transactions@0.0.2
  - @near-js/types@0.0.2
  - @near-js/utils@0.0.2
  - @near-js/wallet-account@0.0.2

## 2.0.2

### Patch Changes

- [#1089](https://github.com/near/near-api-js/pull/1089) [`c1ffd501`](https://github.com/near/near-api-js/commit/c1ffd5016cd9bbc285c5ec2b63ff4403e675338e) Thanks [@andy-haynes](https://github.com/andy-haynes)! - CI update

## 2.0.1

### Patch Changes

- [#1087](https://github.com/near/near-api-js/pull/1087) [`4f9e3d4d`](https://github.com/near/near-api-js/commit/4f9e3d4d978adc4a073e0ae2cdba69c3e1600201) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Use new packages in @near-js/biometric-ed25519

## 2.0.0

### Major Changes

- [#1006](https://github.com/near/near-api-js/pull/1006) [`8ee564c0`](https://github.com/near/near-api-js/commit/8ee564c0f4786e3c9281892c73761bd6a9205074) Thanks [@morgsmccauley](https://github.com/morgsmccauley)! - Make `Account.signAndSendTransaction` `public` so transactions can be sent directly from `Account` instances

- [#1014](https://github.com/near/near-api-js/pull/1014) [`8feb1997`](https://github.com/near/near-api-js/commit/8feb199733a770b25b63b0bbc7d79fc8b0b1683c) Thanks [@esaminu](https://github.com/esaminu)! - Make `appKeyPrefix` a required arg to `WalletConnection` constructor

  Users that were doing

  ```typescript
  new WalletConnection(near);
  ```

  will now have to do

  ```typescript
  new WalletConnection(near, "undefined");
  ```

  If they want to access the keys they had potentially accumulated

- [#935](https://github.com/near/near-api-js/pull/935) [`c740afc8`](https://github.com/near/near-api-js/commit/c740afc897208d26165c4f8b2aae6db70694e70b) Thanks [@hcho112](https://github.com/hcho112)! - `account.viewFunction` now takes a single object argument rather than individual args. Callsites will now need to be updated like so:

  ```diff
  -await account.viewFunction(
  -  'wrap.near',
  -  'storage_balance_of',
  -  { account_id: 'example.near' }
  -);
  +await account.viewFunction({
  +  contractId: 'wrap.near',
  +  methodName: 'storage_balance_of',
  +  args: { account_id: 'example.near' },
  +});
  ```

- [#1056](https://github.com/near/near-api-js/pull/1056) [`b823ada7`](https://github.com/near/near-api-js/commit/b823ada740e64a45d4b9671fab791968b51de61a) Thanks [@andy-haynes](https://github.com/andy-haynes)! - Major functionality in near-api-js has now been broken up into packages under @near-js

  Breaking changes:

  - `KeyPairEd25519` no longer supports the `fromString` static method. This method is now only available on the `KeyPair` class.

### Minor Changes

- [#1045](https://github.com/near/near-api-js/pull/1045) [`0c85da12`](https://github.com/near/near-api-js/commit/0c85da123473017683b2a53f83652938488dd086) Thanks [@itegulov](https://github.com/itegulov)! - `Contract` can now optionally be instantiated with ABI

### Patch Changes

- [#1003](https://github.com/near/near-api-js/pull/1003) [`726b7953`](https://github.com/near/near-api-js/commit/726b795312230357aa2bb8a8db8a217a0f18a663) Thanks [@marcinbodnar](https://github.com/marcinbodnar)! - Fix error types. WIth this changes both `JsonRpcProvider.query` and `JsonRpcProvider.sendJsonRpc` methods will return proper error type for these errors: `AccountDoesNotExist`, `AccessKeyDoesNotExist`, `CodeDoesNotExist`, `InvalidNonce`.

  An additional fix to `getErrorTypeFromErrorMessage` function. Now `getErrorTypeFromErrorMessage` will not change error type if it already exists.

## 1.1.0

### Minor Changes

- [#1007](https://github.com/near/near-api-js/pull/1007) [`fff4b44d`](https://github.com/near/near-api-js/commit/fff4b44d6abaccfe8fd112053c5ac2dd0ce00577) Thanks [@morgsmccauley](https://github.com/morgsmccauley)! - Introduce `getActiveDelegatedStakeBalance` to return delegated stake balance of an account

### Patch Changes

- [#1007](https://github.com/near/near-api-js/pull/1007) [`fff4b44d`](https://github.com/near/near-api-js/commit/fff4b44d6abaccfe8fd112053c5ac2dd0ce00577) Thanks [@morgsmccauley](https://github.com/morgsmccauley)! - Removed unused variables and dependencies.
