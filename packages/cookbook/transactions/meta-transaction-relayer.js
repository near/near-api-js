const { Account } = require('@near-js/accounts');
const { UnencryptedFileSystemKeyStore } = require('@near-js/keystores-node');
const { JsonRpcProvider } = require('@near-js/providers');
const { InMemorySigner } = require('@near-js/signers');
const { actionCreators } = require('@near-js/transactions');
const BN = require('bn.js');
const os = require('os');
const path = require('path');

const { transfer } = actionCreators;

async function sendNearThroughRelayer({ amount, receiverId, senderAccount }) {
    const response = await senderAccount.signAndSendSignedDelegate({
        actions: [transfer(amount)],
        receiverId,
        relayerUrl: 'https://relayer.org/relay',
    });

    console.log(response);
    return response;
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

        await sendNearThroughRelayer({
            amount: new BN('1000000000'),
            receiverId: RECEIVER_ACCOUNT_ID,
            senderAccount,
        });
    }());
}