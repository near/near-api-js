// demonstrates how to use multiple providers with different API-KEYs
const { providers } = require('near-api-js');

const RPC_API_ENDPOINT_1 = '<Replace this string with your RPC server URL>';
const API_KEY_1 = '<Replace this string with your API KEY>';

const RPC_API_ENDPOINT_2 = '<Replace this string with another RPC server URL>';
const API_KEY_2 = '<Replace this string with another API KEY>';

const jsonProviders = [
    new providers.JsonRpcProvider({
        url: RPC_API_ENDPOINT_1,
        headers: { 'x-api-key': API_KEY_1 },
    }),
    new providers.JsonRpcProvider({
        url: RPC_API_ENDPOINT_2,
        headers: { 'x-api-key': API_KEY_2 },
    }),
];
const provider = new providers.FailoverRpcProvider(jsonProviders);

getNetworkStatus();

async function getNetworkStatus() {
    const result = await provider.status();
    console.log(result);
}
