const { connect, keyStores } = require('near-api-js');
const os = require('os');
const path = require('path');

async function getAccountStateWithApiKey({ accountId, apiKey, keyStore, networkId, nodeUrl }) {
    const near = await connect({
        headers: { 'x-api-key': apiKey },
        keyStore,
        networkId,
        nodeUrl,
    });
    const account = await near.account(accountId);
    return account.state();
}

module.exports = {
    getAccountStateWithApiKey,
};

if (require.main === module) {
    (async function () {
        const accountId = 'test.testnet';
        const apiKey = 'REPLACE_WITH_REAL_API_KEY';
        const networkId = 'testnet';
        const nodeUrl = 'https://rpc.testnet.near.org';

        const CREDENTIALS_DIR = '.near-credentials';
        const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);
        const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

        const state = await getAccountStateWithApiKey({ accountId, apiKey, keyStore, networkId, nodeUrl });
        console.log({ state });
    }());
}
