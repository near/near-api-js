const { Account } = require('@near-js/accounts');
const { KeyPair } = require('@near-js/crypto');
const { UnencryptedFileSystemKeyStore } = require('@near-js/keystores-node');
const { JsonRpcProvider } = require('@near-js/providers');
const path = require('path');
const os = require('os');
const { InMemorySigner } = require('@near-js/signers');

async function createFullAccessKey({ accountId, keyStore, networkId, nodeUrl }) {
    const keyPair = KeyPair.fromRandom('ed25519');
    const publicKey = keyPair.publicKey.toString();

    const account = new Account({
        networkId,
        provider: new JsonRpcProvider({ url: nodeUrl }),
        signer: new InMemorySigner(keyStore),
    }, accountId);

    await keyStore.setKey(networkId, publicKey, keyPair);
    await account.addKey(publicKey);

    return publicKey;
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
        const keyStore = new UnencryptedFileSystemKeyStore(credentialsPath);

        const publicKey = await createFullAccessKey({
            accountId,
            keyStore,
            networkId,
            nodeUrl,
        });

        console.log(`Added full access key ${publicKey} to ${accountId}.`);
    }());
}
