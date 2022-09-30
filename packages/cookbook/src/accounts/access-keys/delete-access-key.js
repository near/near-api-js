const { keyStores, connect } = require('near-api-js');
const os = require('os');
const path = require('path');

async function deleteAccessKey({ accountId, keyStore, networkId, nodeUrl, publicKey }) {
    const near = await connect({ keyStore, networkId, nodeUrl });
    const account = await near.account(accountId);
    await account.deleteKey(publicKey);
}

if (require.main === module) {
    (async function () {
        const accountId = 'example.testnet';
        const networkId = 'testnet';
        const nodeUrl = 'https://rpc.testnet.near.org';
        const publicKey = 'ed25519:4yLYjwC3Rd8EkhKwVPoAdy6EUcCVSz2ZixFtsCeuBEZD';

        const CREDENTIALS_DIR = '.near-credentials';
        const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);
        const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

        await deleteAccessKey({ accountId, keyStore, networkId, nodeUrl, publicKey });
    }());
}
