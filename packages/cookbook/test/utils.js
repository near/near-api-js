const nearApi = require('near-api-js');

async function buildTestKeyStore() {
    const keyStore = new nearApi.keyStores.InMemoryKeyStore();

    // full accessKey on ci-testnet, dedicated rpc for tests.
    await keyStore.setKey(
        'ci',
        'test.near',
        nearApi.utils.KeyPair.fromString('ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw')
    );

    return keyStore;
}

module.exports = {
    buildTestKeyStore,
};
