import path from "path";
import { defineConfig } from "tsup";
import {
    fixFolderImportsPlugin,
    fixExtensionsPlugin,
} from "esbuild-fix-imports-plugin";

const globalName = 'nearApi';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default defineConfig([
    {
        splitting: false,
        bundle: false,
        entryPoints: ["src/**/*.ts", "!src/shims/**"],
        format: ["cjs"],
        outDir: "lib",
        clean: true,
        dts: true,
        target: "es2022",
        esbuildPlugins: [fixFolderImportsPlugin(), fixExtensionsPlugin()],
    },
    {
        entry: { 'browser-index': 'src/browser-index.ts' },
        outDir: 'lib/iife',
        format: ['iife'],
        globalName,
        bundle: true,
        splitting: false,
        clean: true,
        keepNames: true,
        dts: false,
        sourcemap: true,
        minify: false,
        platform: 'browser',
        target: 'es2022',
        esbuildOptions(options) {
            options.alias = {
                'util': path.resolve(__dirname, 'src/shims/util.ts'),
            };
        },
        footer: {
            js: `try {\n  Object.defineProperty(globalThis, '${globalName}', {\n    value: ${globalName},\n    enumerable: true,\n    configurable: false,\n  });\n} catch (e) {\n  console.warn('Could not freeze globalThis.${globalName}', e);\n}`,
        },
    },
]);
