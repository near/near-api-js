const { wrapNear } = require('../../src/utils/wrap-near');
const { unwrapNear } = require('../../src/utils/unwrap-near');
const { deployWrapping } = require('../utils');

describe('unwrapNear', () => {
    let account, keyStore, networkId, nodeUrl;

    beforeAll(async () => {
        ({
            account,
            keyStore,
            networkId,
            nodeUrl,
        } = await deployWrapping());
    });

    it('wraps and unwraps near', async () => {
        const { status: wrapStatus } = await wrapNear({
            accountId: 'test.near',
            keyStore,
            networkId,
            nodeUrl,
            wrapAmount: '1',
            wrapContractId: account.accountId,
        });

        const { status: unwrapStatus} = await unwrapNear({
            accountId: 'test.near',
            keyStore,
            networkId,
            nodeUrl,
            unwrapAmount: '1',
            wrapContractId: account.accountId,
        });

        expect(wrapStatus).toHaveProperty('SuccessValue');
        expect(unwrapStatus).toHaveProperty('SuccessValue');
    });
});
