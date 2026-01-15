---
"near-api-js": minor
---

Add concurrent transactions support by introducing nonce caching and automatic retries on `InvalidNonceError`.

The following example that previously failed due to nonce collisions, now works reliably:

```ts
await Promise.all([
  account.transfer({
    amount: nearToYocto(1),
    receiverId: "user1.testnet",
  }),
  account.transfer({
    amount: nearToYocto(2),
    receiverId: "user2.testnet",
  }),
  account.transfer({
    amount: nearToYocto(3),
    receiverId: "user3.testnet",
  }),
]);
```
