import { Account, Connection } from '@near-js/accounts';

const account = new Account(Connection.fromConfig({
    networkId: 'mainnet',
    provider: { type: 'JsonRpcProvider', args: { url: 'https://rpc.testnet.near.org' } },
    signer: { type: 'InMemorySigner', keyStore: {} },
}), 'gornt.testnet');

(async function () {
    console.log(await account.getAccessKeys());
}());
