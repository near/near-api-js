import { defineConfig } from "tsup";
import {
    fixFolderImportsPlugin,
    fixExtensionsPlugin,
} from "esbuild-fix-imports-plugin";

export default defineConfig([
    {
        splitting: false,
        bundle: true,
        entryPoints: ["src/index.ts"],
        format: "cjs" as const,
        outDir: "lib/commonjs",
        clean: true,
        dts: true,
        target: "es2022",
        esbuildPlugins: [fixFolderImportsPlugin(), fixExtensionsPlugin()],
        loader: {
            ".json": "json",
        },
    },
    {
        splitting: false,
        bundle: true,
        entryPoints: ["src/index.ts"],
        format: "esm" as const,
        outDir: "lib/esm",
        clean: false,
        dts: true,
        target: "es2022",
        esbuildPlugins: [fixFolderImportsPlugin(), fixExtensionsPlugin()],
        loader: {
            ".json": "json",
        },
    },
]);
