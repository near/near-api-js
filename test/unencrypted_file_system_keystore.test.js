
const nearlib = require('../lib/index');

const UnencryptedFileSystemKeyStore = nearlib.keyStores.UnencryptedFileSystemKeyStore;
const KeyPair = nearlib.utils.KeyPairEd25519;

const NETWORK_ID_SINGLE_KEY = 'singlekeynetworkid';
const ACCOUNT_ID_SINGLE_KEY = 'singlekeyaccountid';
const KEYPAIR_SINGLE_KEY = new KeyPair('2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw');

describe('Unencrypted file system keystore', () => {
    let keyStore;

    beforeAll(async () => {
        keyStore = new UnencryptedFileSystemKeyStore('../tests');
        await keyStore.setKey(NETWORK_ID_SINGLE_KEY, ACCOUNT_ID_SINGLE_KEY, KEYPAIR_SINGLE_KEY);
    });

    test('Get all keys with empty network returns empty list', async () => {
        const emptyList = await new UnencryptedFileSystemKeyStore('../tests').getAccounts('emptynetwork');
        expect(emptyList).toEqual([]);
    });  
    
    test('Get all keys with single key in keystore', async () => {
        const accountIds = await keyStore.getAccounts(NETWORK_ID_SINGLE_KEY);
        expect(accountIds).toEqual([ACCOUNT_ID_SINGLE_KEY]);
    });

    test('Get account id from empty keystore', async () => {
        await expect(keyStore.getKey('somenetwork', 'someaccount')).rejects.toThrow(/Key for .+ in .+ not found in .+/);
    });

    test('Get account id from a network with single key', async () => {
        const key = await keyStore.getKey(NETWORK_ID_SINGLE_KEY, ACCOUNT_ID_SINGLE_KEY);
        expect(key).toEqual(KEYPAIR_SINGLE_KEY);
    });

    test('Add two keys to network and retrieve them', async () => {
        const networkId = 'twoKeyNetwork';
        const newNetworkKeystore = new UnencryptedFileSystemKeyStore('../tests');
        const accountId1 = 'acc1';
        const accountId2 = 'acc2';
        const key1Expected = KeyPair.fromRandom();
        const key2Expected = KeyPair.fromRandom();
        await newNetworkKeystore.setKey(networkId, accountId1, key1Expected);
        await newNetworkKeystore.setKey(networkId, accountId2, key2Expected);
        const key1 = await newNetworkKeystore.getKey(networkId, accountId1);
        const key2 = await newNetworkKeystore.getKey(networkId, accountId2);
        expect(key1).toEqual(key1Expected);
        expect(key2).toEqual(key2Expected);
        const accountIds = await newNetworkKeystore.getAccounts(networkId);
        expect(accountIds).toEqual([accountId1, accountId2]);
        const networks = await newNetworkKeystore.getNetworks();
        expect(networks).toEqual([NETWORK_ID_SINGLE_KEY, networkId]);
    });
});
