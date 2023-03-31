const { Account } = require('@near-js/accounts');
const { KeyPair } = require('@near-js/crypto');
const { UnencryptedFileSystemKeyStore } = require('@near-js/keystores-node');
const { JsonRpcProvider } = require('@near-js/providers');
const os = require('os');
const path = require('path');
const { InMemorySigner } = require('@near-js/signers');

async function deleteAccessKey({ accountId, keyStore, networkId, nodeUrl, publicKey }) {
    const account = new Account({
        networkId,
        provider: new JsonRpcProvider({ url: nodeUrl }),
        signer: new InMemorySigner(keyStore),
    }, accountId);

    await account.deleteKey(publicKey);
}

module.exports = {
    deleteAccessKey,
};

if (require.main === module) {
    (async function () {
        const accountId = 'example.testnet';
        const networkId = 'testnet';
        const nodeUrl = 'https://rpc.testnet.near.org';
        const publicKey = 'ed25519:4yLYjwC3Rd8EkhKwVPoAdy6EUcCVSz2ZixFtsCeuBEZD';

        const CREDENTIALS_DIR = '.near-credentials';
        const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);
        const keyStore = new UnencryptedFileSystemKeyStore(credentialsPath);

        await deleteAccessKey({ accountId, keyStore, networkId, nodeUrl, publicKey });
    }());
}
