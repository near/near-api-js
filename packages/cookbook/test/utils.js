const BN = require('bn.js');
const fs = require('fs');
const { Account, InMemorySigner, KeyPair, keyStores, providers, utils } = require('near-api-js');
const path = require('path');

const { JsonRpcProvider } = providers;
const RPC_ENDPOINT_URL = 'http://localhost:8332';
const NETWORK_ID = 'localnet';

async function buildLocalnetKeyStore() {
    const keyStore = new keyStores.InMemoryKeyStore();

    // full accessKey on ci-testnet, dedicated rpc for tests.
    await keyStore.setKey(
        NETWORK_ID,
        'test.near',
        utils.KeyPair.fromString('ed25519:2ykcMLiM7vCmsSECcgfmUzihBtNdBv7v2CxNi94sNt4R8ar4xsrMMYvtsSNGQDfSRhNWXEnZvgx2wzS9ViBiS9jW')
    );

    return keyStore;
}

async function createTestAccount() {
    const keyStore = await buildLocalnetKeyStore();
    const newAccountId = `${(new Date()).valueOf()}-${Math.ceil(Math.random()) * 1000000000}.test.near`;
    const keyPair = KeyPair.fromRandom('ed25519');
    await keyStore.setKey(NETWORK_ID, newAccountId, keyPair);

    const signer = new InMemorySigner(keyStore);
    const provider = new JsonRpcProvider({
        url: RPC_ENDPOINT_URL,
    });
    const publicKey = keyPair.publicKey.toString();

    const rootAccount = new Account({
        networkId: NETWORK_ID,
        provider,
        signer,
    }, 'test.near');

    await rootAccount.createAccount(
        newAccountId,
        publicKey,
        new BN(utils.format.parseNearAmount('5'))
    );

    return {
        account: new Account({
            networkId: NETWORK_ID,
            provider,
            signer,
        }, newAccountId),
        keyStore,
        networkId: NETWORK_ID,
        nodeUrl: RPC_ENDPOINT_URL,
    };
}

async function deployGuestbook() {
    return deployContract({ contractName: 'guestbook', init: false });
}

async function deployWrapping() {
    return deployContract({ contractName: 'w_near', init: true });
}

async function deployContract({ contractName, init }) {
    const testAccount = await createTestAccount();
    const { transaction } = await testAccount.account.deployContract(fs.readFileSync(path.join(__dirname, `../contracts/${contractName}.wasm`)));

    if (init) {
        await testAccount.account.functionCall({
            contractId: testAccount.account.accountId,
            methodName: 'new',
        });
    }

    return {
        ...testAccount,
        transaction,
    };
}

module.exports = {
    buildLocalnetKeyStore,
    createTestAccount,
    deployGuestbook,
    deployWrapping,
    NETWORK_ID,
    RPC_ENDPOINT_URL,
};
