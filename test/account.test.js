
const nearlib = require('../lib/index');
const testUtils  = require('./test-utils');
const fs = require('fs');

let connection;
let masterAccount;
let keyStore;
let accountCreator;

const HELLO_WASM_PATH = process.env.HELLO_WASM_PATH || '../nearcore/tests/hello.wasm';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

beforeAll(async () => {
    [connection, keyStore, masterAccount, accountCreator] = await testUtils.setUpTestConnection();
});

// test('view pre-defined account works and returns correct name', async () => {
//     let status = await masterAccount.state();
//     expect(status.account_id).toEqual(testUtils.testAccountName);
// });

// test('create account and then view account returns the created account', async () => {
//     const newAccountName = await generateUniqueString('create.account.test');
//     const newAccountPublicKey = '9AhWenZ3JddamBoyMqnTbp7yVbRuvqAv3zwfrWgfVRJE';
//     await accountCreator.createAccount(newAccountName, newAccountPublicKey);
//     const newAccount = new nearlib.Account(connection, newAccountName);
//     const state = await newAccount.state();
//     const expectedState = { nonce: 0, account_id: newAccountName, amount: testUtils.INITIAL_BALANCE, code_hash: 'GKot5hBsd81kMupNCXHaqbhv3huEbxAFMLnpcX2hniwn', public_keys: state.public_keys, stake: BigInt(0)};
//     expect(state).toEqual(expectedState);
// });

// test('send money', async() => {
//     const sender = await testCreateAccount();
//     const receiver = await testCreateAccount();
//     await sender.sendMoney(receiver.accountId, BigInt(10000));
//     await receiver.fetchState();
//     const state = await receiver.state();
//     expect(state.amount).toEqual(testUtils.INITIAL_BALANCE + BigInt(10000));
// });

describe('with deploy contract', () => {
    let oldLog;
    let logs;
    let contractId = 'test_contract_' + Date.now();
    let contractAccount;

    beforeAll(async () => {
        const keyPair = nearlib.utils.KeyPair.fromRandom('ed25519');
        keyStore.setKey(testUtils.networkId, contractId, keyPair);
        const data = [...fs.readFileSync(HELLO_WASM_PATH)];
        contractAccount = await masterAccount.createAndDeployContract(contractId, keyPair.publicKey, data, BigInt(100000));
    });

    beforeEach(async () => {
        oldLog = console.log;
        logs = [];
        console.log = function () {
            logs.push(Array.from(arguments).join(' '));
        };
    });

    afterEach(async () => {
        console.log = oldLog;
    });

    test('make function calls via account', async() => {
        const result = await masterAccount.viewFunction(
            contractId,
            'hello', // this is the function defined in hello.wasm file that we are calling
            {name: 'trex'});
        expect(result).toEqual('hello trex');
    });
    
    test('make function calls via contract', async() => {
        const contract = new nearlib.Contract(masterAccount, contractId, { 
            viewMethods: ['hello', 'getValue'], 
            changeMethods: ['setValue']
        });
        const result = await contract.hello({ name: 'trex' });
        expect(result).toEqual('hello trex');
    });
});

// describe('with access key', function () {
//     let workingAccount;
//     let contractId = 'test_contract_' + Date.now();

//     beforeAll(async () => {
//         workingAccount = testCreateAccount();
//         await masterAccount.deployContract();
//     });

//     test('make function call using access key', async() => {
//         const keyForAccessKey = nearlib.utils.keyPair.fromRandom('ed25519');
//         await workingAccount.addAccessKey(keyForAccessKey.publicKey, contractAccount.accountId, '', '', 400000);
//         keyStore.setKey(workingAccount.accountId, keyForAccessKey);

//         let contract = 

//         const setCallValue2 = await generateUniqueString('setCallPrefix');
//         contract.setValue({ value: setCallValue2 });
//         contract.
//     });
// });

// Generate some unique string with a given prefix using the alice nonce.
const generateUniqueString = async (prefix) => {
    let status = await masterAccount.state();
    return prefix + status.nonce;
};

async function testCreateAccount() {
    const newAccountName = await generateUniqueString('create.account.test');
    const keyPair = nearlib.utils.key_pair.KeyPairEd25519.fromRandom();
    keyStore.setKey(testUtils.networkId, newAccountName, keyPair);
    await accountCreator.createAccount(newAccountName, keyPair.publicKey);
    return new nearlib.Account(connection, newAccountName);
}
