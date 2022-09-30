const { KeyPair, keyStores, connect } = require('near-api-js');
const path = require('path');
const os = require('os');

const CREDENTIALS_DIR = '.near-credentials';
const ACCOUNT_ID = 'example.testnet';
const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const config = {
    keyStore,
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
};

async function createFullAccessKey(accountId) {
    const keyPair = KeyPair.fromRandom('ed25519');
    const publicKey = keyPair.publicKey.toString();
    const near = await connect(config);
    const account = await near.account(accountId);
    await keyStore.setKey(config.networkId, publicKey, keyPair);
    await account.addKey(publicKey);
}

if (require.main === module) {
    (async function () {
        await createFullAccessKey(ACCOUNT_ID);
    }());
}
