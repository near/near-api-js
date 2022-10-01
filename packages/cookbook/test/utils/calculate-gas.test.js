const { calculateGas } = require('../../src/utils/calculate-gas');
const { buildTestKeyStore } = require('../utils');

describe('calculateGas', () => {
    let keyStore;

    beforeAll(async () => {
        keyStore = await buildTestKeyStore();
    });

    it('calculates gas', () => {
    });
});
