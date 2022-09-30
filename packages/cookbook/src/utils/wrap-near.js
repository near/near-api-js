const BN = require('bn.js');
const { connect, keyStores, transactions, utils, DEFAULT_FUNCTION_CALL_GAS } = require('near-api-js');
const os = require('os');
const path = require('path');

// On mainnet it's wrap.near, by the way
const WRAP_NEAR_CONTRACT_ID = 'wrap.testnet';

const credentialsPath = path.join(os.homedir(), '.near-credentials');
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const config = {
    keyStore,
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
};

async function wrapNear(accountId, wrapAmount) {
    const near = await connect(config);
    const account = await near.account(accountId);

    const actions = [
        transactions.functionCall(
            'near_deposit', // contract method to deposit NEAR for wNEAR
            {},
            DEFAULT_FUNCTION_CALL_GAS, // attached gas
            new BN(utils.format.parseNearAmount(wrapAmount)) // amount of NEAR to deposit and wrap
        ),
    ];

  // check if storage has been paid (the account has a wNEAR account)
  const storage = await account.viewFunction({
    contractId: WRAP_NEAR_CONTRACT_ID,
    methodName: 'storage_balance_of',
    args: { account_id: accountId },
  });

    // if storage hasn't been paid, pay for storage (create an account)
    if (!storage) {
        actions.unshift(
            transactions.functionCall(
                'storage_deposit', // method to create an account
                {},
                DEFAULT_FUNCTION_CALL_GAS, // attached gas
                new BN(utils.format.parseNearAmount('0.00125')) // account creation costs 0.00125 NEAR for storage
            )
        );
    }

    // send batched transaction
    return account.signAndSendTransaction({
        receiverId: WRAP_NEAR_CONTRACT_ID,
        actions,
    });
}

const HELP = `To convert N $NEAR to wNEAR,  run this script in the following format:

    node wrap-near.js YOU.near N

`;

if (process.argv.length !== 4) {
    console.info(HELP);
    process.exit(1);
}

if (require.main === module) {
    (async function () {
        await wrapNear(process.argv[2], process.argv[3]);
    }());
}
