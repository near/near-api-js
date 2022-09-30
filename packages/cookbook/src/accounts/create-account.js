const { connect, KeyPair, keyStores, utils } = require('near-api-js');
const os = require('os');
const path = require('path');

async function createAccount({ config, creatorAccountId, newAccountId, amount }) {
    const near = await connect(config);
    const creatorAccount = await near.account(creatorAccountId);
    const keyPair = KeyPair.fromRandom('ed25519');
    const publicKey = keyPair.publicKey.toString();
    await config.keyStore.setKey(config.networkId, newAccountId, keyPair);

    return await creatorAccount.functionCall({
        contractId: config.networkId === 'mainnet' ? 'near' : config.networkId,
        methodName: 'create_account',
        args: {
            new_account_id: newAccountId,
            new_public_key: publicKey,
        },
        gas: '300000000000000',
        attachedDeposit: utils.format.parseNearAmount(amount),
    });
}

const HELP = `Please run this script in the following format:

    node create-account.js NETWORK CREATOR_ACCOUNT.testnet NEW_ACCOUNT.testnet AMOUNT

    e.g.
    node create-account.js testnet creator_account.testnet new_account.testnet 1
    node create-account.js mainnet creator_account.near new_account.near 1
`;

if (process.argv.length !== 6) {
    console.info(HELP);
    process.exit(1);
}

if (require.main === module) {
    (async function () {
        const CREDENTIALS_DIR = '.near-credentials';
        const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);
        const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

        const networkId = process.argv[2];
        const config = {
            keyStore,
            networkId,
            nodeUrl: `https://rpc.${networkId}.near.org`,
        };

        await createAccount({
            config,
            creatorAccountId: process.argv[3],
            newAccountId: process.argv[4],
            amount: process.argv[5],
        });
    }());
}
