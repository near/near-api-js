const HELP = `Please run this script in the following format:

  node create-mainnet-account.js CREATOR_ACCOUNT.near NEW_ACCOUNT.near AMOUNT"
`;

const { connect, KeyPair, keyStores, utils } = require('near-api-js');
const path = require('path');
const homedir = require('os').homedir();

const CREDENTIALS_DIR = '.near-credentials';
const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const config = {
    keyStore,
    networkId: 'mainnet',
    nodeUrl: 'https://rpc.mainnet.near.org',
};

if (process.argv.length !== 5) {
    console.info(HELP);
    process.exit(1);
}

createAccount(process.argv[2], process.argv[3], process.argv[4]);

async function createAccount(creatorAccountId, newAccountId, amount) {
    const near = await connect(config);
    const creatorAccount = await near.account(creatorAccountId);
    const keyPair = KeyPair.fromRandom('ed25519');
    const publicKey = keyPair.publicKey.toString();
    await keyStore.setKey(config.networkId, newAccountId, keyPair);

    return await creatorAccount.functionCall({
        contractId: 'near',
        methodName: 'create_account',
        args: {
            new_account_id: newAccountId,
            new_public_key: publicKey,
        },
        gas: '300000000000000',
        attachedDeposit: utils.format.parseNearAmount(amount),
    });
}
