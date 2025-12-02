# E2E Tests for near-api-js

## Overview

This directory contains end-to-end (e2e) tests for the near-api-js library. These tests validate the library's functionality against a local NEAR sandbox environment.

## Test Coverage

The e2e test suite includes comprehensive coverage for:

### Account Operations (`tests/account/`)
- **account-operations.test.ts**: Tests for account creation, deletion, transfers, and state management
  - Creating accounts with different key types (ED25519, SECP256K1)
  - Transferring NEAR tokens between accounts
  - Deleting accounts
  - Getting account state and details

- **access-keys.test.ts**: Tests for access key management
  - Adding full access keys
  - Adding function call access keys
  - Deleting access keys
  - Managing multiple keys on the same account

### Contract Operations (`tests/contract/`)
- **contract-operations.test.ts**: Tests for smart contract deployment and interaction
  - Deploying contracts
  - Calling view methods
  - Calling change methods
  - Using TypedContract for type-safe interactions
  - Handling payable methods
  - Batch contract operations

### Transaction Operations (`tests/transactions/`)
- **transaction-operations.test.ts**: Tests for transaction creation and execution
  - Simple transfer transactions
  - Manual transaction creation and signing
  - Batch transactions with multiple actions
  - Transaction result handling
  - Transactions with different key types
  - Sequential and concurrent transaction handling
  - Transaction failure scenarios

### Provider/RPC Operations (`tests/provider/`)
- **provider-operations.test.ts**: Tests for JSON-RPC provider functionality
  - Getting network status
  - Querying blocks and chunks
  - Querying account information
  - Access key queries
  - Transaction status queries
  - Gas price queries
  - Validator information
  - Network information
  - Protocol configuration
  - Contract state queries
  - Concurrent query handling

### Cryptographic Operations (`tests/crypto/`)
- **crypto-operations.test.ts**: Tests for key management and cryptographic functions
  - ED25519 and SECP256K1 key pair generation
  - Key pair serialization and parsing
  - Message signing and verification
  - KeyPairSigner operations
  - Multiple signers for same account
  - Mixed key types on same account

### Import Tests (`tests/import/`)
- **tokens.test.ts**: Tests for token-related imports and exports

## Prerequisites

To run the e2e tests, you need:

1. **Node.js** >= 20.18.3
2. **pnpm** >= 10.4.1
3. **near-sandbox** binary

### Installing near-sandbox

The tests require the `near-sandbox` binary to run a local NEAR blockchain. The binary should be automatically downloaded during `pnpm install`, but if it fails:

#### Option 1: Use the Setup Script
Run the provided setup script:

```bash
cd e2e
./setup-sandbox.sh
```

This will attempt to download and install the near-sandbox binary from multiple sources.

#### Option 2: Use Environment Variable
Set the `SANDBOX_ARTIFACT_URL` environment variable to point to a valid near-sandbox binary download URL:

```bash
export SANDBOX_ARTIFACT_URL="https://path-to-near-sandbox-binary.tar.gz"
pnpm install
```

#### Option 3: Manual Installation
1. Download the near-sandbox binary for your platform
2. Set the `NEAR_SANDBOX_BIN_PATH` environment variable:

```bash
export NEAR_SANDBOX_BIN_PATH="/path/to/near-sandbox"
```

## Running the Tests

### Install Dependencies

From the root directory:
```bash
pnpm install
```

From the e2e directory:
```bash
cd e2e
pnpm install
```

### Build the Library

Before running e2e tests, build the main library:
```bash
cd ..
pnpm build
```

### Run All E2E Tests

```bash
cd e2e
pnpm test
```

### Run Specific Test Suites

```bash
# Account operations
pnpm test tests/account

# Contract operations
pnpm test tests/contract

# Transactions
pnpm test tests/transactions

# Provider operations
pnpm test tests/provider

# Crypto operations
pnpm test tests/crypto

# Import tests
pnpm test tests/import
```

### Run a Specific Test File

```bash
pnpm test tests/account/account-operations.test.ts
```

## Test Architecture

### Test Structure

Each test file follows this pattern:

1. **Setup** (`beforeAll`): Initialize the near-workspaces Worker and create test accounts
2. **Tests**: Execute individual test cases
3. **Teardown** (`afterAll`): Clean up and shut down the Worker

### Parallel Execution

Tests are designed to run in parallel for better performance:
- Each test suite creates its own isolated accounts
- Tests within a suite share a Worker instance for efficiency
- The vitest configuration allows parallel execution

### Maintainability

Tests are organized by feature area for easy maintenance:
- Clear test descriptions
- Consistent naming conventions
- Proper cleanup in afterAll hooks
- Isolated test accounts to prevent interference

## Debugging

### Enable Verbose Logging

Set environment variables for more detailed output:

```bash
export DEBUG=1
export NEAR_WORKSPACES_DEBUG=1
pnpm test
```

### Run Tests in Watch Mode

```bash
pnpm vitest watch
```

### Test Timeout

The default test timeout is 30 seconds. If tests are timing out, you can increase it in `vitest.config.ts`:

```typescript
export default defineConfig({
    test: {
        testTimeout: 60_000, // 60 seconds
    },
});
```

## Continuous Integration

For CI environments, ensure:

1. near-sandbox binary is available or can be downloaded
2. Tests run with proper timeout values
3. Cleanup happens even on test failures
4. Parallel execution is configured appropriately

## Contributing

When adding new e2e tests:

1. Place tests in the appropriate category directory
2. Follow the existing test structure pattern
3. Ensure tests are independent and can run in parallel
4. Clean up resources in `afterAll` hooks
5. Use descriptive test names
6. Add comments for complex test logic

## Troubleshooting

### near-sandbox binary not found

If you see errors about near-sandbox not being available:

1. Check if the binary is in `~/.near/sandbox/`
2. Verify the `NEAR_SANDBOX_BIN_PATH` environment variable
3. Try setting `SANDBOX_ARTIFACT_URL` and reinstalling
4. Check network connectivity for binary downloads

### Tests timeout

If tests consistently timeout:

1. Increase the timeout in vitest.config.ts
2. Check if the sandbox is running properly
3. Look for network issues
4. Ensure sufficient system resources

### Worker initialization fails

If the Worker fails to initialize:

1. Ensure near-sandbox binary is executable
2. Check system compatibility (Linux x64, macOS x64/arm64)
3. Verify no port conflicts (default port 3030)
4. Check logs for specific error messages

## License

These tests are part of the near-api-js project and follow the same license (MIT AND Apache-2.0).
