import BN from 'bn.js';
import depd from 'depd';
import { Account } from './account';
import { getTransactionLastResult } from './providers';
import { PositionalArgsError, ArgumentTypeError } from './utils/errors';
import { ChangeMethodOptions, ConnectedWalletAccount } from './wallet-account';

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
/**
 * Defines a smart contract on NEAR including the mutable and non-mutable methods
 */
export class Contract {
    readonly account: Account | ConnectedWalletAccount;
    readonly contractId: string;

    constructor(account: Account, contractId: string, options: { viewMethods: string[]; changeMethods: string[] }) {
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
                value: nameFunction(
                    methodName,
                    async (
                        args: object = {},
                        optionsOrGas?: ChangeMethodOptions | BN,
                        deposit?: BN,
                        ...ignored
                    ) => {
                        let options = optionsOrGas as ChangeMethodOptions | undefined;
                        if (!options && !deposit) {
                            options = {} as ChangeMethodOptions;
                        } else if (!options || !(options.gas || options.deposit || options.meta)) {
                            // passed positional gas or deposit
                            const deprecate = depd('positional gas & deposit amount');
                            deprecate('pass { gas: inUnits, deposit: inYoctoNEAR } instead');
                            options = {
                                gas: optionsOrGas as BN,
                                deposit
                            } as ChangeMethodOptions;
                        }

                        if (ignored.length || !(isObject(args) || isUint8Array(args))) {
                            throw new PositionalArgsError();
                        }
                        validateBNLike({ gas: options.gas, deposit: options.deposit });

                        const rawResult = await this.account.functionCall(
                            this.contractId,
                            methodName,
                            args,
                            options
                        );
                        return getTransactionLastResult(rawResult);
                    }
                )
            });
        });
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
