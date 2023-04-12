const { Account } = require('@near-js/accounts');
const { UnencryptedFileSystemKeyStore } = require('@near-js/keystores-node');
const { JsonRpcProvider } = require('@near-js/providers');
const { InMemorySigner } = require('@near-js/signers');
const { actionCreators } = require('@near-js/transactions');
const BN = require('bn.js');
const os = require('os');
const path = require('path');

const { signedDelegate, transfer } = actionCreators;

async function sendNearViaMetaTransaction({ amount, receiverId, senderAccount, signingAccount }) {
    const delegate = await senderAccount.signedDelegate({
        actions: [transfer(amount)],
        receiverId,
    });

    return signingAccount.signAndSendTransaction({
        actions: [signedDelegate(delegate)],
        receiverId: delegate.delegateAction.senderId,
    });
}

module.exports = {
    sendNearViaMetaTransaction,
};

if (require.main === module) {
    (async function () {
        const networkId = 'testnet';
        const provider = new JsonRpcProvider({ url: 'https://rpc.testnet.near.org' });

        const CREDENTIALS_DIR = '.near-credentials';
        const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);

        // access keys are required for the sender and signer
        const RECEIVER_ACCOUNT_ID = 'receiver.testnet'; // the ultimate recipient of the meta transaction execution
        const SENDER_ACCOUNT_ID = 'sender.testnet';     // the account requesting the transaction be executed
        const SIGNER_ACCOUNT_ID = 'signer.testnet';     // the account executing the meta transaction on behalf (e.g. as a relayer) of the sender

        const senderAccount = new Account({
            networkId,
            provider,
            signer: new InMemorySigner(new UnencryptedFileSystemKeyStore(credentialsPath))
        }, SENDER_ACCOUNT_ID);

        const signingAccount = new Account({
            networkId,
            provider,
            signer: new InMemorySigner(new UnencryptedFileSystemKeyStore(credentialsPath))
        }, SIGNER_ACCOUNT_ID);

        console.log(await sendNearViaMetaTransaction({
            amount: new BN('1000000000'),
            receiverId: RECEIVER_ACCOUNT_ID,
            senderAccount,
            signingAccount,
        }));
    }());
}