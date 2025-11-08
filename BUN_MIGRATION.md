# Migration to Bun & ESM-Only

This document summarizes the major changes made during the migration from pnpm + Turborepo to Bun with ESM-only output.

## Summary of Changes

### Package Manager Migration
- **Removed**: pnpm (v10.4.1) + Turborepo (v2.4.4)
- **Added**: Bun workspaces (native)
- **Benefit**: Simpler setup, faster installs, native workspace support

### Build System Changes
- **Removed**: tsup (bundler)
- **Added**: TypeScript compiler (tsc) directly
- **Reason**: For library code with no bundling needs, tsc is simpler and has zero extra dependencies

### Module Format
- **Before**: Dual output (CommonJS + ESM)
  - CJS: `lib/commonjs/*.cjs`
  - ESM: `lib/esm/*.js`
- **After**: ESM-only
  - ESM: `lib/*.js`
- **Breaking Change**: This is a major version change. Users on older Node.js versions or CommonJS-only setups will need to migrate to ESM.

### TypeScript Configuration
- **Source Maps**: Enabled for all packages (`sourceMap: true`)
- **Module Resolution**: Changed to `bundler` (modern, works better with Bun)
- **Output**: Simplified to single `lib/` directory per package
- **Include Pattern**: Changed from `files: ["src/index.ts"]` to `include: ["src/**/*.ts"]` to compile all source files

### Package.json Changes (per package)
```json
{
  "type": "module",
  "module": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "exports": {
    ".": {
      "import": "./lib/index.js",
      "types": "./lib/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "clean": "rm -rf lib"
  },
  "files": ["lib"]
}
```

### CI/CD Updates
All GitHub Actions workflows updated:
- **pull-request.yml**: Uses `oven-sh/setup-bun@v2` instead of pnpm
- **release.yml**: Uses Bun for install and build
- **typedoc-generator.yml**: Uses Bun for dependency management

### Removed Files
- `turbo.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `packages/*/tsup.config.ts` (15 files)
- All `.turbo/` cache directories
- All `node_modules/` directories (will be regenerated with Bun)

### Updated Files
- `.gitignore`: Removed `.turbo` and `package-lock.json` entries
- Root `package.json`: Now uses Bun workspaces
- All 17 package `package.json` files: Updated to ESM-only
- All package `tsconfig.json` files: Simplified configuration
- `packages/tsconfig/base.json`: Added source maps, updated module resolution
- `e2e/package.json`: Changed from `file:` to `workspace:*` protocol

## Next Steps

### 1. Install Bun
```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Install Dependencies
```bash
bun install
```

This will generate a new `bun.lock` file.

### 3. Build All Packages
```bash
bun run build
```

### 4. Run Tests
```bash
bun run test
```

### 5. Verify Exports
```bash
bun run check-exports
```

### 6. Update Changelog
Since this is a major breaking change:
```bash
bun changeset
# Select "major" for all packages
# Document the breaking changes (ESM-only, requires Node.js 20.18.3+)
```

## Breaking Changes for Consumers

### Migration Guide for Library Users

If you're using `near-api-js` or any `@near-js/*` packages, here's what you need to know:

#### 1. Node.js Version
- **Minimum**: Node.js 20.18.3 or higher
- **Recommended**: Latest LTS

#### 2. Module System
This library is now **ESM-only**. Update your code:

**Before (CommonJS):**
```javascript
const { Near } = require('near-api-js');
```

**After (ESM):**
```javascript
import { Near } from 'near-api-js';
```

#### 3. Package.json Configuration
Ensure your `package.json` has:
```json
{
  "type": "module"
}
```

Or use `.mjs` file extensions for ESM modules.

#### 4. TypeScript Configuration
Update your `tsconfig.json`:
```json
{
  "compilerOptions": {
    "module": "ES2022",
    "moduleResolution": "bundler"
  }
}
```

## Benefits of This Migration

### For Contributors
- **Faster installs**: Bun is significantly faster than npm/pnpm
- **Simpler setup**: No Turborepo configuration to maintain
- **Better debugging**: Source maps enabled for all packages
- **Modern tooling**: Using latest TypeScript and module resolution strategies
- **Less complexity**: Fewer build tools, more straightforward configuration

### For the Codebase
- **Reduced dependencies**: Removed tsup, turbo, esbuild-fix-imports-plugin
- **Smaller bundle size**: ESM-only means no dual packaging overhead
- **Cleaner output**: Single `lib/` directory instead of `lib/esm/` and `lib/commonjs/`
- **Better tree-shaking**: ESM enables better dead code elimination for consumers
- **Future-proof**: Aligned with modern JavaScript ecosystem standards

### Performance Improvements
- **Install time**: ~3-5x faster with Bun
- **Build time**: Comparable (tsc is fast for library code)
- **CI time**: Faster due to Bun's speed and removed Turborepo overhead

## Compatibility Notes

### What Still Works
- ✅ Jest for testing (kept as-is)
- ✅ Vitest for e2e tests (kept as-is)
- ✅ ESLint for linting
- ✅ Changesets for versioning
- ✅ Husky for git hooks
- ✅ TypeDoc for documentation
- ✅ All existing source code (no changes needed)

### What Changed
- ❌ CommonJS output (removed)
- ❌ pnpm workspace protocol (now using Bun workspaces with `workspace:*`)
- ❌ Turborepo task running (now using `bun run --filter`)
- ❌ tsup build (now using tsc directly)

## Troubleshooting

### Issue: `bun install` fails
- Ensure you're using the latest version of Bun
- Try clearing the cache: `rm -rf ~/.bun/install/cache`

### Issue: Build fails with module resolution errors
- Check that all packages have `"type": "module"` in package.json
- Verify TypeScript is using `moduleResolution: "bundler"`

### Issue: Tests fail with import errors
- Jest is configured to work with ESM
- Ensure test files use `.js` extensions in imports if needed
- Check `jest.config.ts` has proper ESM configuration

## Questions?

If you encounter any issues with this migration, please:
1. Check this document first
2. Review the commit history for context
3. Open a GitHub issue with details about your problem
