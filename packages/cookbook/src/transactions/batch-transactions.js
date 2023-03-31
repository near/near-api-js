const { Account } = require('@near-js/accounts');
const { UnencryptedFileSystemKeyStore } = require('@near-js/keystores-node');
const { JsonRpcProvider } = require('@near-js/providers');
const { InMemorySigner } = require('@near-js/signers');
const { actionCreators } = require('@near-js/transactions');
const BN = require('bn.js');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { deployContract, functionCall } = actionCreators;

async function sendTransactions({ contractName, contractWasm, keyStore, networkId, nodeUrl, whitelistAccountId }) {
    const account = new Account({
        networkId,
        provider: new JsonRpcProvider({ url: nodeUrl }),
        signer: new InMemorySigner(keyStore),
    }, contractName);

    return account.signAndSendTransaction({
        receiverId: contractName,
        actions: [
            deployContract(contractWasm),
            functionCall(
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
        const contractWasm = fs.readFileSync(path.join(__dirname, '../../contracts/staking_pool_factory.wasm'));
        const networkId = 'testnet';
        const nodeUrl = 'https://rpc.testnet.near.org';
        const whitelistAccountId = 'whitelisted-account.example.testnet';

        const CREDENTIALS_DIR = '.near-credentials';
        const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);
        const keyStore = new UnencryptedFileSystemKeyStore(credentialsPath);

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
