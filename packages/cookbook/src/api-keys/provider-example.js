const { providers } = require('near-api-js');

async function getNetworkStatusWithApiKey({ apiKey, nodeUrl }) {
    const provider = new providers.JsonRpcProvider({
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
        const apiKey = '<Replace this string with your API KEY>';
        const nodeUrl = '<Replace this string with your RPC server URL>';

        const status = await getNetworkStatusWithApiKey({ apiKey, nodeUrl });
        console.log({ status });
    }());
}
