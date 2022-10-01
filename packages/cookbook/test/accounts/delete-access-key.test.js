const { deleteAccessKey } = require('../../src/accounts/access-keys/delete-access-key');
const { buildTestKeyStore } = require('../utils');

describe('deleteAccessKey', () => {
    let keyStore;

    beforeAll(async () => {
        keyStore = await buildTestKeyStore();
    });

    it('noop', () => {
        expect(1).toBe(1);
    });
});
