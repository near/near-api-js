const { getAccountStateWithApiKey } = require('../../src/api-keys/near-connection');
const { buildTestKeyStore } = require('../utils');

describe('getAccountStateWithApiKey', () => {
    let keyStore;

    beforeAll(async () => {
        keyStore = await buildTestKeyStore();
    });

    it('noop', () => {
        expect(1).toBe(1);
    });
});
