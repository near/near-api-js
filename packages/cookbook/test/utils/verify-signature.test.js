const { verifySignature } = require('../../src/utils/verify-signature');
const { buildLocalnetKeyStore } = require('../utils');

describe('verifySignature', () => {
    let keyStore;

    beforeAll(async () => {
        keyStore = await buildLocalnetKeyStore();
    });

    it('verifies matching messages', async () => {
        const verified = await verifySignature({
            accountId: 'test.near',
            keyStore,
            message: Buffer.from('false moose cell fastener'),
            networkId: (await keyStore.getNetworks())[0],
        });

        expect(verified).toBe(true);
    });
});
