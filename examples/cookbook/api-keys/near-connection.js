// demonstrates how to use API-KEY with 'connect' function. 
const { connect, keyStores } = require("near-api-js");
const path = require("path");

const homedir = require("os").homedir();
const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

//TODO: use https when it's available
const RPC_API_ENDPOINT = 'http://34.141.205.230:3030/';
//TODO: should we keep example API_KEY here?
const API_KEY = 'ZmowOTMyNHUwMnUzNDA5MnUzMDk0dTIzeA==';

const ACCOUNT_ID = 'serhii.testnet';

const config = {
    networkId: 'testnet',
    keyStore,
    nodeUrl: RPC_API_ENDPOINT,
};

async function getState(accountId) {
    const near = await connect(config);
    const account = await near.account(accountId);
    const state = await account.state();
    console.log(state);
}

getState(ACCOUNT_ID);