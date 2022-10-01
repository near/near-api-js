const { KeyPair, keyStores, connect } = require('near-api-js');
const path = require('path');
const os = require('os');

async function createFullAccessKey({ accountId, keyStore, networkId, nodeUrl }) {
    const keyPair = KeyPair.fromRandom('ed25519');
    const publicKey = keyPair.publicKey.toString();

    const near = await connect({ keyStore, networkId, nodeUrl });
    const account = await near.account(accountId);

    await keyStore.setKey(networkId, publicKey, keyPair);
    await account.addKey(publicKey);
}

module.exports = {
    createFullAccessKey,
};

if (require.main === module) {
    (async function () {
        const accountId = 'example.testnet';
        const networkId = 'testnet';
        const nodeUrl = 'https://rpc.testnet.near.org';

        const CREDENTIALS_DIR = '.near-credentials';
        const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);
        const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

        await createFullAccessKey({
            accountId,
            keyStore,
            networkId,
            nodeUrl,
        });
    }());
}
