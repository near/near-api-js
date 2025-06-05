import { defineConfig } from "tsup";
import { fixFolderImportsPlugin, fixExtensionsPlugin } from 'esbuild-fix-imports-plugin';

export default defineConfig([{
    splitting: false,
    bundle: false,
    entryPoints: ["src/**/*"],
    format: ["cjs"],
    outDir: "lib/commonjs",
    clean: true,
    dts: true,
    target: "es2022",
    esbuildPlugins: [fixFolderImportsPlugin(), fixExtensionsPlugin()],
    loader: {
        ".json": "copy",
    }
}, {
    splitting: false,
    bundle: false,
    entryPoints: ["src/**/*"],
    format: ["esm"],
    outDir: "lib/esm",
    dts: true,
    clean: true,
    target: "es2022",
    esbuildPlugins: [fixFolderImportsPlugin(), fixExtensionsPlugin()],
    loader: {
        ".json": "copy",
    }
}]);
