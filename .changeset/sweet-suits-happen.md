---
"near-api-js": major
---

Renovate `Provider.query` by removing the deprecated inline-argument overload and fully aligning the method with the nearcore RPC API spec.

Previously supported (no longer works):

```ts
provider.query("view_account", JSON.stringify({ ... }));
```

New required usage (fully typed):

```ts
provider.query({
  request_type: "view_account",
  ...
});
```

Once `request_type` is specified, remaining parameters are inferred automatically by the IDE.
