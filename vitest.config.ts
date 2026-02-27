import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['test/**/*.test.ts', 'test/**/*.spec.ts'],
        exclude: ['node_modules/**/*'],
        typecheck: {
            enabled: true,
            include: ['**/*.test-d.ts'],
            exclude: ['**/node_modules/**', '**/lib/**', '**/e2e/**'],
            ignoreSourceErrors: true,
        },
        testTimeout: 50000,
        hookTimeout: 120000, // 2 minutes for setup/teardown hooks
        coverage: {
            enabled: true,
            include: ['src/**/*.ts'],
            exclude: ['src/**/index.ts'],
        },
    },
});
