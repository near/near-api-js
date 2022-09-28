// demonstrates how to get a transaction status
const { providers } = require('near-api-js');

//network config (replace testnet with mainnet or betanet)
const provider = new providers.JsonRpcProvider(
    'https://archival-rpc.testnet.near.org'
);

const TX_HASH = '9av2U6cova7LZPA9NPij6CTUrpBbgPG6LKVkyhcCqtk3';
// account ID associated with the transaction
const ACCOUNT_ID = 'sender.testnet';

getState(TX_HASH, ACCOUNT_ID);

async function getState(txHash, accountId) {
    const result = await provider.txStatus(txHash, accountId);
    console.log('Result: ', result);
}
