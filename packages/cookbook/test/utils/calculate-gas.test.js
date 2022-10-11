const BN = require('bn.js');
const { utils } = require('near-api-js');

const { calculateGas } = require('../../src/utils/calculate-gas');
const { deployGuestbook } = require('../utils');

describe('calculateGas', () => {
    let account, keyStore, networkId, nodeUrl;

    beforeAll(async () => {
        ({
            account,
            keyStore,
            networkId,
            nodeUrl,
        } = await deployGuestbook());
    });

    it('calculates gas', async () => {
        const {
            totalGasBurned,
            totalTokensBurned,
        } = await calculateGas({
            accountId: 'test.near',
            contractId: account.accountId,
            keyStore,
            maxGas: '300000000000000',
            methodName: 'addMessage',
            networkId,
            nodeUrl,
            args: { text: 'yes' },
            depositAmount: '0',
        });

        const gasBurnedDecimal = parseFloat(utils.format.formatNearAmount((new BN(totalGasBurned)).toString()));
        const tokensBurnedDecimal = parseFloat(totalTokensBurned);

        expect(gasBurnedDecimal).toBeLessThan(Math.pow(10, -11));
        expect(gasBurnedDecimal).toBeGreaterThan(Math.pow(10, -12));

        expect(tokensBurnedDecimal).toBeLessThan(0.01);
        expect(tokensBurnedDecimal).toBeGreaterThan(0.001);
    });
});
