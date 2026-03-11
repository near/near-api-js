import path from 'node:path';
import type { Plugin } from 'esbuild';
import { defineConfig } from 'tsup';

// @ts-expect-error — importing package.json for banner metadata
import pkg from './package.json';

/**
 * esbuild plugin: redirect providers/errors/parse.ts to the lightweight shim
 * in the IIFE bundle. The full parse module pulls in 100+ error classes (~62KB)
 * that are only needed for typed catch() blocks. The shim returns generic
 * RpcError instances with descriptive messages, preserving InvalidNonceError
 * for the nonce-retry logic in account.ts.
 */
function errorParseLitePlugin(): Plugin {
    const shimPath = path.resolve('src/shims/error-parse-lite.ts');
    const parseFile = path.sep + path.join('providers', 'errors', 'parse');

    return {
        name: 'error-parse-lite',
        setup(build) {
            build.onResolve({ filter: /errors\/parse/ }, (args) => {
                if (args.kind === 'import-statement') {
                    const resolved = path.resolve(path.dirname(args.importer), args.path);
                    // Normalise away the extension (.js / .ts) for matching
                    const noExt = resolved.replace(/\.(js|ts)$/, '');
                    if (noExt.endsWith(parseFile)) {
                        return { path: shimPath };
                    }
                }
                return undefined;
            });
        },
    };
}

const globalName = 'nearApi';

/**
 * IIFE footer: freeze the global binding so downstream code cannot accidentally
 * reassign `window.nearApi`. Matches the js-monorepo pattern used by
 * @fastnear/utils, @fastnear/borsh, etc.
 */
const footerRedefiningGlobal = `
try {
  Object.defineProperty(globalThis, '${globalName}', {
    value: ${globalName},
    enumerable: true,
    configurable: false,
  });
} catch (error) {
  console.error('Could not define global "${globalName}" object', error);
  throw error;
}
`;

export default defineConfig([
    // 1) CommonJS (CJS) build — unbundled, preserves module structure
    {
        entry: ['src/**/*.ts', '!src/**/*.test.ts', '!src/shims/**'],
        outDir: 'dist/cjs',
        format: ['cjs'],
        bundle: false,
        splitting: false,
        clean: true,
        keepNames: true,
        dts: {
            resolve: true,
            entry: [
                'src/index.ts',
                'src/tokens/index.ts',
                'src/tokens/mainnet/index.ts',
                'src/tokens/testnet/index.ts',
                'src/nep413/index.ts',
                'src/seed-phrase/index.ts',
                'src/rpc-errors/index.ts',
            ],
        },
        sourcemap: true,
        minify: false,
        banner: {
            js:
                `/* near-api-js - CJS (${pkg.name} version ${pkg.version}) */\n` +
                `/* https://www.npmjs.com/package/${pkg.name}/v/${pkg.version} */`,
        },
    },

    // 2) ESM build — unbundled, preserves module structure
    {
        entry: ['src/**/*.ts', '!src/**/*.test.ts', '!src/shims/**'],
        outDir: 'dist/esm',
        format: ['esm'],
        shims: true,
        bundle: false,
        splitting: false,
        clean: true,
        keepNames: true,
        dts: {
            resolve: true,
            entry: [
                'src/index.ts',
                'src/tokens/index.ts',
                'src/tokens/mainnet/index.ts',
                'src/tokens/testnet/index.ts',
                'src/nep413/index.ts',
                'src/seed-phrase/index.ts',
                'src/rpc-errors/index.ts',
            ],
        },
        sourcemap: true,
        minify: false,
        banner: {
            js:
                `/* near-api-js - ESM (${pkg.name} version ${pkg.version}) */\n` +
                `/* https://www.npmjs.com/package/${pkg.name}/v/${pkg.version} */`,
        },
    },

    // 3) IIFE build — fully bundled for browser <script> tags
    {
        entry: {
            browser: 'src/index.ts',
        },
        outDir: 'dist/umd',
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
        banner: {
            js:
                `/* near-api-js - IIFE/UMD (${pkg.name} version ${pkg.version}) */\n` +
                `/* https://www.npmjs.com/package/${pkg.name}/v/${pkg.version} */`,
        },
        // Browser shims: replace heavy Node-only deps with lightweight stubs
        esbuildOptions(options) {
            options.alias = {
                ...options.alias,
                // is-my-json-valid + transitive deps add ~44KB for ABI schema validation.
                // In the browser IIFE, validation is a no-op — use the full library via ESM/CJS.
                'is-my-json-valid': './src/shims/json-validator-noop.ts',
                // is-my-json-valid uses Node's 'util' module (util.format for error messages)
                util: './src/shims/util.ts',
            };
        },
        esbuildPlugins: [
            // Replaces the full error parser (~62KB of error class hierarchy) with a
            // lightweight shim that returns generic RpcError with descriptive messages.
            errorParseLitePlugin(),
        ],
        footer: {
            js: footerRedefiningGlobal,
        },
    },
]);
