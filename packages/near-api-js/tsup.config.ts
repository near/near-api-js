import { defineConfig } from "tsup";

export default defineConfig([
    // CommonJS build
    {
        entry: ["src/index.ts"],
        format: ["cjs"],
        outDir: "dist",
        clean: true,
        dts: true,
        sourcemap: true,
        target: "es2022",
        bundle: true,
        splitting: false,
        // Don't treat any modules as external except these specific ones
        noExternal: [/^@near-js\//],
        // External dependencies - don't bundle these
        external: [
            "borsh",
            "@noble/curves",
            "@noble/hashes",
            "node-fetch",
            "depd",
            "http-errors",
            "near-abi",
            "lru_map",
            "is-my-json-valid",
            "@hexagon/base64",
            "asn1-parser",
            "buffer",
            "cbor-js",
            "fido2-lib",
            "events",
            "randombytes",
            "secp256k1",
        ],
        outExtension: () => ({ js: ".cjs" }),
    },
    // ESM build
    {
        entry: ["src/index.ts"],
        format: ["esm"],
        outDir: "dist",
        dts: true,
        sourcemap: true,
        target: "es2022",
        bundle: true,
        splitting: false,
        // Don't treat any modules as external except these specific ones
        noExternal: [/^@near-js\//],
        // External dependencies - don't bundle these
        external: [
            "borsh",
            "@noble/curves",
            "@noble/hashes",
            "node-fetch",
            "depd",
            "http-errors",
            "near-abi",
            "lru_map",
            "is-my-json-valid",
            "@hexagon/base64",
            "asn1-parser",
            "buffer",
            "cbor-js",
            "fido2-lib",
            "events",
            "randombytes",
            "secp256k1",
        ],
        outExtension: () => ({ js: ".js" }),
    },
]);
