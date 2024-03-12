const { Account } = require('@near-js/accounts');
const { UnencryptedFileSystemKeyStore } = require('@near-js/keystores-node');
const { JsonRpcProvider, fetchJson } = require('@near-js/providers');
const { InMemorySigner } = require('@near-js/signers');
const { actionCreators, encodeSignedDelegate } = require('@near-js/transactions');
const os = require('os');
const path = require('path');

const { transfer } = actionCreators;

async function sendNearThroughRelayer({ amount, receiverId, senderAccount }) {
    const signedDelegate = await senderAccount.signedDelegate({
        actions: [transfer(amount)],
        blockHeightTtl: 60,
        receiverId
    });

    return fetchJson(
        'https://relayer.org/relay',
        JSON.stringify(Array.from(encodeSignedDelegate(signedDelegate)))
    );
}

module.exports = {
    sendNearThroughRelayer,
};

if (require.main === module) {
    (async function () {
        const networkId = 'testnet';
        const provider = new JsonRpcProvider({ url: 'https://rpc.testnet.near.org' });

        const CREDENTIALS_DIR = '.near-credentials';
        const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);

        const RECEIVER_ACCOUNT_ID = 'receiver.testnet'; // the ultimate recipient of the meta transaction execution
        const SENDER_ACCOUNT_ID = 'sender.testnet';     // the account requesting the transaction be executed

        const senderAccount = new Account({
            networkId,
            provider,
            signer: new InMemorySigner(new UnencryptedFileSystemKeyStore(credentialsPath))
        }, SENDER_ACCOUNT_ID);

        console.log(await sendNearThroughRelayer({
            amount: BigInt('1000000000'),
            receiverId: RECEIVER_ACCOUNT_ID,
            senderAccount,
        }));
    }());
}