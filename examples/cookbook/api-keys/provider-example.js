// demonstrates how to use API-KEY with provider 
const { providers } = require("near-api-js");

const RPC_API_ENDPOINT = 'http://34.141.205.230:3030/';
const API_KEY = 'ZmowOTMyNHUwMnUzNDA5MnUzMDk0dTIzeA==';

const provider = new providers.JsonRpcProvider({
    url: RPC_API_ENDPOINT,
    headers: { 'X-API-KEY': API_KEY },
});

getNetworkStatus();

async function getNetworkStatus() {
    const result = await provider.status();
    console.log(result);
}