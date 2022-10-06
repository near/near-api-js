---
"near-api-js": minor
---

Add builder pattern transaction creation feature as an alternative way to create and send transactions:
```typescript
new Account(connection, 'bob.near').createTransaction("alice.near").transfer(new BN("1000000000000000000")).signAndSend();
```
