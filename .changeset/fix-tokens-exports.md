---
"@near-js/tokens": patch
---

Fix package exports and remove invalid dependency

Remove invalid "build" dependency and add proper exports for ft/, nft/, and ft/format subdirectories. Updates export validation to use node16 profile since Node10 is past end-of-life.