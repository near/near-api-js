import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['test/**/*.test.ts', 'test/**/*.spec.ts'],
        exclude: [
            'e2e/**/*',
            'node_modules/**/*',
            // Exclude sandbox/integration tests that require near-workspaces
            'test/accounts/account.test.ts',
            'test/accounts/account.access_key.test.ts',
            'test/accounts/promise.test.ts',
            'test/accounts/providers.test.ts',
        ],
        testTimeout: 50000,
    },
});
