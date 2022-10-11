const fs = require('fs');
const path = require('path');

const { deployContract } = require('../../src/utils/deploy-contract');
const { createTestAccount } = require('../utils');

describe('deployContract', () => {
    let account, keyStore, networkId, nodeUrl;

    beforeAll(async () => {
        ({
            account,
            keyStore,
            networkId,
            nodeUrl,
        } = await createTestAccount());
    });

    it('contract is deployed', async () => {
        await deployContract({
            accountId: account.accountId,
            contractWasm: fs.readFileSync(path.join(__dirname, '../../assets/guestbook.wasm')),
            keyStore,
            networkId,
            nodeUrl,
        });

        const { status } = await account.functionCall({
            contractId: account.accountId,
            methodName: 'getMessages',
            args: {},
        });

        expect(status.SuccessValue).toBeTruthy();
    });
});
