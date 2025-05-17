import {
  getSignerFromKeystore,
  getTestnetRpcProvider,
  SignedTransactionComposer,
} from '@near-js/client';
import chalk from 'chalk';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { UnencryptedFileSystemKeyStore } from '@near-js/keystores-node';

// access keys are required for the sender and signer
const RECEIVER_ACCOUNT_ID = 'receiver.testnet'; // the ultimate recipient of the meta transaction execution
const SENDER_ACCOUNT_ID = 'sender.testnet';     // the account requesting the transaction be executed
const SIGNER_ACCOUNT_ID = 'signer.testnet';     // the account executing the meta transaction on behalf (e.g. as a relayer) of the sender

/**
 * Sign and send a meta transaction
 * @param signerAccountId the account that wants actions executed on their behalf
 * @param receiverAccountId ultimate recipient of the transaction
 * @param senderAccountId the account (i.e. relayer) executing the transaction on behalf of the signer
 */
export default async function metaTransaction(signerAccountId: string = SIGNER_ACCOUNT_ID, receiverAccountId: string = RECEIVER_ACCOUNT_ID, senderAccountId: string = SENDER_ACCOUNT_ID): Promise<any> {
    if (!signerAccountId || !receiverAccountId || !senderAccountId) {
        console.log(chalk`{red pnpm metaTransaction -- [SIGNER_ACCOUNT_ID] [RECEIVER_ACCOUNT_ID] [SENDER_ACCOUNT_ID]}`);
        return;
    }

    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();
    // initialize the transaction signer using a pre-existing key for `accountId`
    const signer = await getSignerFromKeystore(
      signerAccountId,
      'testnet',
      new UnencryptedFileSystemKeyStore(join(homedir(), '.near-credentials'))
    );

    const { delegateAction, signature } = await SignedTransactionComposer.init({
        sender: signerAccountId,
        receiver: receiverAccountId,
        deps: {
            rpcProvider,
            signer,
        },
    })
      .transfer(100n)
      .toSignedDelegateAction();

    // initialize the relayer's signer
    const relayerSigner = await getSignerFromKeystore(
      senderAccountId,
      'testnet',
      new UnencryptedFileSystemKeyStore(join(homedir(), '.near-credentials'))
    );

    // sign the outer transaction using the relayer's key
    return SignedTransactionComposer.init({
        sender: senderAccountId,
        receiver: receiverAccountId,
        deps: { rpcProvider, signer: relayerSigner },
    })
      .signedDelegate(delegateAction, signature)
      .signAndSend();
}
