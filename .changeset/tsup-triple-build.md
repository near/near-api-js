---
"near-api-js": minor
---

Switch build from tsc to tsup, producing three output formats: ESM (unbundled, tree-shakeable), CJS (unbundled with `.cjs` extensions), and IIFE (fully bundled 252KB browser build). The `exports` field now provides proper `import`/`require`/`types` conditions for all subpath exports. Output moves from `lib/` to `dist/`. Consumers using deep imports from `lib/` should update to the documented subpath exports (`.`, `./tokens`, `./nep413`, `./seed-phrase`, `./rpc-errors`).
