import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        name: "node",
        root: "tests",
        environment: "node",
        testTimeout: 50000,
        hookTimeout: 120000, // 2 minutes for setup/teardown hooks (Worker.init() takes time)
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
