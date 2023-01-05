---
"near-api-js": major
---

Make `appKeyPrefix` a required arg to `WalletConnection` constructor

Users that were doing

```typescript
new WalletConnection(near);
```

will now have to do

```typescript
new WalletConnection(near, "undefined");
```

If they want to access the keys they had potentially accumulated
