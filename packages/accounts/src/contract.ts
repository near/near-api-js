import { ArgumentTypeError, PositionalArgsError } from '@near-js/types';
import { getTransactionLastResult, Logger } from '@near-js/utils';
import depd from 'depd';
import validator from 'is-my-json-valid';
import {
    type AbiFunction,
    AbiFunctionKind,
    type AbiRoot,
    AbiSerializationType,
} from 'near-abi';
import { Account } from './account';
import type { Connection } from './connection';
import {
    ArgumentSchemaError,
    ConflictingOptions,
    UnknownArgumentError,
    UnsupportedSerializationError,
} from './errors';
import type { IntoConnection } from './interface';
import { LocalViewExecution } from './local-view-execution';
import { viewFunction } from './utils';

// Makes `function.name` return given name
function nameFunction(name: string, body: (args?: any[]) => any) {
    return {
        [name](...args: any[]) {
            return body(...args);
        },
    }[name];
}

function validateArguments(
    args: object,
    abiFunction: AbiFunction,
    abiRoot: AbiRoot,
) {
    if (!isObject(args)) return;

    if (
        abiFunction.params &&
        abiFunction.params.serialization_type !== AbiSerializationType.Json
    ) {
        throw new UnsupportedSerializationError(
            abiFunction.name,
            abiFunction.params.serialization_type,
        );
    }

    if (
        abiFunction.result &&
        abiFunction.result.serialization_type !== AbiSerializationType.Json
    ) {
        throw new UnsupportedSerializationError(
            abiFunction.name,
            abiFunction.result.serialization_type,
        );
    }

    const params = abiFunction.params?.args || [];
    for (const p of params) {
        const arg = args[p.name];
        const typeSchema = p.type_schema;
        typeSchema.definitions = abiRoot.body.root_schema.definitions;
        const validate = validator(typeSchema);
        const valid = validate(arg);
        if (!valid) {
            throw new ArgumentSchemaError(p.name, validate.errors);
        }
    }
    // Check there are no extra unknown arguments passed
    for (const argName of Object.keys(args)) {
        const param = params.find((p) => p.name === argName);
        if (!param) {
            throw new UnknownArgumentError(
                argName,
                params.map((p) => p.name),
            );
        }
    }
}

const isUint8Array = (x: any) =>
    x && x.byteLength !== undefined && x.byteLength === x.length;

const isObject = (x: any) =>
    Object.prototype.toString.call(x) === '[object Object]';

interface ChangeMethodOptions {
    signerAccount?: Account;
    args: object;
    methodName: string;
    gas?: bigint;
    amount?: bigint;
    meta?: string;
    callbackUrl?: string;
}

export interface ContractMethods {
    /**
     * Methods that change state. These methods cost gas and require a signed transaction.
     *
     * @see {@link Account#functionCall}
     */
    changeMethods: string[];

    /**
     * View methods do not require a signed transaction.
     *
     * @see {@link Account#viewFunction}
     */
    viewMethods: string[];

    /**
     * ABI defining this contract's interface.
     */
    abi?: AbiRoot;

    /**
     * Executes view methods locally. This flag is useful when multiple view calls will be made for the same blockId
     */
    useLocalViewExecution: boolean;
}

