const { Account } = require('@near-js/accounts');
const { JsonRpcProvider } = require('@near-js/providers');

async function getAccountStateWithApiKey({ accountId, apiKey, networkId, nodeUrl }) {
    const account = new Account({
        networkId,
        provider: new JsonRpcProvider({
            headers: { 'x-api-key': apiKey },
            url: nodeUrl,
        }),
    }, accountId);

    return account.state();
}

module.exports = {
    getAccountStateWithApiKey,
};

if (require.main === module) {
    (async function () {
        const accountId = 'test.testnet';
        const apiKey = 'REPLACE_WITH_REAL_API_KEY';
        const networkId = 'testnet';
        const nodeUrl = 'https://rpc.testnet.near.org';

        const state = await getAccountStateWithApiKey({ accountId, apiKey, networkId, nodeUrl });
        console.log({ state });
    }());
}
