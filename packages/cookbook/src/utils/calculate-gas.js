const chalk = require('chalk');
const { connect, keyStores, utils } = require('near-api-js');
const os = require('os');
const path = require('path');

const CREDENTIALS_DIR = '.near-credentials';
const ACCOUNT_ID = 'near-example.testnet';
const CONTRACT_ID = 'guest-book.testnet';
const METHOD_NAME = 'addMessage';
const MAX_GAS = '300000000000000';
const ATTACHED_DEPOSIT = '0';

const args = {
    text: 'Howdy!',
};

const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR, 'testnet');
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const config = {
    keyStore,
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
};

async function calculateGas(contractId, methodName, args, depositAmount) {
    const near = await connect(config);
    const account = await near.account(ACCOUNT_ID);
    const { receipts_outcome, transaction_outcome } = await account.functionCall({
        contractId,
        methodName,
        args,
        gas: MAX_GAS,
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

if (require.main === module) {
    (async function () {
        const {
            totalGasBurned,
            totalTokensBurned,
        } = await calculateGas(CONTRACT_ID, METHOD_NAME, args, ATTACHED_DEPOSIT);

        console.log(chalk`{white ------------------------------------------------------------------------ }`);
        console.log(chalk`{bold.green RESULTS} {white for: [ {bold.blue ${METHOD_NAME}} ] called on contract: [ {bold.blue ${CONTRACT_ID}} ]}` );
        console.log(chalk`{white ------------------------------------------------------------------------ }`);
        console.log(chalk`{bold.white Gas Burnt}     {white |}  {bold.yellow ${totalGasBurned}}`);
        console.log(chalk`{bold.white Tokens Burnt}  {white |}  {bold.yellow ${totalTokensBurned}}`);
        console.log(chalk`{white ------------------------------------------------------------------------ }`);
    }());
}
