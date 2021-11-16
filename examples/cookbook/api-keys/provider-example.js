// demonstrates how to use API-KEY with provider 
const { providers } = require("near-api-js");

const RPC_API_ENDPOINT = 'http://34.141.205.230:3030/';
const API_KEY = 'ZmowOTMyNHUwMnUzNDA5MnUzMDk0dTIzeA=='; //TODO: use API key

const provider = new providers.JsonRpcProvider(
    RPC_API_ENDPOINT
);

getNetworkStatus();

async function getNetworkStatus() {
    const result = await provider.status();
    console.log(result);
}