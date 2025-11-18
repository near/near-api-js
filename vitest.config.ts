import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['test/**/*.test.ts', 'test/**/*.spec.ts', 'e2e/**/*.test.ts'],
        exclude: ['node_modules/**/*'],
        testTimeout: 50000,
    },
});
