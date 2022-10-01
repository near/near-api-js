const chalk = require('chalk');
const { connect, keyStores, utils } = require('near-api-js');
const os = require('os');
const path = require('path');

async function calculateGas({ accountId, contractId, keyStore, maxGas, methodName, networkId, nodeUrl, args, depositAmount }) {
    const near = await connect({ keyStore, networkId, nodeUrl });
    const account = await near.account(accountId);
    const { receipts_outcome, transaction_outcome } = await account.functionCall({
        contractId,
        methodName,
        args,
        gas: maxGas,
        attachedDeposit: utils.format.parseNearAmount(depositAmount),
    });

    const { totalGasBurned, totalTokensBurned } = receipts_outcome.reduce(
        (acc, receipt) => {
            acc.totalGasBurned += receipt.outcome.gas_burnt;
            acc.totalTokensBurned += utils.format.formatNearAmount(receipt.outcome.tokens_burnt);
            return acc;
        },
        {
            totalGasBurned: transaction_outcome.outcome.gas_burnt,
            totalTokensBurned: utils.format.formatNearAmount(
                transaction_outcome.outcome.tokens_burnt
            ),
        }
    );

    return {
        totalTokensBurned,
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
        const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

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
