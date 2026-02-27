import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    input: 'https://raw.githubusercontent.com/near/nearcore/master/chain/jsonrpc/openapi/openapi.json',
    output: {
        format: 'biome',
        lint: 'biome',
        path: './src/rpc',
        clean: true,
    },
    plugins: [
        {
            enums: 'javascript',
            name: '@hey-api/typescript',
            bigint: true,
        },
    ],
});
