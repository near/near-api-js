const fs = require('fs');

const nearlib = require('../lib/index');

const networkId = 'unittest';
const testAccountName = 'test.near';

const INITIAL_BALANCE = BigInt(100000000000);
const HELLO_WASM_PATH = process.env.HELLO_WASM_PATH || '../nearcore/tests/hello.wasm';

async function setUpTestConnection() {
    const keyStore = new nearlib.keyStores.InMemoryKeyStore();
    await keyStore.setKey(networkId, testAccountName, nearlib.utils.KeyPair.fromString('ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw'));
    const connection = nearlib.Connection.fromConfig({
        networkId,
        provider: { type: 'JsonRpcProvider', args: { url: 'http://localhost:3030' } },
        signer: { type: 'InMemorySigner', keyStore }
    });
    const masterAccount = new nearlib.Account(connection, testAccountName);
    return { connection, keyStore, masterAccount };
}

// Generate some unique string with a given prefix using the alice nonce.
function generateUniqueString(prefix) {
    return prefix + Date.now();
}

async function createAccount(masterAccount, options = { amount: INITIAL_BALANCE }) {
    const newAccountName = generateUniqueString('create.account.test');
    const newPublicKey = await masterAccount.connection.signer.createKey(newAccountName, networkId);
    await masterAccount.createAccount(newAccountName, newPublicKey, options.amount);
    return new nearlib.Account(masterAccount.connection, newAccountName);
}

async function deployContract(workingAccount, contractId, options = { amount: BigInt(100000) }) {
    const newPublicKey = await workingAccount.connection.signer.createKey(contractId, networkId);
    const data = [...fs.readFileSync(HELLO_WASM_PATH)];
    await workingAccount.createAndDeployContract(contractId, newPublicKey, data, options.amount);
    return new nearlib.Contract(workingAccount, contractId, {
        viewMethods: ['getValue', 'getLastResult'],
        changeMethods: ['setValue', 'callPromise']
    });
}

function createFakeStorage() {
    let store = {};
    return {
        getItem: function (key) {
            return store[key];
        },
        setItem: function (key, value) {
            store[key] = value.toString();
        },
        clear: function () {
            store = {};
        },
        removeItem: function (key) {
            delete store[key];
        }
    };
}

module.exports = { setUpTestConnection, networkId, testAccountName, INITIAL_BALANCE,
    generateUniqueString, createAccount, createFakeStorage, deployContract };
