const nearlib = require('../lib/index');

const networkId = 'unittest';
const testAccountName = 'test.near';

const INITIAL_BALANCE = BigInt(10000000);

async function setUpTestConnection() {
    const keyStore = new nearlib.keyStores.InMemoryKeyStore();
    await keyStore.setKey(networkId, testAccountName, nearlib.utils.KeyPair.fromString('ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw'));
    const connection = nearlib.Connection.fromConfig({
        networkId,
        provider: { type: 'JsonRpcProvider', args: { url: 'http://localhost:3030' } },
        signer: { type: 'InMemorySigner', keyStore }
    });
    const masterAccount = new nearlib.Account(connection, testAccountName);
    const accountCreator = new nearlib.accountCreator.LocalAccountCreator(masterAccount, INITIAL_BALANCE);
    return [connection, keyStore, masterAccount, accountCreator];
}

module.exports = { setUpTestConnection, networkId, testAccountName, INITIAL_BALANCE };
