const { verifySignature } = require('../../src/utils/verify-signature');
const { buildTestKeyStore } = require('../utils');

describe('verifySignature', () => {
    let keyStore;

    beforeAll(async () => {
        keyStore = await buildTestKeyStore();
    });

    it('noop', () => {
        expect(1).toBe(1);
    });
});
