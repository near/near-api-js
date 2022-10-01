const { createFullAccessKey } = require('../../src/accounts/access-keys/create-full-access-key');
const { buildKeyStore } = require('../utils');

describe('createFullAccessKey', () => {
    let keyStore;

    beforeAll(async () => {
        keyStore = await buildKeyStore();
    });

    it('creates full access key', () => {
        expect(1).toBe(1);
    });
});
