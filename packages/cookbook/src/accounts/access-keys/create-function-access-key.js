const { KeyPair, keyStores, connect } = require('near-api-js');
const path = require('path');
const homedir = require('os').homedir();

const CREDENTIALS_DIR = '.near-credentials';
const ACCOUNT_ID = 'example.testnet';
const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const config = {
    keyStore,
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
};

async function addFunctionAccessKey(accountId) {
    const keyPair = KeyPair.fromRandom('ed25519');
    const publicKey = keyPair.publicKey.toString();
    const near = await connect(config);
    const account = await near.account(accountId);
    await keyStore.setKey(config.networkId, publicKey, keyPair);
    await account.addKey(
        publicKey,                   // public key for new account
        'example-account.testnet',   // contract this key is allowed to call (optional)
        'example_method',            // methods this key is allowed to call (optional)
        '2500000000000'              // allowance key can use to call methods (optional)
    );
}

if (require.main === module) {
    (async function () {
        await addFunctionAccessKey(ACCOUNT_ID);
    }());
}
