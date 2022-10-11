const { addFunctionAccessKey } = require('../../src/accounts/access-keys/create-function-access-key');
const { createTestAccount } = require('../utils');

describe('addFunctionAccessKey', () => {
    let account, keyStore, networkId, nodeUrl;

    beforeAll(async () => {
        ({
            account,
            keyStore,
            networkId,
            nodeUrl,
        } = await createTestAccount());
    });

    it('creates function call access key', async () => {
        const publicKey = await addFunctionAccessKey({
            accountId: account.accountId,
            keyStore,
            networkId,
            nodeUrl,
        });

        const accessKeys = await account.getAccessKeys();
        expect(accessKeys.map(({ public_key }) => public_key)).toContain(publicKey);
    });
});
