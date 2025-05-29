import { defineConfig } from "tsup";
import { fixImportsPlugin } from 'esbuild-fix-imports-plugin';

export default defineConfig([{
    splitting: true,
    bundle: false,
    entryPoints: ["src/**/*.ts"],
    format: ["cjs"],
    outDir: "lib/commonjs",
    clean: true,
    dts: true,
    target: "es2022",
    esbuildPlugins: [fixImportsPlugin()],
}, {
    splitting: true,
    bundle: false,
    entryPoints: ["src/**/*.ts"],
    format: ["esm"],
    outDir: "lib/esm",
    dts: true,
    clean: true,
    target: "es2022",
    esbuildPlugins: [fixImportsPlugin()],
}]);
