import { Signature, SignedTransaction } from '@near-js/transactions';
import { getTransactionLastResult } from '@near-js/utils';
import { sha256 } from '@noble/hashes/sha256';

import type { SignTransactionParams, SignAndSendTransactionParams } from '../interfaces';
import { getBlock } from '../providers';
import { getNonce } from '../view';
import { SignAndSendComposerParams } from '../interfaces';
import { BlockReference } from '@near-js/types';

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
export async function signAndSendTransaction({ transaction, deps: { rpcProvider, signer } }: SignAndSendTransactionParams) {
  const { signedTransaction } = await signTransaction({ transaction, deps: { signer } });
  const outcome = await rpcProvider.sendTransaction(signedTransaction);
  return {
    outcome,
    result: getTransactionLastResult(outcome),
  };
}

/**
 * Get the current nonce for an access key given an account and MessageSigner instance
 * @param account owner of the access key
 * @param blockReference block ID/finality
 * @param rpcProvider
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

/**
 * Sign and send a transaction given a TransactionComposer instance.
 *  Derive values for other transaction fields (public key, nonce, block header) from MessageSigner dependency.
 *  NB - this might be more natural as a method on TransactionComposer but would be a major increase in scope.
 * @param composer Transaction Composer instance with values for sender, receiver, and actions
 * @param blockReference block ID/finality
 * @param deps sign-and-send dependencies
 */
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
