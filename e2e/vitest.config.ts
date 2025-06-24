import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    name: "node",
                    root: "tests",
                    environment: "node",
                    testTimeout: 30_000,
                    allowOnly: false,
                    globals: true,
                    server: { deps: { fallbackCJS: false } },
                },
            },
        ],
    },
});
