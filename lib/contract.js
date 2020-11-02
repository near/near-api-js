"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const providers_1 = require("./providers");
const errors_1 = require("./utils/errors");
// Makes `function.name` return given name
function nameFunction(name, body) {
    return {
        [name](...args) {
            return body(...args);
        }
    }[name];
}
const isUint8Array = (x) => x && x.byteLength !== undefined && x.byteLength === x.length;
const isObject = (x) => Object.prototype.toString.call(x) === '[object Object]';
/**
 * Defines a smart contract on NEAR including the mutable and non-mutable methods
 */
class Contract {
    constructor(account, contractId, options) {
        this.account = account;
        this.contractId = contractId;
        const { viewMethods = [], changeMethods = [] } = options;
        viewMethods.forEach((methodName) => {
            Object.defineProperty(this, methodName, {
                writable: false,
                enumerable: true,
                value: nameFunction(methodName, async (args = {}, options = {}, ...ignored) => {
                    if (ignored.length || !(isObject(args) || isUint8Array(args)) || !isObject(options)) {
                        throw new errors_1.PositionalArgsError();
                    }
                    return this.account.viewFunction(this.contractId, methodName, args, options);
                })
            });
        });
        changeMethods.forEach((methodName) => {
            Object.defineProperty(this, methodName, {
                writable: false,
                enumerable: true,
                value: nameFunction(methodName, async (args = {}, gas, amount, ...ignored) => {
                    if (ignored.length || !(isObject(args) || isUint8Array(args))) {
                        throw new errors_1.PositionalArgsError();
                    }
                    validateBNLike({ gas, amount });
                    const rawResult = await this.account.functionCall(this.contractId, methodName, args, gas, amount);
                    return providers_1.getTransactionLastResult(rawResult);
                })
            });
        });
    }
}
exports.Contract = Contract;
/**
 * Validation on arguments being a big number from bn.js
 * Throws if an argument is not in BN format or otherwise invalid
 * @param argMap
 */
function validateBNLike(argMap) {
    const bnLike = 'number, decimal string or BN';
    for (const argName of Object.keys(argMap)) {
        const argValue = argMap[argName];
        if (argValue && !bn_js_1.default.isBN(argValue) && isNaN(argValue)) {
            throw new errors_1.ArgumentTypeError(argName, bnLike, argValue);
        }
    }
}
