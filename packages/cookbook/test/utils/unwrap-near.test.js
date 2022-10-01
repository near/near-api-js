const { unwrapNear } = require('../../src/utils/unwrap-near');
const { buildTestKeyStore } = require('../utils');

describe('unwrapNear', () => {
    let keyStore;

    beforeAll(async () => {
        keyStore = await buildTestKeyStore();
    });

    it('noop', () => {
        expect(1).toBe(1);
    });
});
