---
"near-api-js": major
---

`account.viewFunction` now takes a single object argument rather than individual args. Callsites will now need to be updated like so:
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