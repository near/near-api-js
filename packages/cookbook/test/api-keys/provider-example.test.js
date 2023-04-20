const { getNetworkStatusWithApiKey } = require('../../src/api-keys/provider-example');
const { RPC_ENDPOINT_URL } = require('../utils');

describe('getNetworkStatusWithApiKey', () => {
    it('gets network status', async () => {
        const { chain_id } = await getNetworkStatusWithApiKey({
            apiKey: 'TEST_API_KEY',
            nodeUrl: RPC_ENDPOINT_URL,
        });

        expect(chain_id).toBe('localnet');
    });
});
