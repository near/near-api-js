const fs = require('fs');
const path = require('path');

const { sendTransactions } = require('../../src/transactions/batch-transactions');
const { createTestAccount } = require('../utils');

describe('sendTransactions', () => {
    let account, keyStore, networkId, nodeUrl;

    beforeAll(async () => {
        ({
            account,
            keyStore,
            networkId,
            nodeUrl,
        } = await createTestAccount());
    });

    it('batches transactions', async () => {
        const response = await sendTransactions({
            contractName: account.accountId,
            contractWasm: fs.readFileSync(path.join(__dirname, '../../contracts/staking_pool_factory.wasm')),
            keyStore,
            networkId,
            nodeUrl,
            whitelistAccountId: 'whitelisted-account.test.near'
        });

        expect(response.receipts_outcome.length).toBe(2);
    });
});
