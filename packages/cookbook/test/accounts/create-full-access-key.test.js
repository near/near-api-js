const { createFullAccessKey } = require('../../src/accounts/access-keys/create-full-access-key');
const { createTestAccount } = require('../utils');

describe('createFullAccessKey', () => {
    let account, keyStore, networkId, nodeUrl;

    beforeAll(async () => {
        ({
            account,
            keyStore,
            networkId,
            nodeUrl,
        } = await createTestAccount());
    });

    it('creates full access key', async () => {
        const publicKey = await createFullAccessKey({
            accountId: account.accountId,
            keyStore,
            networkId,
            nodeUrl,
        });

        const accessKeys = await account.getAccessKeys();
        expect(accessKeys.map(({ public_key }) => public_key)).toContain(publicKey);
    });
});
