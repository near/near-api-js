// demonstrates how to use API-KEY with provider 
const { providers } = require("near-api-js");

const API_KEY = '<Replace this string with your API KEY>';

const provider = new providers.JsonRpcProvider({
    url: '<Replace this string with your RPC server URL>',
    // RPC server URL in apiKeys should match the one specified in url
    apiKeys: { '<Replace this string with your RPC server URL>': API_KEY }
});

getNetworkStatus();

async function getNetworkStatus() {
    const result = await provider.status();
    console.log(result);
}