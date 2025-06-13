---
"@near-js/tokens": patch
---

Fix export configuration and remove invalid build dependency

- Remove invalid "build": "workspace:*" dependency that caused npm install errors
- Add exports for ft/ and nft/ subdirectories to support direct imports like `@near-js/tokens/ft`
- Add ft/format export for granular access to formatting utilities
- Improve Node16+ and bundler compatibility for all nested exports