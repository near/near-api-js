import type {
  AddFunctionCallAccessKeyParams,
  DeleteAccountParams,
  DeployContractParams,
  FunctionCallParams,
  ModifyAccessKeyParams,
  SignAndSendParams,
  StakeParams,
  TransferParams,
} from '../interfaces';
import { TransactionComposer } from './composer';
import { signAndSendFromComposer } from './sign_and_send';

/**
 * Helper method to compose, sign, and send a transaction from a TransactionComposer instance
 * @param composer TransactionComposer instance with (at minimum) sender, receiver, and actions set
 * @param blockReference block ID/finality
 * @param deps sign-and-send dependencies
 */
async function getComposerResult({ composer, blockReference, deps }: { composer: TransactionComposer } & SignAndSendParams) {
  const { result } = await signAndSendFromComposer({
    composer,
    blockReference,
    deps,
  });

  return result;
}

/**
 * Make a function call against a contract
 * @param sender transaction signer
 * @param receiver target account/contract
 * @param method method to be invoked
 * @param args method arguments
 * @param gas attached gas
 * @param deposit attached deposit in yN
 * @param blockReference block ID/finality
 * @param deps sign-and-send dependencies
 */
export async function functionCall({ sender, receiver, method, args, gas, deposit, blockReference, deps }: FunctionCallParams) {
  return getComposerResult({
    composer: TransactionComposer.init({ sender, receiver })
      .functionCall(method, args, gas, deposit),
    blockReference,
    deps,
  });
}

/**
 * Send Near from one account to another
 * @param sender account sending Near
 * @param receiver account receiving Near
 * @param amount Near to send in yN
 * @param blockReference block ID/finality
 * @param deps sign-and-send dependencies
 */
export async function transfer({ sender, receiver, amount, blockReference, deps }: TransferParams) {
  return getComposerResult({
    composer: TransactionComposer.init({ sender, receiver })
      .transfer(amount),
    blockReference,
    deps,
  });
}

/**
 * Stake Near with the specified validator
 * @param account account staking Near
 * @param amount Near to stake in yN
 * @param publicKey public key for the target validator
 * @param blockReference block ID/finality
 * @param deps sign-and-send dependencies
 */
export async function stake({ account, amount, publicKey, blockReference, deps }: StakeParams) {
  return getComposerResult({
    composer: TransactionComposer.init({ sender: account, receiver: account })
      .stake(amount, publicKey),
    blockReference,
    deps,
  });
}

/**
 * Add a full access key to an account
 * @param account account to which the FAK is added
 * @param publicKey public key string for the new FAK
 * @param blockReference block ID/finality
 * @param deps sign-and-send dependencies
 */
export async function addFullAccessKey({ account, publicKey, blockReference, deps }: ModifyAccessKeyParams) {
  return getComposerResult({
    composer: TransactionComposer.init({ sender: account, receiver: account })
      .addFullAccessKey(publicKey),
    blockReference,
    deps,
  });
}

/**
 * Add a function call access key to an account
 * @param account account to which the access key is added
 * @param publicKey public key string for the new access key
 * @param contract contract on which methods may be invoked
 * @param methodNames set of methods which may be invoked
 * @param allowance maximum amount of Near which can be attached to a transaction signed with this key
 * @param blockReference block ID/finality
 * @param deps sign-and-send dependencies
 */
export async function addFunctionCallAccessKey({ account, publicKey, contract, methodNames, allowance, blockReference, deps }: AddFunctionCallAccessKeyParams) {
  return getComposerResult({
    composer: TransactionComposer.init({ sender: account, receiver: account })
      .addFunctionCallAccessKey(publicKey, contract, methodNames, allowance),
    blockReference,
    deps,
  });
}

/**
 * Remove the specified access key from an account
 * @param account account from which the access key will be removed
 * @param publicKey public key string of the access key to be removed
 * @param blockReference block ID/finality
 * @param deps sign-and-send dependencies
 */
export async function deleteAccessKey({ account, publicKey, blockReference, deps }: ModifyAccessKeyParams) {
  return getComposerResult({
    composer: TransactionComposer.init({ sender: account, receiver: account })
      .deleteKey(publicKey),
    blockReference,
    deps,
  });
}

/**
 * Delete an account; account funds will be transferred to the designated beneficiary
 * @param account account from which the access key will be removed
 * @param publicKey public key string of the access key to be removed
 * @param blockReference block ID/finality
 * @param deps sign-and-send dependencies
 */
export async function deleteAccount({ account, beneficiaryId, blockReference, deps }: DeleteAccountParams) {
  return getComposerResult({
    composer: TransactionComposer.init({ sender: account, receiver: account })
      .deleteAccount(beneficiaryId),
    blockReference,
    deps,
  });
}

/**
 * Deploy contract code to an account
 * @param account account to which the contract code will be deployed
 * @param code WASM code as byte array
 * @param blockReference block ID/finality
 * @param deps sign-and-send dependencies
 */
export async function deployContract({ account, code, blockReference, deps }: DeployContractParams) {
  return getComposerResult({
    composer: TransactionComposer.init({ sender: account, receiver: account })
      .deployContract(code),
    blockReference,
    deps,
  });
}
