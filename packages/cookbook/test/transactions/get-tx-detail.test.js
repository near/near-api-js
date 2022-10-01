const { getTransactions } = require('../../src/transactions/get-tx-detail');
const { buildTestKeyStore } = require('../utils');

describe('getTransactions', () => {
    let keyStore;

    beforeAll(async () => {
        keyStore = await buildTestKeyStore();
    });

    it('noop', () => {
        expect(1).toBe(1);
    });
});
