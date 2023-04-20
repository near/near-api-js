const { JsonRpcProvider } = require('@near-js/providers');

async function getNetworkStatusWithApiKey({ apiKey, nodeUrl }) {
    const provider = new JsonRpcProvider({
        url: nodeUrl,
        headers: { 'x-api-key': apiKey },
    });

    return provider.status();
}

module.exports = {
    getNetworkStatusWithApiKey,
};

if (require.main === module) {
    (async function () {
        const apiKey = 'REPLACE_WITH_REAL_API_KEY';
        const nodeUrl = 'https://rpc.testnet.near.org';

        const status = await getNetworkStatusWithApiKey({ apiKey, nodeUrl });
        console.log({ status });
    }());
}
