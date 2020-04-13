const fs = require('fs').promises;
const BN = require('bn.js');

const nearApi = require('../lib/index');

const networkId = 'unittest';
const testAccountName = 'test.near';

const INITIAL_BALANCE = new BN('100000000000000000000000000');
const HELLO_WASM_PATH = process.env.HELLO_WASM_PATH || 'node_modules/near-hello/dist/main.wasm';

async function setUpTestConnection() {
    const keyStore = new nearApi.keyStores.InMemoryKeyStore();
    await keyStore.setKey(networkId, testAccountName, nearApi.utils.KeyPair.fromString('ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw'));
    const config = Object.assign(require('./config')(process.env.NODE_ENV || 'test'), {
        networkId: networkId,
        deps: { keyStore },
    });

    return nearApi.connect(config);
}

// Generate some unique string with a given prefix using the alice nonce.
function generateUniqueString(prefix) {
    return prefix + Date.now() + Math.round(Math.random() * 1000);
}

async function createAccount(masterAccount, options = { amount: INITIAL_BALANCE, trials: 5 }) {
    await masterAccount.fetchState();
    const newAccountName = generateUniqueString('test');
    const newPublicKey = await masterAccount.connection.signer.createKey(newAccountName, networkId);
    await masterAccount.createAccount(newAccountName, newPublicKey, options.amount);
    return new nearApi.Account(masterAccount.connection, newAccountName);
}

async function deployContract(workingAccount, contractId, options = { amount: INITIAL_BALANCE.div(new BN(10)) }) {
    const newPublicKey = await workingAccount.connection.signer.createKey(contractId, networkId);
    const data = [...(await fs.readFile(HELLO_WASM_PATH))];
    await workingAccount.createAndDeployContract(contractId, newPublicKey, data, options.amount);
    return new nearApi.Contract(workingAccount, contractId, {
        viewMethods: ['getValue', 'getLastResult'],
        changeMethods: ['setValue', 'callPromise']
    });
}

function sleep(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

async function ensureDir(dirpath) {
    try {
        await fs.mkdir(dirpath, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }
}

module.exports = { setUpTestConnection, networkId, testAccountName, INITIAL_BALANCE,
    generateUniqueString, createAccount, deployContract, sleep, ensureDir };
