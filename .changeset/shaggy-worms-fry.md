---
"near-api-js": minor
---

Export strongly typed RPC error classes behind the `rpc-errors` sub-path, for end users to reliably handle specific RPC failures.

For example, end users can now catch action-level errors (e.g. when a transaction fails because the recipient account does not exist):

```ts
import { AccountDoesNotExistActionError } from "near-api-js/rpc-errors";

try {
  await account.transfer({
    amount: nearToYocto(0.01),
    receiverId: "unexisted_account_111.testnet"
  });
} catch (error) {
  if (error instanceof AccountDoesNotExistActionError) {
    console.error(
      `Transaction ${error.txHash} failed because recipient ${error.accountId} does not exist!`
    );
  }
}
```

Or, RPC request validation and parsing errors can also be handled explicitly (e.g. when an invalid account ID format is included in a transaction):

```ts
import { RpcRequestParseError } from "near-api-js/rpc-errors";

try {
  await account.transfer({
    amount: nearToYocto(0.001),
    receiverId: "account_name_that_fail_validation%.testnet"
  });
} catch (error) {
  if (error instanceof RpcRequestParseError) {
    // Failed parsing args: the value could not be decoded from borsh due to:
    // invalid value: "account_name_that_fail_validation%.testnet",
    // the Account ID contains an invalid character '%' at index 33
    console.error(error.message);
  }
}
```

Or, some requests may reference data that is no longer available or cannot be resolved by the node (e.g. querying a block that cannot be found):

```ts
import { UnknownBlockError } from "near-api-js/rpc-errors";

const unexistedBlockHeight = 1_000_000_000_000_000;

try {
  await provider.viewBlock({ blockId: unexistedBlockHeight });
} catch (error) {
  if (error instanceof UnknownBlockError) {
    console.error(
      `Block at height ${unexistedBlockHeight} could not be found on the node!`
    );
  }
}
```

All exported errors ultimately extend the `RpcError` base class, so applications can also catch and handle any RPC-related error in a single place when fine-grained handling is not required:

```ts
import { RpcError } from "near-api-js/rpc-errors";

try {
  await provider.viewAccessKey({
    accountId: "user.testnet",
    publicKey: "ed25519:EaQnZxCMwh9yhkqW2XE2umd21iNmXep1BkM6Wtw2Qr1b"
  });
} catch (error) {
  if (error instanceof RpcError) {
    // Access key ed25519:EaQnZx... does not exist at block height ...
    console.error(error.message);
  }
}

try {
  await provider.viewAccessKey({
    accountId: "user.testnet",
    publicKey: "ed25519:EaQnZxCMwh9yhkqW2XE2umd21iNmXep1BkM6Wtw2Qr1bxxxx" // invalid key here
  });
} catch (error) {
  if (error instanceof RpcError) {
    // Failed parsing args: invalid key length: expected the input of 32 bytes, but 33 was given
    console.error(error.message);
  }
}
```