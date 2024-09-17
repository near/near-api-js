import {
  buildSignedDelegate,
  getPlaintextFilesystemSigner,
  getTestnetRpcProvider,
} from '@near-js/client';
import { actionCreators, encodeSignedDelegate } from '@near-js/transactions';
import chalk from 'chalk';
import { join } from 'node:path';
import { homedir } from 'node:os';

export default async function sendMetaTransactionViaRelayer(signerAccountId: string, receiverAccountId: string, relayerUrl: string) {
  if (!signerAccountId || !receiverAccountId) {
    console.log(chalk`{red pnpm metaTransaction -- SENDER_ACCOUNT_ID RECEIVER_ACCOUNT_ID RELAYER_URL}`);
    return;
  }

  const credentialsPath = join(homedir(), '.near-credentials');

  // initialize testnet RPC provider
  const rpcProvider = getTestnetRpcProvider();
  // initialize the transaction signer using a pre-existing key for `accountId`
  const { signer } = getPlaintextFilesystemSigner({ account: signerAccountId, network: 'testnet', filepath: credentialsPath });

  const signedDelegate = await buildSignedDelegate({
    account: signerAccountId,
    receiver: receiverAccountId,
    actions: [actionCreators.transfer(1000n)],
    blockHeightTtl: 60,
    deps: { rpcProvider, signer },
  });

  // @ts-ignore global
  const res = await fetch(relayerUrl, {
    method: 'POST',
    body: JSON.stringify(Array.from(encodeSignedDelegate(signedDelegate))),
  });
  console.log(await res.json());
}
