const { keyStores } = require('near-api-js');
const os = require('os');
const path = require('path');

const ACCOUNT_ID = 'near-example.testnet';
const CREDENTIALS_DIR = '.near-credentials';

const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const config = {
    keyStore,
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
};

async function verifySignature() {
    const keyPair = await keyStore.getKey(config.networkId, ACCOUNT_ID);
    const msg = Buffer.from('hi');

    const { signature } = keyPair.sign(msg);
    return keyPair.verify(msg, signature);
}

if (require.main === module) {
    (async function () {
        const isValid = await verifySignature();
        console.log({ isValid });
    }());
}
