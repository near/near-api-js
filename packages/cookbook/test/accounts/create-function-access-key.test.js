const { addFunctionAccessKey } = require('../../src/accounts/access-keys/create-function-access-key');
const { buildTestKeyStore } = require('../utils');

describe('addFunctionAccessKey', () => {
    let keyStore;

    beforeAll(async () => {
        keyStore = await buildTestKeyStore();
    });

    it('noop', () => {
        expect(1).toBe(1);
    });
});
