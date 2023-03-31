const { Account } = require('@near-js/accounts');
const { UnencryptedFileSystemKeyStore } = require('@near-js/keystores-node');
const { JsonRpcProvider } = require('@near-js/providers');
const { formatNearAmount, parseNearAmount } = require('@near-js/utils');
const BN = require('bn.js');
const chalk = require('chalk');
const os = require('os');
const path = require('path');
const { InMemorySigner } = require('@near-js/signers');

async function calculateGas({ accountId, contractId, keyStore, maxGas, methodName, networkId, nodeUrl, args, depositAmount }) {
    const account = new Account({
        networkId,
        provider: new JsonRpcProvider({ url: nodeUrl }),
        signer: new InMemorySigner(keyStore),
    }, accountId);

    const { receipts_outcome, transaction_outcome } = await account.functionCall({
        contractId,
        methodName,
        args,
        gas: maxGas,
        attachedDeposit: parseNearAmount(depositAmount),
    });

    const { totalGasBurned, totalTokensBurned } = receipts_outcome.reduce(
        (acc, receipt) => {
            acc.totalGasBurned += receipt.outcome.gas_burnt;
            acc.totalTokensBurned = acc.totalTokensBurned.add(new BN(receipt.outcome.tokens_burnt));
            return acc;
        },
        {
            totalGasBurned: transaction_outcome.outcome.gas_burnt,
            totalTokensBurned: new BN(transaction_outcome.outcome.tokens_burnt),
        }
    );

    return {
        totalTokensBurned: formatNearAmount(totalTokensBurned),
        totalGasBurned,
    };
}

module.exports = {
    calculateGas,
};

if (require.main === module) {
    (async function () {
        const accountId = 'near-example.testnet';
        const contractId = 'guest-book.testnet';
        const methodName = 'addMessage';
        const maxGas = '300000000000000';
        const networkId = 'testnet';
        const nodeUrl = 'https://archival-rpc.testnet.near.org';
        const depositAmount = '0';
        const args = {
            text: 'Howdy!',
        };

        const CREDENTIALS_DIR = '.near-credentials';
        const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR, 'testnet');
        const keyStore = new UnencryptedFileSystemKeyStore(credentialsPath);

        const {
            totalGasBurned,
            totalTokensBurned,
        } = await calculateGas({ accountId, args, contractId, depositAmount, keyStore, maxGas, methodName, networkId, nodeUrl });

        console.log(chalk`{white ------------------------------------------------------------------------ }`);
        console.log(chalk`{bold.green RESULTS} {white for: [ {bold.blue ${methodName}} ] called on contract: [ {bold.blue ${contractId}} ]}` );
        console.log(chalk`{white ------------------------------------------------------------------------ }`);
        console.log(chalk`{bold.white Gas Burnt}     {white |}  {bold.yellow ${totalGasBurned}}`);
        console.log(chalk`{bold.white Tokens Burnt}  {white |}  {bold.yellow ${totalTokensBurned}}`);
        console.log(chalk`{white ------------------------------------------------------------------------ }`);
    }());
}
