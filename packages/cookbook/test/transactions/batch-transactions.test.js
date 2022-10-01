const { sendTransactions } = require('../../src/transactions/batch-transactions');
const { buildTestKeyStore } = require('../utils');

describe('sendTransactions', () => {
    let keyStore;

    beforeAll(async () => {
        keyStore = await buildTestKeyStore();
    });

    it('noop', () => {
        expect(1).toBe(1);
    });
});
