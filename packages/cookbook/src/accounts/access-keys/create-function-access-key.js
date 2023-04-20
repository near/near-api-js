const { Account } = require('@near-js/accounts');
const { KeyPair } = require('@near-js/crypto');
const { UnencryptedFileSystemKeyStore } = require('@near-js/keystores-node');
const { JsonRpcProvider } = require('@near-js/providers');
const BN = require('bn.js');
const os = require('os');
const path = require('path');
const { InMemorySigner } = require('@near-js/signers');

async function addFunctionAccessKey({ accountId, keyStore, networkId, nodeUrl }) {
    const keyPair = KeyPair.fromRandom('ed25519');
    const publicKey = keyPair.publicKey.toString();

    const account = new Account({
        networkId,
        provider: new JsonRpcProvider({ url: nodeUrl }),
        signer: new InMemorySigner(keyStore),
    }, accountId);

    await keyStore.setKey(networkId, publicKey, keyPair);
    await account.addKey(
        publicKey,                          // public key for new account
        'example-account.testnet', // contract this key is allowed to call (optional)
        'example_method',       // methods this key is allowed to call (optional)
        new BN(2500000000000)        // allowance key can use to call methods (optional)
    );

    return publicKey;
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
        const keyStore = new UnencryptedFileSystemKeyStore(credentialsPath);

        const publicKey = await addFunctionAccessKey({ accountId, keyStore, networkId, nodeUrl });
        console.log(`Added function call access key ${publicKey} to ${accountId}.`);
    }());
}
