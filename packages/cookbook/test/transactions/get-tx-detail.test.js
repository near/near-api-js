const { getTransactions } = require('../../src/transactions/get-tx-detail');

describe('getTransactions', () => {
    it('gets transactions for contract between specified blocks', async () => {
        const contractId = 'relayer.ropsten.testnet';
        const { transactionLinks, transactions } = await getTransactions({
            accountId: contractId,
            endBlock: '8aEcKhF7N1Jyw84e6vHW6Hzp3Ep7mSXJ6Rvnsy5qGJPF',
            networkId: 'testnet',
            nodeUrl: 'https://archival-rpc.testnet.near.org',
            startBlock: 'GZ8vKdcgsavkEndkDWHCjuhyqSR2TGnp9VDZbTzd6ufG',
        });

        expect(transactionLinks.length).toBe(4);
        expect(transactions.length).toBe(4);
        transactions.forEach(({ signer_id }) => expect(signer_id).toBe(contractId));
    });
});
