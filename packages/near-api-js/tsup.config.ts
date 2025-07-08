import { defineConfig } from "tsup";
import {
    fixFolderImportsPlugin,
    fixExtensionsPlugin,
} from "esbuild-fix-imports-plugin";

export default defineConfig([
    {
        splitting: false,
        bundle: false,
        entryPoints: ["src/**/*.ts"],
        format: ["cjs"],
        outDir: "lib",
        clean: true,
        dts: true,
        target: "es2022",
        esbuildPlugins: [fixFolderImportsPlugin(), fixExtensionsPlugin()],
    },
]);
