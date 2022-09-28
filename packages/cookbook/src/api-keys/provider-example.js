// demonstrates how to use API-KEY with provider 
const { providers } = require('near-api-js');

const RPC_API_ENDPOINT = '<Replace this string with your RPC server URL>';
const API_KEY = '<Replace this string with your API KEY>';

const provider = new providers.JsonRpcProvider({
    url: RPC_API_ENDPOINT,
    headers: { 'x-api-key': API_KEY },
});

getNetworkStatus();

async function getNetworkStatus() {
    const result = await provider.status();
    console.log(result);
}