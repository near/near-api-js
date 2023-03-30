# near-api-js

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
