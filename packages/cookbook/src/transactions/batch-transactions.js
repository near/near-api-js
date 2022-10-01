const BN = require('bn.js');
const fs = require('fs');
const { connect, transactions, keyStores } = require('near-api-js');
const os = require('os');
const path = require('path');

async function sendTransactions({ contractName, contractWasm, keyStore, networkId, nodeUrl, whitelistAccountId }) {
    const near = await connect({ keyStore, networkId, nodeUrl });
    const account = await near.account(contractName);

    return account.signAndSendTransaction({
        receiverId: contractName,
        actions: [
            transactions.deployContract(contractWasm),
            transactions.functionCall(
                'new',
                Buffer.from(JSON.stringify({
                    staking_pool_whitelist_account_id: whitelistAccountId,
                })),
                new BN(10000000000000),
                new BN(0)
            ),
        ],
    });
}

module.exports = {
    sendTransactions,
};

if (require.main === module) {
    (async function () {
        const contractName = 'contract.example.testnet';
        const contractWasm = fs.readFileSync(path.join(__dirname, '../utils/wasm-files/staking_pool_factory.wasm'));
        const networkId = 'testnet';
        const nodeUrl = 'https://rpc.testnet.near.org';
        const whitelistAccountId = 'whitelisted-account.example.testnet';

        const CREDENTIALS_DIR = '.near-credentials';
        const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);
        const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

        const outcome = await sendTransactions({
            contractName,
            contractWasm,
            keyStore,
            networkId,
            nodeUrl,
            whitelistAccountId,
        });
        console.log({ outcome });
    }());
}
