# near-api-js

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
