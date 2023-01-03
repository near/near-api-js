const { InMemoryKeyStore, KeyPair } = require('@near-js/client-core');
const BN = require('bn.js');
const fs = require('fs').promises;

const { Account, AccountMultisig, Contract, Connection, LocalAccountCreator } = require('../lib');

const networkId = 'unittest';

const HELLO_WASM_PATH = process.env.HELLO_WASM_PATH || 'node_modules/near-hello/dist/main.wasm';
const HELLO_WASM_BALANCE = new BN('10000000000000000000000000');
const HELLO_WASM_METHODS = {
    viewMethods: ['getValue', 'getLastResult'],
    changeMethods: ['setValue', 'callPromise']
};
const MULTISIG_WASM_PATH = process.env.MULTISIG_WASM_PATH || './test/wasm/multisig.wasm';
// Length of a random account. Set to 40 because in the protocol minimal allowed top-level account length should be at
// least 32.
const RANDOM_ACCOUNT_LENGTH = 40;

async function setUpTestConnection() {
    const keyStore = new InMemoryKeyStore();
    const config = Object.assign(require('./config')(process.env.NODE_ENV || 'test'), {
        networkId,
        keyStore
    });

    if (config.masterAccount) {
        // full accessKey on ci-testnet, dedicated rpc for tests.
        await keyStore.setKey(networkId, config.masterAccount, KeyPair.fromString('ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw'));
    }

    const connection = Connection.fromConfig({
        networkId: config.networkId,
        provider: { type: 'JsonRpcProvider', args: { url: config.nodeUrl, headers: config.headers } },
        signer: { type: 'InMemorySigner', keyStore: config.keyStore },
    });

    return {
        accountCreator: new LocalAccountCreator(new Account(connection, config.masterAccount), new BN('500000000000000000000000000')),
        connection,
    };
}

// Generate some unique string of length at least RANDOM_ACCOUNT_LENGTH with a given prefix using the alice nonce.
function generateUniqueString(prefix) {
    let result = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000000)}`;
    let add_symbols = Math.max(RANDOM_ACCOUNT_LENGTH - result.length, 1);
    for (let i = add_symbols; i > 0; --i) result += '0';
    return result;
}

async function createAccount({ accountCreator, connection }) {
    const newAccountName = generateUniqueString('test');
    const newPublicKey = await connection.signer.createKey(newAccountName, networkId);
    await accountCreator.createAccount(newAccountName, newPublicKey);
    return new Account(connection, newAccountName);
}

async function createAccountMultisig({ accountCreator, connection }, options) {
    const newAccountName = generateUniqueString('test');
    const newPublicKey = await connection.signer.createKey(newAccountName, networkId);
    await accountCreator.createAccount(newAccountName, newPublicKey);
    // add a confirm key for multisig (contract helper sim)

    try {
        const confirmKeyPair = KeyPair.fromRandom('ed25519');
        const { publicKey } = confirmKeyPair;
        const accountMultisig = new AccountMultisig(connection, newAccountName, options);
        accountMultisig.useConfirmKey = async () => {
            await connection.signer.setKey(networkId, options.masterAccount, confirmKeyPair);
        };
        accountMultisig.getRecoveryMethods = () => ({ data: [] });
        accountMultisig.postSignedJson = async (path) => {
            switch (path) {
            case '/2fa/getAccessKey': return { publicKey };
            }
        };
        await accountMultisig.deployMultisig(new Uint8Array([...(await fs.readFile(MULTISIG_WASM_PATH))]));
        return accountMultisig;
    } catch (e) {
        console.log(e);
    }
}

async function deployContract(workingAccount, contractId) {
    const newPublicKey = await workingAccount.connection.signer.createKey(contractId, networkId);
    const data = [...(await fs.readFile(HELLO_WASM_PATH))];
    await workingAccount.createAndDeployContract(contractId, newPublicKey, data, HELLO_WASM_BALANCE);
    return new Contract(workingAccount, contractId, HELLO_WASM_METHODS);
}

function sleep(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

function waitFor(fn) {
    const _waitFor = async (count = 10) => {
        try {
            return await fn();
        } catch (e) {
            if (count > 0) {
                await sleep(500);
                return _waitFor(count - 1);
            }
            else throw e;
        }
    };

    return _waitFor();
}

module.exports = {
    setUpTestConnection,
    networkId,
    generateUniqueString,
    createAccount,
    createAccountMultisig,
    deployContract,
    HELLO_WASM_PATH,
    HELLO_WASM_BALANCE,
    sleep,
    waitFor,
};
