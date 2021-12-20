// demonstrates how to use API-KEY with provider 
const { providers } = require("near-api-js");

const API_KEY = '<Replace this string with your API KEY>';

const provider = new providers.JsonRpcProvider({
    url: 'https://testnet.rpc.near.dev',
    apiKeys: { 'https://testnet.rpc.near.dev': API_KEY }
});

getNetworkStatus();

async function getNetworkStatus() {
    const result = await provider.status();
    console.log(result);
}