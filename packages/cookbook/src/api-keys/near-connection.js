const { connect, keyStores } = require('near-api-js');
const os = require('os');
const path = require('path');

const CREDENTIALS_DIR = '.near-credentials';
const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const RPC_API_ENDPOINT = '<Replace this string with your RPC server URL>';
const API_KEY = '<Replace this string with your API KEY>';

const ACCOUNT_ID = '<Replace this string with existing account ID>';

const config = {
    networkId: 'testnet',
    keyStore,
    nodeUrl: RPC_API_ENDPOINT,
    headers: { 'x-api-key': API_KEY },
};

async function getState(accountId) {
    const near = await connect(config);
    const account = await near.account(accountId);
    return account.state();
}

if (require.main === module) {
    (async function () {
        const state = await getState(ACCOUNT_ID);
        console.log({ state });
    }());
}
