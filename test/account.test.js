
const nearlib = require('../index');

const testAccountName = 'test.near';

let connection;
let masterAccount;

beforeAll(async () => {
    connection = nearlib.Connection.fromConfig({ nodeUrl: "http://localhost:3030"});
    masterAccount = new nearlib.Account(connection, testAccountName);
});

test('view pre-defined account works and returns correct name', async () => {
    let status = await masterAccount.state();
    expect(status.account_id).toEqual(testAccountName);
});

test('create account and then view account returns the created account', async () => {
    const newAccountName = await generateUniqueString('create.account.test');
    const newAccountPublicKey = '9AhWenZ3JddamBoyMqnTbp7yVbRuvqAv3zwfrWgfVRJE';
    // await nearlib.accountCreator.LocalAccountCreator(masterAccount);
});

// Generate some unique string with a given prefix using the alice nonce.
const generateUniqueString = async (prefix) => {
    let status = await masterAccount.state();
    return prefix + status.nonce;
};
