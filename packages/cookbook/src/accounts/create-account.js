const { connect, KeyPair, keyStores, utils } = require('near-api-js');
const os = require('os');
const path = require('path');

async function createAccount({ amount, creatorAccountId, keyStore, networkId, newAccountId, nodeUrl }) {
    const keyPair = KeyPair.fromRandom('ed25519');
    const publicKey = keyPair.publicKey.toString();

    const near = await connect({ keyStore, networkId, nodeUrl });
    const creatorAccount = await near.account(creatorAccountId);

    await keyStore.setKey(networkId, newAccountId, keyPair);

    return creatorAccount.functionCall({
        contractId: networkId === 'mainnet' ? 'near' : networkId,
        methodName: 'create_account',
        args: {
            new_account_id: newAccountId,
            new_public_key: publicKey,
        },
        gas: '300000000000000',
        attachedDeposit: utils.format.parseNearAmount(amount),
    });
}

module.exports = {
    createAccount,
};

const HELP = `Please run this script in the following format:

    node create-account.js NETWORK CREATOR_ACCOUNT.testnet NEW_ACCOUNT.testnet AMOUNT

    e.g.
    node create-account.js testnet creator_account.testnet new_account.testnet 1
    node create-account.js mainnet creator_account.near new_account.near 1
`;

if (require.main === module) {
    (async function () {
        if (process.argv.length !== 6) {
            console.info(HELP);
            process.exit(1);
        }

        const networkId = process.argv[2];
        const nodeUrl = `https://rpc.${networkId}.near.org`;

        const CREDENTIALS_DIR = '.near-credentials';
        const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);
        const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

        await createAccount({
            amount: process.argv[5],
            creatorAccountId: process.argv[3],
            keyStore,
            networkId,
            newAccountId: process.argv[4],
            nodeUrl,
        });
    }());
}
