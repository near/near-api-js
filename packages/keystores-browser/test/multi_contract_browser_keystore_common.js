const { KeyPairEd25519 } = require('@near-js/crypto');

const NETWORK_ID = 'networkid';
const ACCOUNT_ID = 'accountid';
const CONTRACT_ID = 'contractid';
const KEYPAIR = new KeyPairEd25519('2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw');

module.exports.shouldStoreAndRetrieveKeys = ctx => {
    beforeEach(async () => {
        await ctx.keyStore.clear();
        await ctx.keyStore.setKey(NETWORK_ID, ACCOUNT_ID, KEYPAIR, CONTRACT_ID);
    });

    test('Get all keys with empty network returns empty list', async () => {
        const emptyList = await ctx.keyStore.getAccounts('emptynetwork');
        expect(emptyList).toEqual([]);
    });  
    
    test('Get all keys with single key in keystore', async () => {
        const accountIds = await ctx.keyStore.getAccounts(NETWORK_ID);
        expect(accountIds).toEqual([ACCOUNT_ID]);
    });

    test('Get not-existing account', async () => {
        expect(await ctx.keyStore.getKey('somenetwork', 'someaccount', 'somecontract')).toBeNull();
    });

    test('Get account id from a network with single key', async () => {
        const key = await ctx.keyStore.getKey(NETWORK_ID, ACCOUNT_ID, CONTRACT_ID);
        expect(key).toEqual(KEYPAIR);
    });

    test('Get networks', async () => {
        const networks = await ctx.keyStore.getNetworks();
        expect(networks).toEqual([NETWORK_ID]);
    });

    test('Get accounts', async () => {
        const accounts = await ctx.keyStore.getAccounts(NETWORK_ID);
        expect(accounts).toEqual([ACCOUNT_ID]);
    });

    test('Get contracts', async () => {
        const contracts = await ctx.keyStore.getContracts(NETWORK_ID, ACCOUNT_ID);
        expect(contracts).toEqual([CONTRACT_ID]);
    });

    test('Add two contracts to account and retrieve them', async () => {
        const networkId = 'network';
        const accountId = 'account';
        const contract1 = 'contract1';
        const contract2 = 'contract2';
        const key1Expected = KeyPairEd25519.fromRandom();
        const key2Expected = KeyPairEd25519.fromRandom();
        await ctx.keyStore.setKey(networkId, accountId, key1Expected, contract1);
        await ctx.keyStore.setKey(networkId, accountId, key2Expected, contract2);
        const key1 = await ctx.keyStore.getKey(networkId, accountId, contract1);
        const key2 = await ctx.keyStore.getKey(networkId, accountId, contract2);
        expect(key1).toEqual(key1Expected);
        expect(key2).toEqual(key2Expected);
        const contractIds = await ctx.keyStore.getContracts(networkId, accountId);
        expect(contractIds).toEqual([contract1, contract2]);
    });
};
