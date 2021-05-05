import BN from 'bn.js';
import depd from 'depd';
import { Account } from './account';
import { getTransactionLastResult } from './providers';
import { PositionalArgsError, ArgumentTypeError } from './utils/errors';

// Makes `function.name` return given name
function nameFunction(name: string, body: (args?: any[]) => {}) {
    return {
        [name](...args: any[]) {
            return body(...args);
        }
    }[name];
}

const isUint8Array = (x: any) =>
    x && x.byteLength !== undefined && x.byteLength === x.length;

const isObject = (x: any) =>
    Object.prototype.toString.call(x) === '[object Object]';

interface ChangeMethodOptions {
    args: object;
    methodName: string;
    gas?: BN;
    amount?: BN;
    meta?: string;
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
 *   await contract.addMessage({
 *      meta: 'some info',
 *      callbackUrl: 'https://example.com/callback',
 *      args: { text: 'my message' },
 *      amount: 1
 *   })
 * }
 * ```
 */
export class Contract {
    readonly account: Account;
    readonly contractId: string;

    /**
     * @param account NEAR account to sign change method transactions
     * @param contractId NEAR account id where the contract is deployed
     * @param options NEAR smart contract methods that your application will use. These will be available as `contract.methodName`
     */
    constructor(account: Account, contractId: string, options: ContractMethods) {
        this.account = account;
        this.contractId = contractId;
        const { viewMethods = [], changeMethods = [] } = options;
        viewMethods.forEach((methodName) => {
            Object.defineProperty(this, methodName, {
                writable: false,
                enumerable: true,
                value: nameFunction(methodName, async (args: object = {}, options = {}, ...ignored) => {
                    if (ignored.length || !(isObject(args) || isUint8Array(args)) || !isObject(options)) {
                        throw new PositionalArgsError();
                    }
                    return this.account.viewFunction(this.contractId, methodName, args, options);
                })
            });
        });
        changeMethods.forEach((methodName) => {
            Object.defineProperty(this, methodName, {
                writable: false,
                enumerable: true,
                value: nameFunction(methodName, async (...args: any[]) => {
                    if (args.length && (args.length > 3 || !(isObject(args[0]) || isUint8Array(args[0])))) {
                        throw new PositionalArgsError();
                    }

                    if(args.length > 1 || !(args[0] && args[0].args)) {
                        const deprecate = depd('contract.methodName(args, gas, amount)');
                        deprecate('use `contract.methodName({ args, gas?, amount?, callbackUrl?, meta? })` instead');
                        return this._changeMethod({
                            methodName,
                            args: args[0],
                            gas: args[1],
                            amount: args[2]
                        });
                    }

                    return this._changeMethod({ methodName, ...args[0] });
                })
            });
        });
    }

    private async _changeMethod({ args, methodName, gas, amount, meta, callbackUrl }: ChangeMethodOptions) {
        validateBNLike({ gas, amount });

        const rawResult = await this.account.functionCall({
            contractId: this.contractId,
            methodName,
            args,
            gas,
            attachedDeposit: amount,
            walletMeta: meta,
            walletCallbackUrl: callbackUrl
        });

        return getTransactionLastResult(rawResult);
    }
}

/**
 * Validation on arguments being a big number from bn.js
 * Throws if an argument is not in BN format or otherwise invalid
 * @param argMap
 */
function validateBNLike(argMap: { [name: string]: any }) {
    const bnLike = 'number, decimal string or BN';
    for (const argName of Object.keys(argMap)) {
        const argValue = argMap[argName];
        if (argValue && !BN.isBN(argValue) && isNaN(argValue)) {
            throw new ArgumentTypeError(argName, bnLike, argValue);
        }
    }
}
