# @near-js/client

Functions and classes for working with Near Protocol at a high level.

### Near Client
The `NearClient` class encapsulates common operations:
```ts
import { NearClient } from '@near-js/client';

const near = new NearClient(); // defaults to mainnet network
const testnetClient = new NearClient({ network: 'testnet' });
```

Instances have access to a `Viewer` instance, permitting `view` method calls with an RPC provider. Common view methods (e.g. account/contract) have dedicated methods:
```ts
const keys = await near.viewer.accessKeys('viewer.near');
const alsoKeys = await near.view('viewer.near', 'view_access_key_list'); // equivalent to above
```

Instances can be configured to sign messages intuitively, without extraneous imports:
```ts
near
  .withUnencryptedFilesystemKeystore() // defaults to Near CLI path
  .withSigningAccount('me.near');

await near.sendNear('you.near', 1000n);
```

Helper methods on the instance simplify common operations:
```ts
const accountResult = await near.createAccount('new-account.near', publicKey); // requires signer
const { available, staked, totalStaked, total } = await near.getBalance('me.near');
const block = await near.getBlock();
```

### TransactionComposer
The `TransactionComposer` class simplifies working with `@near-js/transactions` Transactions:

```ts
import { TransactionComposer } from '@near-js/client';
...
const transaction = new TransactionComposer({
  receiver: 'me.near',
  sender: 'me.near',
  blockHash,
  nonce,
  publicKey,
})
  .deployContract(code)
  .addFullAccessKey(PublicKey.from('...'))
  .deleteKey(oldPublicKey)
  .functionCall('update', { x: 100 })
  .toTransaction();
```

### Examples
This API can be used to trivially implement cookbook examples:

#### create-testnet-account.js
```ts
import { NearClient } from '@near-js/client';
import { KeyPairEd25519 } from '@near-js/crypto';

await new NearClient({ network: 'testnet' })
  .withUnencryptedFilesystemKeystore()
  .withSigningAccount(creatorAccountId)
  .createAccount(newAccountId, KeyPairEd25519.fromRandom());
```

#### batch-transactions.js
```ts
import { NearClient } from '@near-js/client';

const near = await new NearClient()
  .withUnencryptedFilesystemKeystore()
  .withSigningAccount(contractName);

const transaction = near
  .initTransaction(contractName)
  .deployContract(fs.readFileSync(WASM_PATH))
  .functionCall('new', newArgs)
  .toTransaction();

const { signedTx } = await near.signTransaction(transaction);
await near.sendTransaction(signedTx);
```

#### meta-transaction.js
```ts
import { NearClient } from '@near-js/client';

const sender = new NearClient()
  .withUnencryptedFilesystemKeystore()
  .withSigningAccount('sender.near');

const delegateAction = (await sender.initTransaction())
  .transfer('receiver.near', 1000n)
  .toMetaTransaction();

const { signedDelegateAction } = await sender.signDelegateAction(delegateAction);

const relayer = new NearClient()
  .withUnencryptedFilesystemKeystore()
  .withSigningAccount('signer.near');

const transaction = (await relayer.initTransaction())
  .delegateAction(delegateAction)
  .toTransaction();

const { signedTx } = await near.signTransaction(transaction);
await near.sendTransaction(signedTx);
```
