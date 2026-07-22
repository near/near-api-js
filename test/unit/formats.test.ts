import { describe, expect, it } from 'vitest';

describe('published formats', () => {
    it('loads the ESM and CommonJS bundles', async () => {
        const esm = await import('../../lib/index.js');
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const cjs = require('../../lib/index.cjs');

        expect(esm.KeyPair).toBeTypeOf('function');
        expect(cjs.KeyPair).toBeTypeOf('function');
    });
});
