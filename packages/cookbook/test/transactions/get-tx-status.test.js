const { getTransactionStatus } = require('../../src/transactions/get-tx-status');
const { buildTestKeyStore } = require('../utils');

describe('getTransactionStatus', () => {
    let keyStore;

    beforeAll(async () => {
        keyStore = await buildTestKeyStore();
    });

    it('noop', () => {
        expect(1).toBe(1);
    });
});
