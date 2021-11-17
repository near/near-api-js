// demonstrates how to use API-KEY with 'connect' function. 
const { connect, keyStores } = require("near-api-js");
const path = require("path");

const homedir = require("os").homedir();
const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const RPC_API_ENDPOINT = 'http://34.141.205.230:3030/';
const API_KEY = 'ZmowOTMyNHUwMnUzNDA5MnUzMDk0dTIzeA==';

const ACCOUNT_ID = 'serhii.near';

const config = {
    networkId: 'mainnet',
    keyStore,
    nodeUrl: RPC_API_ENDPOINT,
    nodeUrlApiKey: API_KEY,
};

async function getState(accountId) {
    const near = await connect(config);
    const account = await near.account(accountId);
    const state = await account.state();
    console.log(state);
}

getState(ACCOUNT_ID);