import type { AddFullAccessKeyParams, FunctionCallParams, TransferParams } from '../interfaces';
import { TransactionComposer } from './composer';
import { signAndSendFromComposer } from './sign_and_send';
import { AddFunctionCallAccessKeyParams, SignAndSendNonceParams } from '../interfaces';

async function getComposerResult({ composer, nonce, blockReference, deps }: { composer: TransactionComposer } & SignAndSendNonceParams) {
  const { result } = await signAndSendFromComposer({
    composer,
    nonce,
    blockReference,
    deps,
  });

  return result;
}

export async function functionCall({ sender, receiver, method, args, gas, deposit, nonce, blockReference, deps }: FunctionCallParams) {
  return getComposerResult({
    composer: TransactionComposer.init({ sender, receiver })
      .functionCall(method, args, gas, deposit),
    nonce,
    blockReference,
    deps,
  });
}

export async function transfer({ sender, receiver, amount, nonce, blockReference, deps }: TransferParams) {
  return getComposerResult({
    composer: TransactionComposer.init({ sender, receiver })
      .transfer(amount),
    nonce,
    blockReference,
    deps,
  });
}

export async function addFullAccessKey({ account, publicKey, nonce, blockReference, deps }: AddFullAccessKeyParams) {
  return getComposerResult({
    composer: TransactionComposer.init({ sender: account, receiver: account })
      .addFullAccessKey(publicKey),
    nonce,
    blockReference,
    deps,
  });
}

export async function addFunctionCallAccessKey({ account, publicKey, contract, methodNames, allowance, nonce, blockReference, deps }: AddFunctionCallAccessKeyParams) {
  return getComposerResult({
    composer: TransactionComposer.init({ sender: account, receiver: account })
      .addFunctionCallAccessKey(publicKey, contract, methodNames, allowance),
    nonce,
    blockReference,
    deps,
  });
}
