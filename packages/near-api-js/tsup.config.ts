import { defineConfig } from "tsup";
import {
    fixFolderImportsPlugin,
    fixExtensionsPlugin,
} from "esbuild-fix-imports-plugin";

export default defineConfig([
    {
        splitting: false,
        bundle: true,
        entryPoints: ["src/**/*"],
        format: ["cjs"],
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
        entryPoints: ["src/**/*"],
        format: ["esm"],
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
