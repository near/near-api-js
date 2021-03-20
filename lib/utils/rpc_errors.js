"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorTypeFromErrorMessage = exports.formatError = exports.parseResultError = exports.parseRpcError = void 0;
const mustache_1 = __importDefault(require("mustache"));
const rpc_error_schema_json_1 = __importDefault(require("../generated/rpc_error_schema.json"));
const error_messages_json_1 = __importDefault(require("../res/error_messages.json"));
const errors_1 = require("./errors");
function parseRpcError(errorObj) {
    const result = {};
    const errorClassName = walkSubtype(errorObj, rpc_error_schema_json_1.default.schema, result, '');
    const error = new errors_1.TypedError(formatError(errorClassName, result), errorClassName, new errors_1.ErrorContext(undefined, errorObj));
    Object.assign(error, result);
    return error;
}
exports.parseRpcError = parseRpcError;
//TODO: parseRpcError and parseResultError should be one function
function parseResultError(result) {
    const server_error = parseRpcError(result.status.Failure);
    server_error.context.transactionOutcome = result.transaction_outcome;
    return server_error;
}
exports.parseResultError = parseResultError;
function formatError(errorClassName, errorData) {
    if (typeof error_messages_json_1.default[errorClassName] === 'string') {
        return mustache_1.default.render(error_messages_json_1.default[errorClassName], errorData);
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