/**
 * @deprecated It will be removed in the next major release, please switch to {@link import('./typed_contract').TypedContract} with type-safe ABI support
 *
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
    /** @deprecated */
    readonly account?: Account;
    readonly connection: Connection;
    readonly contractId: string;
    readonly lve: LocalViewExecution;

    /**
     * @param account NEAR account to sign change method transactions
     * @param contractId NEAR account id where the contract is deployed
     * @param options NEAR smart contract methods that your application will use. These will be available as `contract.methodName`
     */
    constructor(
        connection: IntoConnection,
        contractId: string,
        options: ContractMethods,
    ) {
        const deprecate = depd('new Contract()');
        deprecate(
            'It will be removed in the next major release, please switch to "TypedContract" with type-safe ABI support',
        );

        this.connection = connection.getConnection();
        if (connection instanceof Account) {
            const deprecate = depd(
                'new Contract(account, contractId, options)',
            );
            deprecate(
                'use `new Contract(connection, contractId, options)` instead',
            );
            this.account = connection;
        }
        this.contractId = contractId;
        this.lve = new LocalViewExecution(connection);
        const {
            viewMethods = [],
            changeMethods = [],
            abi: abiRoot,
            useLocalViewExecution,
        } = options;

        let viewMethodsWithAbi = viewMethods.map((name) => ({
            name,
            abi: null as AbiFunction,
        }));
        let changeMethodsWithAbi = changeMethods.map((name) => ({
            name,
            abi: null as AbiFunction,
        }));
        if (abiRoot) {
            if (
                viewMethodsWithAbi.length > 0 ||
                changeMethodsWithAbi.length > 0
            ) {
                throw new ConflictingOptions();
            }
            viewMethodsWithAbi = abiRoot.body.functions
                .filter((m) => m.kind === AbiFunctionKind.View)
                .map((m) => ({ name: m.name, abi: m }));
            changeMethodsWithAbi = abiRoot.body.functions
                .filter((methodAbi) => methodAbi.kind === AbiFunctionKind.Call)
                .map((methodAbi) => ({ name: methodAbi.name, abi: methodAbi }));
        }

        viewMethodsWithAbi.forEach(({ name, abi }) => {
            Object.defineProperty(this, name, {
                writable: false,
                enumerable: true,
                value: nameFunction(
                    name,
                    async (args: object = {}, options = {}, ...ignored) => {
                        if (
                            ignored.length ||
                            !(isObject(args) || isUint8Array(args)) ||
                            !isObject(options)
                        ) {
                            throw new PositionalArgsError();
                        }

                        if (abi) {
                            validateArguments(args, abi, abiRoot);
                        }

                        if (useLocalViewExecution) {
                            try {
                                return await this.lve.viewFunction({
                                    contractId: this.contractId,
                                    methodName: name,
                                    args,
                                    ...options,
                                });
                            } catch (error) {
                                Logger.warn(
                                    `Local view execution failed with: "${error.message}"`,
                                );
                                Logger.warn('Fallback to normal RPC call');
                            }
                        }

                        if (this.account) {
                            return this.account.viewFunction({
                                contractId: this.contractId,
                                methodName: name,
                                args,
                                ...options,
                            });
                        }

                        return viewFunction(this.connection, {
                            contractId: this.contractId,
                            methodName: name,
                            args,
                            ...options,
                        });
                    },
                ),
            });
        });
        changeMethodsWithAbi.forEach(({ name, abi }) => {
            Object.defineProperty(this, name, {
                writable: false,
                enumerable: true,
                value: nameFunction(name, async (...args: any[]) => {
                    if (
                        args.length &&
                        (args.length > 3 ||
                            !(isObject(args[0]) || isUint8Array(args[0])))
                    ) {
                        throw new PositionalArgsError();
                    }

                    if (args.length > 1 || !(args[0] && args[0].args)) {
                        const deprecate = depd(
                            'contract.methodName(args, gas, amount)',
                        );
                        deprecate(
                            'use `contract.methodName({ signerAccount, args, gas?, amount?, callbackUrl?, meta? })` instead',
                        );
                        args[0] = {
                            args: args[0],
                            gas: args[1],
                            amount: args[2],
                        };
                    }

                    if (abi) {
                        validateArguments(args[0].args, abi, abiRoot);
                    }

                    return this._changeMethod({ methodName: name, ...args[0] });
                }),
            });
        });
    }

    private async _changeMethod({
        signerAccount,
        args,
        methodName,
        gas,
        amount,
        meta,
        callbackUrl,
    }: ChangeMethodOptions) {
        validateBNLike({ gas, amount });

        const account = this.account || signerAccount;

        if (!account) throw new Error('signerAccount must be specified');

        const rawResult = await account.functionCall({
            contractId: this.contractId,
            methodName,
            args,
            gas,
            attachedDeposit: amount,
            walletMeta: meta,
            walletCallbackUrl: callbackUrl,
        });

        return getTransactionLastResult(rawResult);
    }
}

/**
 * Throws if an argument is not in BigInt format or otherwise invalid
 * @param argMap
 */
function validateBNLike(argMap: { [name: string]: any }) {
    const bnLike = 'number, decimal string or BigInt';
    for (const argName of Object.keys(argMap)) {
        const argValue = argMap[argName];
        if (argValue && typeof argValue !== 'bigint' && isNaN(argValue)) {
            throw new ArgumentTypeError(argName, bnLike, argValue);
        }
    }
}
