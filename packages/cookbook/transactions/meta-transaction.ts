import {
    buildSignedDelegate,
    getPlaintextFilesystemSigner,
    getTestnetRpcProvider,
    SignedTransactionComposer,
} from '@near-js/client';
import { actionCreators } from '@near-js/transactions';
import chalk from 'chalk';
import { join } from 'node:path';
import { homedir } from 'node:os';

// access keys are required for the sender and signer
const RECEIVER_ACCOUNT_ID = 'receiver.testnet'; // the ultimate recipient of the meta transaction execution
const SENDER_ACCOUNT_ID = 'sender.testnet';     // the account requesting the transaction be executed
const SIGNER_ACCOUNT_ID = 'signer.testnet';     // the account executing the meta transaction on behalf (e.g. as a relayer) of the sender

export default async function metaTransaction(signerAccountId: string = SIGNER_ACCOUNT_ID, receiverAccountId: string = RECEIVER_ACCOUNT_ID, senderAccountId: string = SENDER_ACCOUNT_ID): Promise<any> {
    if (!signerAccountId || !receiverAccountId || !senderAccountId) {
        console.log(chalk`{red pnpm metaTransaction -- [SIGNER_ACCOUNT_ID] [RECEIVER_ACCOUNT_ID] [SENDER_ACCOUNT_ID]}`);
        return;
    }

    const credentialsPath = join(homedir(), '.near-credentials');

    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();
    // initialize the transaction signer using a pre-existing key for `accountId`
    const { signer } = getPlaintextFilesystemSigner({ account: signerAccountId, network: 'testnet', filepath: credentialsPath });

    // define the set of actions for the relayer to execute on behalf of the signer
    const innerActions = [actionCreators.transfer(100n)];

    // create the signed delegate action encapsulating the inner transaction
    const { delegateAction, signature } = await buildSignedDelegate({
        account: signerAccountId,
        receiver: receiverAccountId,
        actions: innerActions,
        blockHeightTtl: 100,
        deps: {
            rpcProvider,
            signer,
        },
    });

    // initialize the relayer's signer
    const { signer: relayerSigner } = getPlaintextFilesystemSigner({
        account: senderAccountId,
        network: 'testnet',
        filepath: credentialsPath,
    });

    // sign the outer transaction using the relayer's key
    return SignedTransactionComposer.init({
        sender: senderAccountId,
        receiver: receiverAccountId,
        deps: { rpcProvider, signer: relayerSigner },
    })
      .signedDelegate(delegateAction, signature)
      .signAndSend();
}
