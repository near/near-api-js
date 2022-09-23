// demonstrates how to use API-KEY with 'connect' function. 
const { connect, keyStores } = require('near-api-js');
const path = require('path');

const homedir = require('os').homedir();
const CREDENTIALS_DIR = '.near-credentials';
const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
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
    const state = await account.state();
    console.log(state);
}

getState(ACCOUNT_ID);