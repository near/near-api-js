import BN from 'bn.js';
import { Account } from './account';
export interface ChangeMethodOptions {
    /**
     * Arguments to pass to the function call
     */
    args: object;
    /**
     * Name of the change method to invoke
     */
    methodName: string;
    /**
     * Maximum gas that the change method can use
     */
    gas?: BN;
    /**
     * Amount of NEAR to attach to the function call
     */
    amount?: BN;
    /**
     * After the NEAR wallet redirects back to your `callbackUrl` this string will be in the Url query params.
     * http(s)://{callbackUrl}?meta={meta}
     */
    meta?: string;
    /**
     * Url the NEAR wallet will redirect to after signing the function call transaction
     */
    callbackUrl?: string;
}
export interface ContractMethods {
    /**
     * Methods that change state. These methods cost gas and require a signed transaction.
     *
     * @see {@link Account.functionCall}
     */
    changeMethods: string[];
    /**
     * View methods do not require a signed transaction.
     *
     * @@see {@link Account.viewFunction}
     */
    viewMethods: string[];
}
/**
 * Defines a smart contract on NEAR including the change (mutable) and view (non-mutable) methods
 *
 * @example {@link https://docs.near.org/docs/develop/front-end/naj-quick-reference#contract}
 * @example
 * ```js
 * import { Contract } from 'near-api-js';
 *
 * async function contractExample() {
 *   const methodOptions = {
 *     viewMethods: ['getMessageByAccountId'],
 *     changeMethods: ['addMessage']
 *   };
 *   const contract = new Contract(
 *     wallet.account(),
 *     'contract-id.testnet',
 *     methodOptions
 *   );
 *
 *   // use a contract view method
 *   const messages = await contract.getMessages({
 *     accountId: 'example-account.testnet'
 *   });
 *
 *   // use a contract change method
 *   await contract.addMessage({ text: 'My new message' })
 * }
 * ```
 */
export declare class Contract {
    readonly account: Account;
    readonly contractId: string;
    /**
     * @param account NEAR account to sign change method transactions
     * @param contractId NEAR account id where the contract is deployed
     * @param options NEAR smart contract methods that your application will use. These will be available as `contract.methodName`
     */
    constructor(account: Account, contractId: string, options: ContractMethods);
    private _changeMethod;
}
