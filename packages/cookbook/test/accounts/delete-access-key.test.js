const { KeyPair } = require('near-api-js');

const { deleteAccessKey } = require('../../src/accounts/access-keys/delete-access-key');
const { createTestAccount } = require('../utils');

describe('deleteAccessKey', () => {
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
        const keyPair = KeyPair.fromRandom('ed25519');
        const publicKey = keyPair.publicKey.toString();
        await account.addKey(publicKey);

        let accessKeys = await account.getAccessKeys();
        expect(accessKeys.map(({ public_key }) => public_key)).toContain(publicKey);

        await deleteAccessKey({
            accountId: account.accountId,
            keyStore,
            networkId,
            nodeUrl,
            publicKey,
        });

        accessKeys = await account.getAccessKeys();
        expect(accessKeys.map(({ public_key }) => public_key)).not.toContain(publicKey);
    });
});
