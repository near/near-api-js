---
"near-api-js": minor
---

Add a new `Provider.viewGlobalContractCode` method for retrieving global contract code using either a `codeHash`, or an `accountId` identifier.

Example usage:

```ts
provider.viewGlobalContractCode({
    identifier: { accountId: "global_contract.near" },
});
provider.viewGlobalContractCode({
    identifier: { codeHash: "J1arLz48fgXcGyCPVckFwLnewNH6j1uw79thsvwqGYTY" },
});
```
