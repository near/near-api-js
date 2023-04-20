const { getState } = require('../../src/utils/get-state');
const { deployGuestbook } = require('../utils');

describe('getState', () => {
    let account, nodeUrl;

    beforeAll(async () => {
        ({
            account,
            nodeUrl,
        } = await deployGuestbook());
    });

    it('calls view method', async () => {
        const emptyMessages = await getState({
            contractName: account.accountId,
            methodName: 'getMessages',
            nodeUrl: nodeUrl,
        });

        await account.functionCall({
            accountId: 'test.near',
            contractId: account.accountId,
            methodName: 'addMessage',
            args: { text: 'yes' },
        });

        const singleMessage = await getState({
            contractName: account.accountId,
            methodName: 'getMessages',
            nodeUrl: nodeUrl,
        });

        expect(emptyMessages.length).toBe(0);
        expect(singleMessage.length).toBe(1);
    });
});
