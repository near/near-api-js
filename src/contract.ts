import BN from 'bn.js';
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

export interface ChangeMethodOptions {
    args: object;
    methodName: string;
    gas?: BN;
    attachedDeposit?: BN;
    meta?: string;
    callbackUrl?: string;
}

/**
 * Defines a smart contract on NEAR including the mutable and non-mutable methods
 */
export class Contract {
    readonly account: Account;
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
                value: nameFunction(methodName, async (...args: any[]) => {
                    if (args.length > 4 || !(isObject(args[0]) || isUint8Array(args[0]))) {
                        throw new PositionalArgsError();
                    }

                    if(args.length > 1 || !args[0].args) {
                        return this.changeMethod({
                            methodName,
                            args: args[0],
                            gas: args[3],
                            attachedDeposit: args[4]
                        });
                    }

                    return this.changeMethod({ methodName, ...args[0] });
                })
            });
        });
    }

    private async changeMethod({ args, methodName, gas, attachedDeposit, meta, callbackUrl }: ChangeMethodOptions) {
        validateBNLike({ gas, attachedDeposit });

        const rawResult = await this.account.functionCall({
            contractId: this.contractId,
            methodName,
            args,
            gas,
            attachedDeposit,
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
