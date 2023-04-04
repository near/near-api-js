import { getTransactionLastResult } from '@near-js/utils';
import { ArgumentTypeError, PositionalArgsError } from '@near-js/types';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import BN from 'bn.js';
import depd from 'depd';
import { AbiFunction, AbiFunctionKind, AbiRoot, AbiSerializationType } from 'near-abi';

import { Account } from './account';
import { UnsupportedSerializationError, UnknownArgumentError, ArgumentSchemaError, ConflictingOptions } from './errors';


// Makes `function.name` return given name
function nameFunction(name: string, body: (args?: any[]) => any) {
    return {
        [name](...args: any[]) {
            return body(...args);
        }
    }[name];
}

function validateArguments(args: object, abiFunction: AbiFunction, ajv: Ajv, abiRoot: AbiRoot) {
    if (!isObject(args)) return;

    if (abiFunction.params && abiFunction.params.serialization_type !== AbiSerializationType.Json) {
        throw new UnsupportedSerializationError(abiFunction.name, abiFunction.params.serialization_type);
    }

    if (abiFunction.result && abiFunction.result.serialization_type !== AbiSerializationType.Json) {
        throw new UnsupportedSerializationError(abiFunction.name, abiFunction.result.serialization_type);
    }

    const params = abiFunction.params?.args || [];
    for (const p of params) {
        const arg = args[p.name];
        const typeSchema = p.type_schema;
        typeSchema.definitions = abiRoot.body.root_schema.definitions;
        const validate = ajv.compile(typeSchema);
        if (!validate(arg)) {
            throw new ArgumentSchemaError(p.name, validate.errors);
        }
    }
    // Check there are no extra unknown arguments passed
    for (const argName of Object.keys(args)) {
        const param = params.find((p) => p.name === argName);
        if (!param) {
            throw new UnknownArgumentError(argName, params.map((p) => p.name));
        }
    }
}

function createAjv() {
    // Strict mode is disabled for now as it complains about unknown formats. We need to
    // figure out if we want to support a fixed set of formats. `uint32` and `uint64`
    // are added explicitly just to reduce the amount of warnings as these are very popular
    // types.
    const ajv = new Ajv({
        strictSchema: false,
        formats: {
            uint32: true,
            uint64: true
        }
    });
    addFormats(ajv);
    return ajv;
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
     * @see {@link account!Account.functionCall}
     */
    changeMethods: string[];

    /**
     * View methods do not require a signed transaction.
     *
     * @see {@link account!Account#viewFunction}
     */
    viewMethods: string[];

    /**
     * ABI defining this contract's interface.
     */
    abi?: AbiRoot;
}

/**
 * Defines a smart contract on NEAR including the change (mutable) and view (non-mutable) methods
 *
 * @see [https://docs.near.org/tools/near-api-js/quick-reference#contract](https://docs.near.org/tools/near-api-js/quick-reference#contract)
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
        const { viewMethods = [], changeMethods = [], abi: abiRoot } = options;

        let viewMethodsWithAbi = viewMethods.map((name) => ({ name, abi: null as AbiFunction }));
        let changeMethodsWithAbi = changeMethods.map((name) => ({ name, abi: null as AbiFunction }));
        if (abiRoot) {
            if (viewMethodsWithAbi.length > 0 || changeMethodsWithAbi.length > 0) {
                throw new ConflictingOptions();
            }
            viewMethodsWithAbi = abiRoot.body.functions
                .filter((m) => m.kind === AbiFunctionKind.View)
                .map((m) => ({ name: m.name, abi: m }));
            changeMethodsWithAbi = abiRoot.body.functions
                .filter((methodAbi) => methodAbi.kind === AbiFunctionKind.Call)
                .map((methodAbi) => ({ name: methodAbi.name, abi: methodAbi }));
        }

        const ajv = createAjv();
        viewMethodsWithAbi.forEach(({ name, abi }) => {
            Object.defineProperty(this, name, {
                writable: false,
                enumerable: true,
                value: nameFunction(name, async (args: object = {}, options = {}, ...ignored) => {
                    if (ignored.length || !(isObject(args) || isUint8Array(args)) || !isObject(options)) {
                        throw new PositionalArgsError();
                    }

                    if (abi) {
                        validateArguments(args, abi, ajv, abiRoot);
                    }

                    return this.account.viewFunction({
                        contractId: this.contractId,
                        methodName: name,
                        args,
                        ...options,
                    });
                })
            });
        });
        changeMethodsWithAbi.forEach(({ name, abi }) => {
            Object.defineProperty(this, name, {
                writable: false,
                enumerable: true,
                value: nameFunction(name, async (...args: any[]) => {
                    if (args.length && (args.length > 3 || !(isObject(args[0]) || isUint8Array(args[0])))) {
                        throw new PositionalArgsError();
                    }

                    if (args.length > 1 || !(args[0] && args[0].args)) {
                        const deprecate = depd('contract.methodName(args, gas, amount)');
                        deprecate('use `contract.methodName({ args, gas?, amount?, callbackUrl?, meta? })` instead');
                        args[0] = {
                            args: args[0],
                            gas: args[1],
                            amount: args[2]
                        };
                    }

                    if (abi) {
                        validateArguments(args[0].args, abi, ajv, abiRoot);
                    }

                    return this._changeMethod({ methodName: name, ...args[0] });
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
