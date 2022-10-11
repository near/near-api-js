const { getTransactionStatus } = require('../../src/transactions/get-tx-status');
const { deployGuestbook } = require('../utils');

describe('getTransactionStatus', () => {
    let account, nodeUrl, transaction;

    beforeAll(async () => {
        ({
            account,
            nodeUrl,
            transaction,
        } = await deployGuestbook());
    });

    it('gets transaction status', async () => {
        const transactionStatus = await getTransactionStatus({
            accountId: account.accountId,
            nodeUrl,
            txHash: transaction.hash,
        });

        expect(transactionStatus.transaction.hash).toBe(transaction.hash);
    });
});
