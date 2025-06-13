---
"@near-js/tokens": patch
---

Fix export configuration and remove invalid build dependency

- Remove invalid "build": "workspace:*" dependency that caused npm install errors
- Add exports for ft/ and nft/ subdirectories to support direct imports like `@near-js/tokens/ft`
- Add ft/format export for granular access to formatting utilities
- Update export checks to use node16 profile (Node10 is past end-of-life)
- All exports now work correctly with Node16+, ESM, CJS, and bundlers