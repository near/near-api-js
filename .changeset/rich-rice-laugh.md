---
"near-api-js": minor
---

Add builder pattern transaction creation feature as an alternative way to create and send transactions:
```typescript
bob.createTransaction("alice.near").transfer("1000000000000000000").signAndSend();
```
