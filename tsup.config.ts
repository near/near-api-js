import type { Plugin } from 'esbuild';
import { defineConfig } from 'tsup';

const entry = {
    index: 'src/index.ts',
    'tokens/index': 'src/tokens/index.ts',
    'tokens/mainnet/index': 'src/tokens/mainnet/index.ts',
    'tokens/testnet/index': 'src/tokens/testnet/index.ts',
    'nep413/index': 'src/nep413/index.ts',
    'seed-phrase/index': 'src/seed-phrase/index.ts',
    'rpc-errors/index': 'src/rpc-errors/index.ts',
};

/**
 * Keep RPC error constructors behind one runtime module boundary.
 */
const externalizeRpcErrors: Plugin = {
    name: 'externalize-rpc-errors',
    setup(build) {
        build.onResolve({ filter: /(?:^|\/)rpc-errors\/index\.js$/ }, (args) => {
            if (args.kind === 'entry-point') return;

            return {
                path: 'near-api-js/rpc-errors',
                external: true,
            };
        });
    },
};

export default defineConfig({
    entry,
    format: ['esm', 'cjs'],
    outDir: 'lib',
    dts: true,
    clean: true,
    splitting: false,
    esbuildPlugins: [externalizeRpcErrors],
    sourcemap: true,
    target: 'es2020',
    outExtension({ format }) {
        return { js: format === 'cjs' ? '.cjs' : '.js' };
    },
});
