// Demonstrates checking if an account exists
const { providers } = require('near-api-js');

const provider = new providers.JsonRpcProvider({
    url: 'https://archival-rpc.testnet.near.org',
});

async function accountExists(accountId) {
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

if (require.main === module) {
    (async function () {
        const accounts = {
            doesNotExist: 'does-not-exist.mike.testnet',
            exists: 'mike.testnet',
        };

        const shouldExist = await accountExists(accounts.exists);
        const shouldNotExist = await accountExists(accounts.doesNotExist);

        console.log({
            shouldExist,
            shouldNotExist,
        });
    }());
}
