import { expect, test, vi } from 'vitest';
import { baseEncode, JsonRpcProvider } from '../../../src/index.js';

test.each([0, 34, 255])('global contract queries encode raw hashes as base58 (byte %i)', async (byte) => {
    const hash = new Uint8Array(32).fill(byte);
    const provider = new JsonRpcProvider({ url: 'http://localhost:3030' });
    const response = {
        code_base64: 'AAE=',
        hash: baseEncode(hash),
        block_hash: 'block',
        block_height: 1,
    };
    const query = vi.spyOn(provider, 'query').mockResolvedValue(response);
    for (const codeHash of [hash, baseEncode(hash)]) {
        const result = await provider.viewGlobalContractCode({ identifier: { codeHash } });
        expect(query).toHaveBeenLastCalledWith({
            finality: 'optimistic',
            request_type: 'view_global_contract_code',
            code_hash: baseEncode(hash),
        });
        expect(result.code).toEqual(new Uint8Array([0, 1]));
    }
});
