
const nearlib = require('../lib/index');

const networkId = 'unittest';
const testAccountName = 'test.near';

let connection;
let masterAccount;
let keyStore;
let accountCreator;

const INITIAL_BALANCE = BigInt(10000000);

beforeAll(async () => {
    keyStore = new nearlib.keyStores.InMemoryKeyStore();
    await keyStore.setKey(networkId, testAccountName, nearlib.utils.KeyPair.fromString('ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw'));
    connection = nearlib.Connection.fromConfig({ 
        networkId,
        provider: { type: 'JsonRpcProvider', args: { url: 'http://localhost:3030' }},
        signer: { type: 'InMemorySigner', keyStore }
    });
    masterAccount = new nearlib.Account(connection, testAccountName);
    accountCreator = new nearlib.accountCreator.LocalAccountCreator(masterAccount, INITIAL_BALANCE);
});

test('view pre-defined account works and returns correct name', async () => {
    let status = await masterAccount.state();
    expect(status.account_id).toEqual(testAccountName);
});

test('create account and then view account returns the created account', async () => {
    const newAccountName = await generateUniqueString('create.account.test');
    const newAccountPublicKey = '9AhWenZ3JddamBoyMqnTbp7yVbRuvqAv3zwfrWgfVRJE';
    await accountCreator.createAccount(newAccountName, newAccountPublicKey);
    const newAccount = new nearlib.Account(connection, newAccountName);
    const state = await newAccount.state();
    const expectedState = { nonce: 0, account_id: newAccountName, amount: INITIAL_BALANCE, code_hash: 'GKot5hBsd81kMupNCXHaqbhv3huEbxAFMLnpcX2hniwn', public_keys: state.public_keys, stake: BigInt(0)};
    expect(state).toEqual(expectedState);
});

test('send money', async() => {
    const sender = await testCreateAccount();
    const receiver = await testCreateAccount();
    await sender.sendMoney(receiver.accountId, BigInt(10000));
    await receiver.fetchState();
    const state = await receiver.state();
    expect(state.amount).toEqual(INITIAL_BALANCE + BigInt(10000));
});

// Generate some unique string with a given prefix using the alice nonce.
const generateUniqueString = async (prefix) => {
    let status = await masterAccount.state();
    return prefix + status.nonce;
};

async function testCreateAccount() {
    const newAccountName = await generateUniqueString('create.account.test');
    const keyPair = nearlib.utils.key_pair.KeyPairEd25519.fromRandom();
    keyStore.setKey(networkId, newAccountName, keyPair);
    await accountCreator.createAccount(newAccountName, keyPair.publicKey);
    return new nearlib.Account(connection, newAccountName);
}
