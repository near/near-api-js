import type { CallParams, SendParams, SignAndSendComposerParams } from '../interfaces';
import { getBlock } from '../provider';
import { getNonce } from '../view';
import { TransactionComposer } from './composer';
import { signAndSendTransaction } from './sign_and_send';

async function getSignerNonce({ account, blockReference, deps: { rpcProvider, signer } }) {
  return getNonce({
    account,
    publicKey: (await signer.getPublicKey()).toString(),
    blockReference,
    deps: { rpcProvider },
  });
}

export async function signAndSendComposer({ composer, nonce, blockReference, deps }: SignAndSendComposerParams) {
  const { rpcProvider, signer } = deps;
  const block = await getBlock({ blockReference, deps: { rpcProvider } });

  let signerNonce = nonce;
  if (!signerNonce) {
    signerNonce = await getSignerNonce({ account: composer.sender, blockReference, deps });
    signerNonce += 1n;
  }

  const transaction = composer.toTransaction({
    nonce: signerNonce,
    publicKey: await signer.getPublicKey(),
    blockHeader: block?.header,
  });

  return signAndSendTransaction({ transaction, deps });
}

export async function call({ sender, receiver, method, args, gas, deposit, nonce, blockReference, deps }: CallParams) {
  const composer = TransactionComposer.init({ sender, receiver })
    .functionCall(method, args, gas, deposit);

  const { result } = await signAndSendComposer({
    composer,
    nonce,
    blockReference,
    deps,
  });

  return result;
}

export async function send({ sender, receiver, amount, nonce, blockReference, deps }: SendParams) {
  const composer = TransactionComposer.init({ sender, receiver })
    .transfer(amount);

  const { result } = await signAndSendComposer({
    composer,
    nonce,
    blockReference,
    deps,
  });

  return result;
}
