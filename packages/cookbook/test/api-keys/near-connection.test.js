const { getAccountStateWithApiKey } = require('../../src/api-keys/near-connection');
const { NETWORK_ID, RPC_ENDPOINT_URL } = require('../utils');

describe('getAccountStateWithApiKey', () => {
    it('gets network status', async () => {
        const { block_height } = await getAccountStateWithApiKey({
            accountId: 'near',
            apiKey: 'TEST_API_KEY',
            networkId: NETWORK_ID,
            nodeUrl: RPC_ENDPOINT_URL,
        });

        expect(block_height).toBeGreaterThan(0);
    });
});
