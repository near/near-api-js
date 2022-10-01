const { wrapNear } = require('../../src/utils/wrap-near');
const { buildTestKeyStore } = require('../utils');

describe('wrapNear', () => {
    let keyStore;

    beforeAll(async () => {
        keyStore = await buildTestKeyStore();
    });

    it('noop', () => {
        expect(1).toBe(1);
    });
});
