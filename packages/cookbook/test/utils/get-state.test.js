const { getState } = require('../../src/utils/get-state');
const { buildTestKeyStore } = require('../utils');

describe('getState', () => {
    let keyStore;

    beforeAll(async () => {
        keyStore = await buildTestKeyStore();
    });

    it('noop', () => {
        expect(1).toBe(1);
    });
});
