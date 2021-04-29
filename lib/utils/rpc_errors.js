"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorTypeFromErrorMessage = exports.formatError = exports.parseReceiptExecutionFailure = exports.parseRpcError = exports.ReceiptExecutionFailure = exports.RpcError = void 0;
const mustache_1 = __importDefault(require("mustache"));
const rpc_error_schema_json_1 = __importDefault(require("../generated/rpc_error_schema.json"));
const error_messages_json_1 = __importDefault(require("../res/error_messages.json"));
const errors_1 = require("./errors");
const common_index_1 = require("../common-index");
const mustacheHelpers = {
    formatNear: () => (n, render) => common_index_1.utils.format.formatNearAmount(render(n))
};
class RpcError extends errors_1.TypedError {
    constructor(message, type, transactionHash, errorPath) {
        super(message, type);
        this.transactionHash = transactionHash;
        this.errorPath = errorPath;
    }
}
exports.RpcError = RpcError;
class ReceiptExecutionFailure extends errors_1.TypedError {
    constructor(message, type, errorPath) {
        super(message, type);
        this.errorPath = errorPath;
    }
}
exports.ReceiptExecutionFailure = ReceiptExecutionFailure;
function parseRpcError(errorObj) {
    const additionalData = {};
    const errorType = walkSubtype(errorObj, rpc_error_schema_json_1.default.schema, additionalData, '');
    const rpcError = new RpcError(formatError(errorType, additionalData), errorType, undefined, //TODO: should it be here? (transaction hash)
    errorObj);
    Object.assign(rpcError, additionalData);
    return rpcError;
}
exports.parseRpcError = parseRpcError;
function parseReceiptExecutionFailure(result) {
    const additionalData = {};
    const errorType = walkSubtype(result.status.Failure, rpc_error_schema_json_1.default.schema, additionalData, '');
    const receiptExecutionFailure = new ReceiptExecutionFailure(formatError(errorType, additionalData), errorType, result.status.Failure);
    Object.assign(receiptExecutionFailure, additionalData);
    receiptExecutionFailure.transaction_outcome = result.transaction_outcome;
    return receiptExecutionFailure;
}
exports.parseReceiptExecutionFailure = parseReceiptExecutionFailure;
function formatError(errorType, errorData) {
    if (typeof error_messages_json_1.default[errorType] === 'string') {
        return mustache_1.default.render(error_messages_json_1.default[errorType], {
            ...errorData,
            ...mustacheHelpers
        });
    }
    return JSON.stringify(errorData);
}
exports.formatError = formatError;
/**
 * Walks through defined schema returning error(s) recursively
 * @param errorObj The error to be parsed
 * @param schema A defined schema in JSON mapping to the RPC errors
 * @param result An object used in recursion or called directly
 * @param typeName The human-readable error type name as defined in the JSON mapping
 */
function walkSubtype(errorObj, schema, result, typeName) {
    let error;
    let type;
    let errorTypeName;
    for (const errorName in schema) {
        if (isString(errorObj[errorName])) {
            // Return early if error type is in a schema
            return errorObj[errorName];
        }
        if (isObject(errorObj[errorName])) {
            error = errorObj[errorName];
            type = schema[errorName];
            errorTypeName = errorName;
        }
        else if (isObject(errorObj.kind) && isObject(errorObj.kind[errorName])) {
            error = errorObj.kind[errorName];
            type = schema[errorName];
            errorTypeName = errorName;
        }
        else {
            continue;
        }
    }
    if (error && type) {
        for (const prop of Object.keys(type.props)) {
            result[prop] = error[prop];
        }
        return walkSubtype(error, schema, result, errorTypeName);
    }
    else {
        // TODO: is this the right thing to do?
        result.kind = errorObj;
        return typeName;
    }
}
function getErrorTypeFromErrorMessage(errorMessage) {
    // This function should be removed when JSON RPC starts returning typed errors.
    switch (true) {
        case /^account .*? does not exist while viewing$/.test(errorMessage):
            return 'AccountDoesNotExist';
        case /^Account .*? doesn't exist$/.test(errorMessage):
            return 'AccountDoesNotExist';
        case /^access key .*? does not exist while viewing$/.test(errorMessage):
            return 'AccessKeyDoesNotExist';
        case /wasm execution failed with error: FunctionCallError\(CompilationError\(CodeDoesNotExist/.test(errorMessage):
            return 'CodeDoesNotExist';
        case /Transaction nonce \d+ must be larger than nonce of the used access key \d+/.test(errorMessage):
            return 'InvalidNonce';
        default:
            return 'UntypedError';
    }
}
exports.getErrorTypeFromErrorMessage = getErrorTypeFromErrorMessage;
/**
 * Helper function determining if the argument is an object
 * @param n Value to check
 */
function isObject(n) {
    return Object.prototype.toString.call(n) === '[object Object]';
}
/**
 * Helper function determining if the argument is a string
 * @param n Value to check
 */
function isString(n) {
    return Object.prototype.toString.call(n) === '[object String]';
}
