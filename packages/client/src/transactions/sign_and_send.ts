import { Signature, SignedTransaction } from '@near-js/transactions';
import { getTransactionLastResult } from '@near-js/utils';
import { sha256 } from '@noble/hashes/sha256';

import type { SignTransactionParams, SignAndSendTransactionParams } from '../interfaces';
import { getBlock } from '../providers';
import { getNonce } from '../view';
import { SignAndSendComposerParams } from '../interfaces';
import { BlockReference } from '@near-js/types';

const DEFAULT_FINALITY: BlockReference = { finality: 'final' };

export async function signTransaction({ transaction, deps: { signer } }: SignTransactionParams) {
  const encodedTx = transaction.encode();
  const signedTransaction = new SignedTransaction({
    transaction,
    signature: new Signature({
      keyType: transaction.publicKey.keyType,
      data: await signer.signMessage(encodedTx),
    }),
  });

  return {
    encodedTransactionHash: new Uint8Array(sha256(encodedTx)),
    signedTransaction,
  };
}

export async function signAndSendTransaction({ transaction, deps: { rpcProvider, signer } }: SignAndSendTransactionParams) {
  const { signedTransaction } = await signTransaction({ transaction, deps: { signer } });
  const outcome = await rpcProvider.sendTransaction(signedTransaction);
  return {
    outcome,
    result: getTransactionLastResult(outcome),
  };
}

export async function getSignerNonce({ account, blockReference = DEFAULT_FINALITY, deps: { rpcProvider, signer } }) {
  return getNonce({
    account,
    publicKey: (await signer.getPublicKey()).toString(),
    blockReference,
    deps: { rpcProvider },
  });
}

// this might be more natural as a method on TransactionComposer but would be a major increase in scope
export async function signAndSendFromComposer({ composer, blockReference = DEFAULT_FINALITY, deps }: SignAndSendComposerParams) {
  const { rpcProvider, signer } = deps;
  const block = await getBlock({ blockReference, deps: { rpcProvider } });

  const signerNonce = await getSignerNonce({ account: composer.sender, blockReference, deps });

  const transaction = composer.toTransaction({
    nonce: signerNonce + 1n,
    publicKey: await signer.getPublicKey(),
    blockHeader: block?.header,
  });

  return signAndSendTransaction({ transaction, deps });
}
