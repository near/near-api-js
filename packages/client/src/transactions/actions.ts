import type {
  AddFunctionCallAccessKeyParams,
  DeleteAccountParams,
  DeployContractParams,
  DeployGlobalContractClientParams,
  UseGlobalContractClientParams,
  FunctionCallParams,
  ModifyAccessKeyParams,
  StakeParams,
  TransferParams,
} from '../interfaces';
import { SignedTransactionComposer } from './composers';

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
export function functionCall({ sender, receiver, method, args, gas, deposit, blockReference, deps }: FunctionCallParams) {
  return SignedTransactionComposer.init({ sender, receiver, deps })
    .functionCall(method, args, gas, deposit)
    .signAndSend(blockReference);
}

/**
 * Send Near from one account to another
 * @param sender account sending Near
 * @param receiver account receiving Near
 * @param amount Near to send in yN
 * @param blockReference block ID/finality
 * @param deps sign-and-send dependencies
 */
export function transfer({ sender, receiver, amount, blockReference, deps }: TransferParams) {
  return SignedTransactionComposer.init({ sender, receiver, deps })
    .transfer(amount)
    .signAndSend(blockReference);
}

/**
 * Stake Near with the specified validator
 * @param account account staking Near
 * @param amount Near to stake in yN
 * @param publicKey public key for the target validator
 * @param blockReference block ID/finality
 * @param deps sign-and-send dependencies
 */
export function stake({ account, amount, publicKey, blockReference, deps }: StakeParams) {
  return SignedTransactionComposer.init({ sender: account, receiver: account, deps })
    .stake(amount, publicKey)
    .signAndSend(blockReference);
}

/**
 * Add a full access key to an account
 * @param account account to which the FAK is added
 * @param publicKey public key string for the new FAK
 * @param blockReference block ID/finality
 * @param deps sign-and-send dependencies
 */
export function addFullAccessKey({ account, publicKey, blockReference, deps }: ModifyAccessKeyParams) {
  return SignedTransactionComposer.init({ sender: account, receiver: account, deps })
    .addFullAccessKey(publicKey)
    .signAndSend(blockReference);
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
export function addFunctionCallAccessKey({ account, publicKey, contract, methodNames, allowance, blockReference, deps }: AddFunctionCallAccessKeyParams) {
  return SignedTransactionComposer.init({ sender: account, receiver: account, deps })
    .addFunctionCallAccessKey(publicKey, contract, methodNames, allowance)
    .signAndSend(blockReference);
}

/**
 * Remove the specified access key from an account
 * @param account account from which the access key will be removed
 * @param publicKey public key string of the access key to be removed
 * @param blockReference block ID/finality
 * @param deps sign-and-send dependencies
 */
export function deleteAccessKey({ account, publicKey, blockReference, deps }: ModifyAccessKeyParams) {
  return SignedTransactionComposer.init({ sender: account, receiver: account, deps })
    .deleteKey(publicKey)
    .signAndSend(blockReference);
}

/**
 * Delete an account; account funds will be transferred to the designated beneficiary
 * @param account account from which the access key will be removed
 * @param publicKey public key string of the access key to be removed
 * @param blockReference block ID/finality
 * @param deps sign-and-send dependencies
 */
export function deleteAccount({ account, beneficiaryId, blockReference, deps }: DeleteAccountParams) {
  return SignedTransactionComposer.init({ sender: account, receiver: account, deps })
    .deleteAccount(beneficiaryId)
    .signAndSend(blockReference);
}

/**
 * Deploy contract code to an account
 * @param account account to which the contract code will be deployed
 * @param code WASM code as byte array
 * @param blockReference block ID/finality
 * @param deps sign-and-send dependencies
 */
export function deployContract({ account, code, blockReference, deps }: DeployContractParams) {
  return SignedTransactionComposer.init({ sender: account, receiver: account, deps })
    .deployContract(code)
    .signAndSend(blockReference);
}


/**
 * Deploy a global contract.
 * The transaction is typically sent by the account that will pay for the global storage.
 * The receiver of the transaction is the account itself.
 * @param account Account initiating the global deployment and paying for storage.
 * @param code WASM code as a byte array.
 * @param deployMode Deployment mode: `new GlobalContractDeployMode({ CodeHash: null })` or `new GlobalContractDeployMode({ AccountId: null })`.
 * @param blockReference Optional block ID/finality for the transaction.
 * @param deps Sign-and-send dependencies (RPC provider and signer for the `account`).
 */
export function deployGlobalContractClient({ account, code, deployMode, blockReference, deps }: DeployGlobalContractClientParams) {
  return SignedTransactionComposer.init({ sender: account, receiver: account, deps })
    .deployGlobalContract(code, deployMode)
    .signAndSend(blockReference);
}

/**
 * Instruct an account to use a previously deployed global contract.
 * The transaction is sent by and received by the account that will start using the global contract.
 * @param account Account that will start using the global contract.
 * @param identifier Identifier of the global contract:
 *                   `new GlobalContractIdentifier({ CodeHash: yourCryptoHashUint8Array })` or
 *                   `new GlobalContractIdentifier({ AccountId: 'contract_owner.near' })`.
 * @param blockReference Optional block ID/finality for the transaction.
 * @param deps Sign-and-send dependencies (RPC provider and signer for the `account`).
 */
export function useGlobalContractClient({ account, identifier, blockReference, deps }: UseGlobalContractClientParams) {
  return SignedTransactionComposer.init({ sender: account, receiver: account, deps })
    .useGlobalContract(identifier)
    .signAndSend(blockReference);
}