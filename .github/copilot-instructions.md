# NEAR JavaScript API - Copilot Instructions

## Repository Overview

This is the **NEAR JavaScript API** (`near-api-js`), a complete TypeScript library for interacting with the NEAR blockchain. It works in both browser and Node.js environments. The repository is a **monorepo** using **pnpm workspaces** containing 16+ packages organized in an onion architecture.

**Key Stats:**
- Language: TypeScript 5.4.5
- Package Manager: pnpm 10.4.1 (required - enforced by preinstall)
- Node Version: >=20.18.3 (required)
- Build System: Turborepo 2.4.4
- Test Framework: Jest (unit tests), Vitest (e2e tests)
- Monorepo: Yes (16 packages under `packages/`)

## Critical Build & Environment Requirements

### ALWAYS Follow This Order:

1. **First Time Setup:**
   ```bash
   # Install pnpm globally if not present
   npm install -g pnpm@10.4.1
   
   # Install dependencies (ALWAYS run this after checkout)
   pnpm install
   
   # Build all packages
   pnpm build
   ```

2. **After Making Changes:**
   ```bash
   # Build (required before testing)
   pnpm build
   
   # Lint your changes
   pnpm lint
   
   # Run unit tests
   pnpm test
   
   # Check package exports
   pnpm check-exports
   ```

3. **Before Final Submission:**
   ```bash
   # Run full CI pipeline locally
   pnpm install
   pnpm build
   pnpm lint
   pnpm test
   pnpm check-exports
   ```

### Critical Build Notes:

- **ALWAYS run `pnpm install` before building** - the build depends on workspace linking
- **NEVER use npm or yarn** - pnpm is enforced and npm/yarn will fail
- **Build takes ~40-60 seconds** - be patient, timeout should be at least 120 seconds
- **Test takes ~3-5 minutes** - set timeout to at least 300 seconds
- **Dependencies between packages**: Build order managed by Turborepo via `turbo.json`
- **Clean builds**: Use `pnpm clean` to remove all `lib/` directories (takes ~1-2s)
- After `pnpm clean`, **MUST run `pnpm build`** before running tests

### E2E Tests (Special Handling):

E2E tests are in the `e2e/` directory and **intentionally excluded from workspace**:

```bash
cd e2e
pnpm install --ignore-workspace  # Required: --ignore-workspace flag is CRITICAL
pnpm test                        # Runs Vitest tests
```

**Important**: The `--ignore-workspace` flag ensures packages install as standalone builds, not symlinked workspace packages. This simulates real-world usage.

## Package Architecture

### Core Packages (Onion Layers):

**Inner Layer (Core):**
- `types` - Common TypeScript types and interfaces
- `utils` - Utility functions and helpers

**Middle Layer:**
- `crypto` - Cryptographic operations (key pairs, signing)
- `providers` - RPC communication with NEAR network
- `transactions` - Transaction composition and signing

**Outer Layer:**
- `accounts` - Account creation and management
- `signers` - Signing interfaces and implementations
- `keystores*` - Key persistence (3 packages: base, browser, node)
- `tokens` - Token operations (FT/NFT)
- `wallet-account` - Browser wallet integration
- `client` - High-level client API

**Specialized:**
- `biometric-ed25519` - Biometric authentication
- `iframe-rpc` - iFrame RPC communication
- `cookbook` - Code examples and recipes
- `near-api-js` - Main package (re-exports all packages)

### Key Configuration Files:

**Monorepo Root:**
- `package.json` - Root package with scripts (build, test, lint, clean)
- `pnpm-workspace.yaml` - Defines workspace packages
- `turbo.json` - Turborepo task orchestration config
- `typedoc.json` - TypeDoc documentation generation
- `.eslintrc.base.yml` - Base ESLint config (JavaScript)
- `.eslintrc.ts.yml` - TypeScript ESLint config (extends base)
- `commitlint.config.js` - Commit message linting (conventional commits)

**Package-Level (repeated in each package):**
- `package.json` - Package metadata and scripts
- `tsconfig.json` - TypeScript config (extends `tsconfig/esm.json`)
- `tsup.config.ts` - Build config (creates ESM + CJS outputs)
- `jest.config.ts` - Jest test configuration

**Important Paths:**
- Source: `packages/*/src/**/*.ts`
- Tests: `packages/*/test/**/*.test.ts`
- Built output: `packages/*/lib/` (ESM in `lib/esm/`, CJS in `lib/commonjs/`)
- E2E tests: `e2e/tests/**/*.test.ts`

## CI/CD Workflows

### Pull Request Checks (`.github/workflows/pull-request.yml`):

Runs on every PR and push to main/master:
1. Setup pnpm 10.4.1 and Node 20.18.3
2. `pnpm install`
3. `pnpm build` 
4. `pnpm lint`
5. `pnpm test` (unit tests)
6. `pnpm check-exports` (validates package exports with attw)
7. `pnpm it --ignore-workspace --dir e2e` (e2e tests)

