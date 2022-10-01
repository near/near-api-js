const { providers } = require('near-api-js');

async function accountExists({ accountId, nodeUrl }) {
    const provider = new providers.JsonRpcProvider({
        url: nodeUrl,
    });

    try {
        await provider.query({
            request_type: 'view_account',
            account_id: accountId,
            finality: 'final',
        });
    } catch (e) {
        if (e.type === 'AccountDoesNotExist') {
            return false;
        }
    }

    return true;
}

module.exports = {
    accountExists,
};

if (require.main === module) {
    (async function () {
        const accounts = {
            doesNotExist: 'does-not-exist.mike.testnet',
            exists: 'mike.testnet',
        };
        const nodeUrl = 'https://archival-rpc.testnet.near.org';

        const shouldExist = await accountExists({ accountId: accounts.exists, nodeUrl });
        const shouldNotExist = await accountExists({ accountId: accounts.doesNotExist, nodeUrl });

        console.log({
            shouldExist,
            shouldNotExist,
        });
    }());
}
