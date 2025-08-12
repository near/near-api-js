import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        root: "tests",
        environment: "node",
        testTimeout: 30_000,
        hookTimeout: 30_000,
        allowOnly: false,
        globals: true,
        server: { deps: { fallbackCJS: false } },
        include: ["**/*.test.ts"],
        exclude: ["**/node_modules/**", "**/lib/**"],
        typecheck: {
            enabled: true,
            include: ["**/*.test-d.ts"],
            exclude: ["**/node_modules/**", "**/lib/**"],
            ignoreSourceErrors: true,
        },
    },
});
