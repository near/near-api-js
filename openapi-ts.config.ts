import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    input: 'https://raw.githubusercontent.com/near/nearcore/2.13.4/chain/jsonrpc/openapi/openapi.json',
    parser: {
        patch: {
            schemas: {
                // the spec adds an empty `{}` variant (waitUntil NONE) that generates `| unknown`
                // and erases the whole union, keep the previous shape
                RpcTransactionResponse: (schema) => {
                    if ('anyOf' in schema && schema.anyOf) {
                        schema.anyOf = schema.anyOf.filter((s) => Object.keys(s).length > 0);
                    }
                },
            },
        },
    },
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
