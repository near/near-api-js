---
"near-api-js": patch
---

Exclude `e2e` directory from root `tsconfig.json` typecheck. The e2e directory has its own tsconfig and its own dependency install step, so including it in the root typecheck caused spurious failures when e2e deps weren't installed.
