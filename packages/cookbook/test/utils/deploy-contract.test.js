const { deployContract } = require('../../src/utils/deploy-contract');
const { buildTestKeyStore } = require('../utils');

describe('deployContract', () => {
    let keyStore;

    beforeAll(async () => {
        keyStore = await buildTestKeyStore();
    });

    it('noop', () => {
        expect(1).toBe(1);
    });
});
