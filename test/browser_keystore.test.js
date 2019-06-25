const nearlib = require('../lib/index');
const { createFakeStorage } = require('./test-utils');

const BrowserLocalStorageKeyStore = nearlib.keyStores.BrowserLocalStorageKeyStore;
const KeyPair = nearlib.utils.KeyPairEd25519;

const NETWORK_ID_SINGLE_KEY = 'singlekeynetworkid';
const ACCOUNT_ID_SINGLE_KEY = 'singlekeyaccountid';
const KEYPAIR_SINGLE_KEY = new KeyPair('2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw');

describe('Browser keystore', () => {
    let keyStore;

    beforeAll(async () => {
        keyStore = new BrowserLocalStorageKeyStore(createFakeStorage());
        await keyStore.setKey(NETWORK_ID_SINGLE_KEY, ACCOUNT_ID_SINGLE_KEY, KEYPAIR_SINGLE_KEY);
    });

    test('Get account id from empty keystore', async () => {
        expect(await keyStore.getKey('somenetwork', 'someaccount')).toBeNull();
    });
    
    test('Get account id from a network with single key', async () => {
        const key = await keyStore.getKey(NETWORK_ID_SINGLE_KEY, ACCOUNT_ID_SINGLE_KEY);
        expect(key).toEqual(KEYPAIR_SINGLE_KEY);
    });

    test('Add two keys to network and retrieve them', async () => {
        const networkId = 'twoKeyNetwork';
        const newNetworkKeystore = new BrowserLocalStorageKeyStore(createFakeStorage());
        const accountId1 = 'acc1';
        const accountId2 = 'acc2';
        const key1Expected = new KeyPair('2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw');
        const key2Expected = new KeyPair('2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw');
        await newNetworkKeystore.setKey(networkId, accountId1, key1Expected);
        await newNetworkKeystore.setKey(networkId, accountId2, key2Expected);
        const key1 = await newNetworkKeystore.getKey(networkId, accountId1);
        const key2 = await newNetworkKeystore.getKey(networkId, accountId2);
        expect(key1).toEqual(key1Expected);
        expect(key2).toEqual(key2Expected);
    });
});
