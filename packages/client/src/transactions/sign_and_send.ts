import { getTransactionLastResult } from '@near-js/utils';

import type { SignTransactionParams, SignAndSendTransactionParams } from '../interfaces';
import { getNonce } from '../view';
import { BlockReference } from '@near-js/types';
import { SerializedReturnValue } from '@near-js/types/lib/esm/provider/response';

const DEFAULT_FINALITY: BlockReference = { finality: 'optimistic' };

/**
 * Sign a transaction, returning the signed transaction and encoded hash
 * @param transaction Transaction instance
 * @param signer MessageSigner
 */
export async function signTransaction({ transaction, deps: { signer } }: SignTransactionParams) {
  const [txHash, signedTransaction] = await signer.signTransaction(transaction);

  return {
    encodedTransactionHash: txHash,
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
