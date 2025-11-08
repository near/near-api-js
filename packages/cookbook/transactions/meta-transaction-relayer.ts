import {
  getSignerFromKeystore,
  getTestnetRpcProvider,
  SignedTransactionComposer,
} from '@near-js/client';
import { encodeSignedDelegate } from '@near-js/transactions';
import chalk from 'chalk';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { UnencryptedFileSystemKeyStore } from '@near-js/keystores-node';

/**
 * Submit a transaction to a relayer
 * @param signerAccountId account requesting the transaction's execution
 * @param receiverAccountId recipient of the transaction
 * @param relayerUrl URL processing relayer requests
 */
export default async function sendMetaTransactionViaRelayer(signerAccountId: string, receiverAccountId: string, relayerUrl: string) {
  if (!signerAccountId || !receiverAccountId) {
    console.log(chalk`{red bun run metaTransaction -- SENDER_ACCOUNT_ID RECEIVER_ACCOUNT_ID RELAYER_URL}`);
    return;
  }

  // initialize testnet RPC provider
  const rpcProvider = getTestnetRpcProvider();
  // initialize the transaction signer using a pre-existing key for `accountId`
  const signer = await getSignerFromKeystore(signerAccountId, 'testnet', new UnencryptedFileSystemKeyStore(join(homedir(), '.near-credentials')));

  const signedDelegate = await SignedTransactionComposer.init({
    sender: signerAccountId,
    receiver: receiverAccountId,
    deps: {
      rpcProvider,
      signer,
    },
  })
    .transfer(100n)
    .toSignedDelegateAction({ blockHeightTtl: 60n });

  // @ts-ignore global
  const res = await fetch(relayerUrl, {
    method: 'POST',
    body: JSON.stringify(Array.from(encodeSignedDelegate(signedDelegate))),
  });
  console.log(await res.json());
}
