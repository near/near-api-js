import { Signature, SignedTransaction } from '@near-js/transactions';
import { getTransactionLastResult } from '@near-js/utils';
import { sha256 } from '@noble/hashes/sha256';

import type { SignTransactionParams, SignAndSendTransactionParams } from '../interfaces';
import { getNonce } from '../view';
import { BlockReference } from '@near-js/types';
import { SerializedReturnValue } from '@near-js/types/lib/esm/provider/response';

const DEFAULT_FINALITY: BlockReference = { finality: 'final' };

/**
 * Sign a transaction, returning the signed transaction and encoded hash
 * @param transaction Transaction instance
 * @param signer MessageSigner
 */
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

/**
 * Sign a transaction and publish to RPC
 * @param transaction Transaction instance to sign and publish
 * @param deps sign-and-send dependencies
 */
export async function signAndSendTransaction<T extends SerializedReturnValue>({ transaction, deps: { rpcProvider, signer } }: SignAndSendTransactionParams) {
  const { signedTransaction } = await signTransaction({ transaction, deps: { signer } });
  const outcome = await rpcProvider.sendTransaction(signedTransaction);
  return {
    outcome,
    result: getTransactionLastResult(outcome) as T,
  };
}

/**
 * Get the current nonce for an access key given an account and MessageSigner instance
 * @param account owner of the access key
 * @param blockReference block ID/finality
 * @param rpcProvider RPC provider instance
 * @param deps sign-and-send dependencies
 */
export async function getSignerNonce({ account, blockReference = DEFAULT_FINALITY, deps: { rpcProvider, signer } }) {
  return getNonce({
    account,
    publicKey: (await signer.getPublicKey()).toString(),
    blockReference,
    deps: { rpcProvider },
  });
}
