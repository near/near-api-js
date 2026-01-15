---
"near-api-js": minor
---

Extend the `Account` constructor to accept an RPC URL string in addition to a `Provider`, making account instantiation simpler and more ergonomic.

New supported usage:

```ts
new Account('user.near', 'https://rpc.testnet.near.org');
```

Previously, users had to always manually create a provider:

```ts
const provider = new JsonRpcProvider({ url: 'https://rpc.testnet.near.org' });
new Account('user.near', provider);
```
