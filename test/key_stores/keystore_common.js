
const nearApi = require('../../lib/index');

const KeyPair = nearApi.utils.KeyPairEd25519;

const NETWORK_ID_SINGLE_KEY = 'singlekeynetworkid';
const ACCOUNT_ID_SINGLE_KEY = 'singlekey_accountid';
const KEYPAIR_SINGLE_KEY = new KeyPair('2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw');

module.exports.shouldStoreAndRetriveKeys = ctx => {
    beforeEach(async () => {
        await ctx.keyStore.clear();
        await ctx.keyStore.setKey(NETWORK_ID_SINGLE_KEY, ACCOUNT_ID_SINGLE_KEY, KEYPAIR_SINGLE_KEY);
    });

    test('Get all keys with empty network returns empty list', async () => {
        const emptyList = await ctx.keyStore.getAccounts('emptynetwork');
        expect(emptyList).toEqual([]);
    });  
    
    test('Get all keys with single key in keystore', async () => {
        const accountIds = await ctx.keyStore.getAccounts(NETWORK_ID_SINGLE_KEY);
        expect(accountIds).toEqual([ACCOUNT_ID_SINGLE_KEY]);
    });

    test('Get not-existing account', async () => {
        expect(await ctx.keyStore.getKey('somenetwork', 'someaccount')).toBeNull();
    });

    test('Get account id from a network with single key', async () => {
        const key = await ctx.keyStore.getKey(NETWORK_ID_SINGLE_KEY, ACCOUNT_ID_SINGLE_KEY);
        expect(key).toEqual(KEYPAIR_SINGLE_KEY);
    });

    test('Get networks', async () => {
        const networks = await ctx.keyStore.getNetworks();
        expect(networks).toEqual([NETWORK_ID_SINGLE_KEY]);
    });

    test('Add two keys to network and retrieve them', async () => {
        const networkId = 'twoKeyNetwork';
        const accountId1 = 'acc1';
        const accountId2 = 'acc2';
        const key1Expected = KeyPair.fromRandom();
        const key2Expected = KeyPair.fromRandom();
        await ctx.keyStore.setKey(networkId, accountId1, key1Expected);
        await ctx.keyStore.setKey(networkId, accountId2, key2Expected);
        const key1 = await ctx.keyStore.getKey(networkId, accountId1);
        const key2 = await ctx.keyStore.getKey(networkId, accountId2);
        expect(key1).toEqual(key1Expected);
        expect(key2).toEqual(key2Expected);
        const accountIds = await ctx.keyStore.getAccounts(networkId);
        expect(accountIds).toEqual([accountId1, accountId2]);
        const networks = await ctx.keyStore.getNetworks();
        expect(networks).toEqual([NETWORK_ID_SINGLE_KEY, networkId]);
    });
};
