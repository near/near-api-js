const nearApi = require('../../src/index');
const { account } = nearApi.utils;

describe('account', () => {
    test('named account', async () => {
        const accountId = 'test.near';
        const result = account.isValidId(accountId);
        expect(result).toBe(true);
    });
    test('implicit account', async () => {
        const accountId = '46abe81b0ef0ff938f95d1347c93e3cfdd4eab5baa773b634d90f510581fc085';
        const result = account.isValidId(accountId);
        expect(result).toBe(true);
    });
});
