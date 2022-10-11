const { connect } = require('near-api-js');

async function getAccountStateWithApiKey({ accountId, apiKey, networkId, nodeUrl }) {
    const near = await connect({
        headers: { 'x-api-key': apiKey },
        networkId,
        nodeUrl,
    });
    const account = await near.account(accountId);
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
