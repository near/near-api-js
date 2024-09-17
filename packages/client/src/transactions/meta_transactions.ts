import { Action, buildDelegateAction, signDelegateAction, SignedDelegate } from '@near-js/transactions';

import { SignAndSendTransactionDependency } from '../interfaces';
import { getSignerNonce } from './sign_and_send';

interface SignedDelegateOptions extends SignAndSendTransactionDependency {
  account: string;
  actions: Action[];
  blockHeightTtl: number;
  receiver: string;
}

export async function buildSignedDelegate({
  account,
  actions,
  blockHeightTtl,
  receiver,
  deps: {
    rpcProvider,
    signer,
  },
}: SignedDelegateOptions): Promise<SignedDelegate> {
  const { header } = await rpcProvider.block({ finality: 'final' });
  const signerNonce = await getSignerNonce({
    account,
    deps: {
      rpcProvider,
      signer,
    },
  });

  const delegateAction = buildDelegateAction({
    actions,
    maxBlockHeight: BigInt(header.height) + BigInt(blockHeightTtl),
    nonce: signerNonce + 1n,
    publicKey: await signer.getPublicKey(),
    receiverId: receiver,
    senderId: account,
  });

  const { signedDelegateAction } = await signDelegateAction({
    delegateAction,
    signer: { sign: (m) => signer.signMessage(m) },
  });

  return signedDelegateAction;
}