**All steps must pass** - replicate locally before submitting PR.

### Release Workflow (`.github/workflows/release.yml`):

Uses **Changesets** for versioning and publishing:
- Triggered on push to `master`
- Publishes to NPM when changesets are present
- Creates GitHub releases automatically

### Git Hooks (Husky):

- **commit-msg**: Validates commit messages with commitlint (conventional commits format)
- **pre-push**: Runs `pnpm lint` before push

## Common Commands

```bash
# Development workflow
pnpm install          # Install dependencies
pnpm build           # Build all packages (40-60s)
pnpm lint            # Lint all packages (warnings OK, no errors)
pnpm lint:fix        # Auto-fix linting issues
pnpm test            # Run unit tests (3-5 min)
pnpm check-exports   # Validate package exports

# Maintenance
pnpm clean           # Remove all lib/ directories
pnpm autoclave       # Nuclear clean (removes node_modules, lib/, dist/, etc.)

# Package versioning (when making changes)
pnpm changeset       # Create a changeset (version bump + changelog entry)

# Documentation
pnpm docs:generate   # Generate TypeDoc documentation
```

## Making Code Changes

### File Organization:

- **Source files**: `packages/[package-name]/src/`
- **Test files**: `packages/[package-name]/test/` (NOT `__tests__/`)
- **Build output**: `packages/[package-name]/lib/` (auto-generated, in .gitignore)

### Build System Details:

- **tsup** builds each package with dual ESM/CJS outputs
- **Turborepo** manages build dependencies and caching
- Packages with dependencies build in correct order automatically
- Build outputs to: `lib/esm/` (ESM) and `lib/commonjs/` (CJS)

### Testing Guidelines:

- Use Jest for unit tests in packages
- Test files: `*.test.ts` in `test/` directory
- Jest config: Standard config in each package's `jest.config.ts`
- Coverage: Collected automatically (output in `coverage/`)
- E2E tests use Vitest with near-workspaces (NEAR sandbox)

### Linting:

- ESLint with TypeScript plugin
- Config: `.eslintrc.ts.yml` for TS, `.eslintrc.base.yml` for JS
- **Warnings are acceptable** (e.g., `@typescript-eslint/no-explicit-any`)
- **Errors must be fixed**
- Indentation: 4 spaces
- Quotes: Single quotes
- Semicolons: Required
- Line endings: Unix (LF)

## Known Issues & Workarounds

1. **Build warnings about `@near-js/cookbook#build` outputs** - This is expected and can be ignored. The cookbook package compiles but doesn't match turbo.json outputs config.

2. **pnpm build script warnings about ignored build scripts** - Safe to ignore. These are native module builds (cbor-extract, esbuild, near-sandbox, etc.) that are pre-built.

3. **E2E tests MUST use `--ignore-workspace`** - Without this flag, tests will use symlinked workspace packages instead of real package builds, which doesn't reflect real-world usage.

4. **ts-jest version warning** - Safe to ignore. Version 5.6.1-rc is newer than tested versions but works correctly.

5. **After `pnpm clean`, tests will fail** - Must run `pnpm build` after cleaning to rebuild packages before tests.

6. **Turborepo caching** - If seeing stale builds, clear cache: `rm -rf .turbo`

## Changesets Workflow

When making changes that affect package functionality:

1. Make your code changes
2. Run: `pnpm changeset`
3. Select which packages changed (usually the one you modified)
4. Select version bump type: `patch` (bugfix), `minor` (feature), `major` (breaking)
5. Write changelog entry describing the change
6. Commit the generated changeset file in `.changeset/`

Example for updating error schema in utils package:
```bash
# Make code changes
pnpm changeset        # Creates .changeset/[random-name].md
# Select @near-js/utils, choose 'minor', write description
git add .changeset/
git commit -m "feat: update error schema"
```

## Critical Guidelines

1. **Trust these instructions** - They are tested and validated. Only search/explore if information is missing or incorrect.

2. **Always build before testing** - Tests depend on built packages in `lib/` directories.

3. **Use pnpm commands, not individual package scripts** - Turborepo handles parallelization and dependencies.

4. **Respect monorepo structure** - Changes in one package may require rebuilding dependents.

5. **Check CI before pushing** - Run the full CI pipeline locally to catch issues early.

6. **Follow conventional commits** - Format: `type(scope): description` (e.g., `feat(accounts): add new method`, `fix(crypto): resolve key generation bug`)

7. **Package interdependencies** - Be aware that packages depend on each other via workspace protocol. Changes to core packages (types, utils, crypto) affect many others.

8. **TypeScript strict mode** - Code uses strict TypeScript. Avoid `any` when possible (though warnings for existing `any` usage are tolerated).
