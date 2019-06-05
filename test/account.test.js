
const nearlib = require('../lib/index');

const testAccountName = 'test.near';

let connection;
let masterAccount;
let accountCreator;

beforeAll(async () => {
    connection = nearlib.Connection.fromConfig({ 
        networkId: 'unittest',
        provider: { type: 'JsonRpcProvider', args: { url: 'http://localhost:3030' }},
        signer: { type: 'InMemorySigner', keyStore: { [testAccountName]: 'ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw' }}
    });
    masterAccount = new nearlib.Account(connection, testAccountName);
    accountCreator = new nearlib.accountCreator.LocalAccountCreator(masterAccount);
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
    const expectedState = { nonce: 0, account_id: newAccountName, amount: BigInt(279303400), code_hash: 'GKot5hBsd81kMupNCXHaqbhv3huEbxAFMLnpcX2hniwn', public_keys: state.public_keys, stake: BigInt(0)};
    expect(state).toEqual(expectedState);
});

// Generate some unique string with a given prefix using the alice nonce.
const generateUniqueString = async (prefix) => {
    let status = await masterAccount.state();
    return prefix + status.nonce;
};
