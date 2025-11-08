import type {
    CreateAccountParams,
    CreateTopLevelAccountParams,
} from '../interfaces/index.js';
import { SignedTransactionComposer } from './composers/index.js';
import { functionCall } from './actions.js';

/**
 * Create a new top-level account using an existing account
 *  (e.g. create `new.near` by signing with `creator.near`)
 * @param account name of the account creating and funding the account
 * @param contract root contract for the target network (e.g. `near`)
 * @param newAccount name of the created account
 * @param newPublicKey public key for the created account's initial full access key
 * @param initialBalance initial account balance in yN
 * @param blockReference block ID/finality
 * @param deps sign-and-send dependencies
 */
export async function createTopLevelAccount({ account, contract, newAccount, newPublicKey, initialBalance, blockReference, deps }: CreateTopLevelAccountParams) {
    return functionCall({
        sender: account,
        receiver: contract,
        method: 'create_account',
        args: {
            new_account_id: newAccount,
            new_public_key: newPublicKey,
        },
        deposit: initialBalance,
        blockReference,
        deps,
    });
}

/**
 * Create a new sub-account under an existing account
 *  (e.g. create `sub.new.near` by signing with `new.near`)
 * @param account name of the existing account under which the new account is created
 * @param contract root contract for the target network (e.g. `testnet`)
 * @param newAccount name of the created account
 * @param newPublicKey public key for the created account's initial full access key
 * @param initialBalance initial account balance in yN
 * @param blockReference block ID/finality
 * @param deps sign-and-send dependencies
 */
export async function createSubAccount({ account, newAccount, newPublicKey, initialBalance, blockReference, deps }: CreateAccountParams) {
    return SignedTransactionComposer.init({ sender: account, receiver: newAccount, deps })
        .createAccount()
        .transfer(initialBalance)
        .addFullAccessKey(newPublicKey)
        .signAndSend(blockReference);
}

