const { getNetworkStatusWithApiKey } = require('../../src/api-keys/provider-example');
const { buildTestKeyStore } = require('../utils');

describe('getNetworkStatusWithApiKey', () => {
    let keyStore;

    beforeAll(async () => {
        keyStore = await buildTestKeyStore();
    });

    it('noop', () => {
        expect(1).toBe(1);
    });
});
