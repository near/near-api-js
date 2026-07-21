import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

describe('published formats', () => {
    it('loads the ESM, CommonJS, and IIFE bundles', async () => {
        const esm = await import('../../lib/index.js');
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const cjs = require('../../lib/index.cjs');
        const context: Record<string, unknown> = { ArrayBuffer, BigInt, TextDecoder, TextEncoder, Uint8Array };
        context.globalThis = context;
        runInNewContext(await readFile('dist/near-api-js.iife.js', 'utf8'), context);

        expect(esm.KeyPair).toBeTypeOf('function');
        expect(cjs.KeyPair).toBeTypeOf('function');
        expect((context.nearApi as { KeyPair: unknown }).KeyPair).toBeTypeOf('function');
    });
});
