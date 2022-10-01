const BN = require('bn.js');
const { KeyPair, keyStores, connect } = require('near-api-js');
const os = require('os');
const path = require('path');

async function addFunctionAccessKey({ accountId, keyStore, networkId, nodeUrl }) {
    const keyPair = KeyPair.fromRandom('ed25519');
    const publicKey = keyPair.publicKey.toString();

    const near = await connect({ keyStore, networkId, nodeUrl });
    const account = await near.account(accountId);

    await keyStore.setKey(networkId, publicKey, keyPair);
    await account.addKey(
        publicKey,                          // public key for new account
        'example-account.testnet', // contract this key is allowed to call (optional)
        'example_method',       // methods this key is allowed to call (optional)
        new BN(2500000000000)        // allowance key can use to call methods (optional)
    );
}

module.exports = {
    addFunctionAccessKey,
};

if (require.main === module) {
    (async function () {
        const accountId = 'example.testnet';
        const networkId = 'testnet';
        const nodeUrl = 'https://rpc.testnet.near.org';

        const CREDENTIALS_DIR = '.near-credentials';
        const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);
        const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

        await addFunctionAccessKey({ accountId, keyStore, networkId, nodeUrl });
    }());
}
