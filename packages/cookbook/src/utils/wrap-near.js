const { Account } = require('@near-js/accounts');
const { UnencryptedFileSystemKeyStore } = require('@near-js/keystores-node');
const { JsonRpcProvider } = require('@near-js/providers');
const { InMemorySigner } = require('@near-js/signers');
const { actionCreators } = require('@near-js/transactions');
const { DEFAULT_FUNCTION_CALL_GAS, parseNearAmount } = require('@near-js/utils');
const BN = require('bn.js');
const os = require('os');
const path = require('path');

const { functionCall } = actionCreators;

async function wrapNear({ accountId, keyStore, networkId, nodeUrl, wrapAmount, wrapContractId }) {
    const account = new Account({
        networkId,
        provider: new JsonRpcProvider({ url: nodeUrl }),
        signer: new InMemorySigner(keyStore),
    }, accountId);

    const actions = [
        functionCall(
            'near_deposit', // contract method to deposit NEAR for wNEAR
            {},
            DEFAULT_FUNCTION_CALL_GAS, // attached gas
            new BN(parseNearAmount(wrapAmount)) // amount of NEAR to deposit and wrap
        ),
    ];

    // check if storage has been paid (the account has a wNEAR account)
    const storage = await account.viewFunction({
        contractId: wrapContractId,
        methodName: 'storage_balance_of',
        args: { account_id: accountId },
    });

    // if storage hasn't been paid, pay for storage (create an account)
    if (!storage) {
        actions.unshift(
            functionCall(
                'storage_deposit', // method to create an account
                {},
                DEFAULT_FUNCTION_CALL_GAS, // attached gas
                new BN(parseNearAmount('0.00125')) // account creation costs 0.00125 NEAR for storage
            )
        );
    }

    // send batched transaction
    return account.signAndSendTransaction({
        receiverId: wrapContractId,
        actions,
    });
}

module.exports = {
    wrapNear,
};

const HELP = `To convert N $NEAR to wNEAR,  run this script in the following format:

    node wrap-near.js YOU.near N

`;

if (require.main === module) {
    (async function () {
        if (process.argv.length !== 4) {
            console.info(HELP);
            process.exit(1);
        }

        const accountId = process.argv[2];
        const networkId = 'testnet';
        const nodeUrl = 'https://rpc.testnet.near.org';
        const wrapAmount = process.argv[3];
        const wrapContractId = 'wrap.testnet';

        const CREDENTIALS_DIR = '.near-credentials';
        const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);
        const keyStore = new UnencryptedFileSystemKeyStore(credentialsPath);

        await wrapNear({ accountId, keyStore, networkId, nodeUrl, wrapAmount, wrapContractId });
    }());
}
