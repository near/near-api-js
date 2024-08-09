import { Signature, SignedTransaction } from '@near-js/transactions';
import { getTransactionLastResult } from '@near-js/utils';
import { sha256 } from '@noble/hashes/sha256';

import type { SignTransactionParams, SignAndSendTransactionParams } from '../interfaces';

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
