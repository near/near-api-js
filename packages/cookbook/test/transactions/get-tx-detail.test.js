const { DEFAULT_FUNCTION_CALL_GAS } = require('near-api-js');

const { getTransactions } = require('../../src/transactions/get-tx-detail');
const { deployGuestbook } = require('../utils');

describe('getTransactions', () => {
    let account, networkId, nodeUrl;

    beforeAll(async () => {
        ({
            account,
            networkId,
            nodeUrl,
        } = await deployGuestbook());

        // wait for next block
        await new Promise((resolve) => setTimeout(resolve, 3000));
    });

    it('gets transactions for contract between specified blocks', async () => {
        const getBlock = () => account.connection.provider.block({ finality: 'final' });
        const { header: { hash: startBlock } } = await getBlock();

        const methodName = 'addMessage';
        for (let i = 0; i < 5; i++) {
            await account.functionCall({
                contractId: account.accountId,
                methodName,
                args: { text: `iteration-${i}` },
                gas: DEFAULT_FUNCTION_CALL_GAS,
                attachedDeposit: '0',
            });
        }

        // wait for next block
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const { header: { hash: endBlock } } = await getBlock();
        const { transactionLinks, transactions } = await getTransactions({
            accountId: account.accountId,
            endBlock,
            networkId,
            nodeUrl,
            startBlock,
        });

        expect(transactions.length).toBe(5);
        transactions.forEach(({ signer_id }) => expect(signer_id).toBe(account.accountId));

        transactionLinks.forEach(({ method }) => {
            expect(method).toBe(methodName);
        });
    });
});
