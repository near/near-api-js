const { keyStores } = require('near-api-js');
const os = require('os');
const path = require('path');

async function verifySignature({ accountId, keyStore, message, networkId }) {
    const keyPair = await keyStore.getKey(networkId, accountId);
    const { signature } = keyPair.sign(message);
    return keyPair.verify(message, signature);
}

if (require.main === module) {
    (async function () {
        const accountId = 'near-example.testnet';
        const message = Buffer.from('hi');
        const networkId = 'testnet';

        const CREDENTIALS_DIR = '.near-credentials';
        const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);
        const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

        const isValid = await verifySignature({ accountId, keyStore, message, networkId });
        console.log({ isValid });
    }());
}
