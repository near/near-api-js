const { providers } = require('near-api-js');

async function getTransactionStatus({ accountId, nodeUrl, txHash }) {
    const provider = new providers.JsonRpcProvider({
        url: nodeUrl,
    });

    return provider.txStatus(txHash, accountId);
}

module.exports = {
    getTransactionStatus,
};

if (require.main === module) {
    (async function () {
        const accountId = 'sender.testnet'; // account associated with the transaction
        const nodeUrl = 'https://archival-rpc.testnet.near.org';
        const txHash = '9av2U6cova7LZPA9NPij6CTUrpBbgPG6LKVkyhcCqtk3';

        const status = await getTransactionStatus({ accountId, nodeUrl, txHash });
        console.log({ status });
    }());
}
