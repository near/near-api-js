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

export default defineConfig([
    {
        entry,
        format: ['esm', 'cjs'],
        outDir: 'lib',
        dts: true,
        clean: true,
        splitting: false,
        sourcemap: true,
        target: 'es2020',
        outExtension({ format }) {
            return { js: format === 'cjs' ? '.cjs' : '.js' };
        },
    },
    {
        entry: { 'near-api-js.iife': 'src/index.ts' },
        format: ['iife'],
        globalName: 'nearApi',
        outDir: 'dist',
        clean: true,
        splitting: false,
        sourcemap: true,
        target: 'es2020',
        platform: 'browser',
        outExtension() {
            return { js: '.js' };
        },
        esbuildOptions(options) {
            options.alias = {
                ...options.alias,
                util: './src/browser-util.ts',
            };
        },
    },
]);
