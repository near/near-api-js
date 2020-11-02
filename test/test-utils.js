const fs = require('fs').promises;
const BN = require('bn.js');

const nearApi = require('../lib/index');

const networkId = 'unittest';

const HELLO_WASM_PATH = process.env.HELLO_WASM_PATH || 'node_modules/near-hello/dist/main.wasm';
const HELLO_WASM_BALANCE = new BN('10000000000000000000000000');
const HELLO_WASM_METHODS = {
    viewMethods: ['getValue', 'getLastResult'],
    changeMethods: ['setValue', 'callPromise']
};
const MULTISIG_WASM_PATH = process.env.MULTISIG_WASM_PATH || './test/wasm/multisig.wasm';

async function setUpTestConnection() {
    const keyStore = new nearApi.keyStores.InMemoryKeyStore();
    const config = Object.assign(require('./config')(process.env.NODE_ENV || 'test'), {
        networkId: networkId,
        deps: { keyStore },
    });

    if (config.masterAccount) {
        await keyStore.setKey(networkId, config.masterAccount, nearApi.utils.KeyPair.fromString('ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw'));
    }

    return nearApi.connect(config);
}

// Generate some unique string with a given prefix using the alice nonce.
function generateUniqueString(prefix) {
    return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000000)}`;
}

async function createAccount(near) {
    const newAccountName = generateUniqueString('test');
    const newPublicKey = await near.connection.signer.createKey(newAccountName, networkId);
    await near.createAccount(newAccountName, newPublicKey);
    const account = new nearApi.Account(near.connection, newAccountName);
    return account;
}

async function createAccountMultisig(near, options) {
    const newAccountName = generateUniqueString('test');
    const newPublicKey = await near.connection.signer.createKey(newAccountName, networkId);
    await near.createAccount(newAccountName, newPublicKey);
    // add a confirm key for multisig (contract helper sim)
    
    try {
        const confirmKeyPair = nearApi.utils.KeyPair.fromRandom('ed25519');
        const { publicKey } = confirmKeyPair;
        // const account = new nearApi.Account(near.connection, newAccountName);
        // await account.addKey(publicKey, account.accountId, nearApi.multisig.MULTISIG_CONFIRM_METHODS, '0')
        // create multisig account instance and deploy contract
        const accountMultisig = new nearApi.multisig.AccountMultisig(near.connection, newAccountName, options);
        accountMultisig.useConfirmKey = async () => {
            await near.connection.signer.setKey(networkId, options.masterAccount, confirmKeyPair);
        };
        accountMultisig.getRecoveryMethods = () => ({ data: [] });
        accountMultisig.postSignedJson = async (path) => {
            switch (path) {
            case '/2fa/getAccessKey': return { publicKey };
            }
        };
        await accountMultisig.deployMultisig(new Uint8Array([...(await fs.readFile(MULTISIG_WASM_PATH))]));
        return accountMultisig;
    } catch(e) {
        console.log(e);
    }
}

async function deployContract(workingAccount, contractId) {
    const newPublicKey = await workingAccount.connection.signer.createKey(contractId, networkId);
    const data = [...(await fs.readFile(HELLO_WASM_PATH))];
    await workingAccount.createAndDeployContract(contractId, newPublicKey, data, HELLO_WASM_BALANCE);
    return new nearApi.Contract(workingAccount, contractId, HELLO_WASM_METHODS);
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

module.exports = {
    setUpTestConnection,
    networkId,
    generateUniqueString,
    createAccount,
    createAccountMultisig,
    deployContract,
    sleep,
    ensureDir,
    HELLO_WASM_PATH,
    HELLO_WASM_BALANCE,
};
