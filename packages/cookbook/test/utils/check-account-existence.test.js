const { accountExists } = require('../../src/utils/check-account-existence');
const { RPC_ENDPOINT_URL } = require('../utils');

describe('accountExists', () => {
    it('returns true for existing accounts', async () => {
        const existingAccount = await accountExists({
            accountId: 'near',
            nodeUrl: RPC_ENDPOINT_URL,
        });
        expect(existingAccount).toBe(true);
    });

    it('returns false for non-existent accounts', async () => {
        const existingAccount = await accountExists({
            accountId: 'unregistered-account.near',
            nodeUrl: RPC_ENDPOINT_URL,
        });
        expect(existingAccount).toBe(false);
    });
});
