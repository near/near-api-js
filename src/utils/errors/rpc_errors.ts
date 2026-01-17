import { TypedError } from '../../types/index.js';
import { yoctoToNear } from '../../units/near.js';

import { ErrorMessages } from './errors.js';
import schema from './rpc_error_schema.js';

/**
 * Simple template renderer to replace Mustache dependency.
 * Supports {{variable}} and {{#formatNear}}{{value}}{{/formatNear}} syntax.
 */
function renderTemplate(template: string, data: Record<string, any>): string {
    // Handle {{#formatNear}}{{value}}{{/formatNear}} sections
    let result = template.replace(/\{\{#formatNear\}\}\{\{(\w+)\}\}\{\{\/formatNear\}\}/g, (_, key) =>
        yoctoToNear(data[key])
    );

    // Handle simple {{variable}} substitutions
    result = result.replace(/\{\{(\w+)\}\}/g, (_, key) => {
        return data[key] !== undefined ? String(data[key]) : '';
    });

    return result;
}

export class ServerError extends TypedError {}

class ServerTransactionError extends ServerError {
    public transaction_outcome: any;
}

export function parseRpcError(errorObj: Record<string, any>): ServerError {
    const result = {};
    const errorClassName = walkSubtype(errorObj, schema.schema, result, '');
    // NOTE: This assumes that all errors extend TypedError
    const error = new ServerError(formatError(errorClassName, result), errorClassName);
    Object.assign(error, result);
    return error;
}

export function parseResultError(result: any): ServerTransactionError {
    const server_error = parseRpcError(result.status.Failure);
    const server_tx_error = new ServerTransactionError();
    Object.assign(server_tx_error, server_error);
    server_tx_error.type = server_error.type;
    server_tx_error.message = server_error.message;
    server_tx_error.transaction_outcome = result.transaction_outcome;
    return server_tx_error;
}

export function formatError(errorClassName: string, errorData): string {
    if (typeof ErrorMessages[errorClassName] === 'string') {
        return renderTemplate(ErrorMessages[errorClassName], errorData);
    }
    return JSON.stringify(errorData);
}

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
        } else if (isObject(errorObj.kind) && isObject(errorObj.kind[errorName])) {
            error = errorObj.kind[errorName];
            type = schema[errorName];
            errorTypeName = errorName;
        }
    }
    if (error && type) {
        for (const prop of Object.keys(type.props)) {
            result[prop] = error[prop];
        }
        return walkSubtype(error, schema, result, errorTypeName);
    } else {
        // TODO: is this the right thing to do?
        result.kind = errorObj;
        return typeName;
    }
}

export function getErrorTypeFromErrorMessage(errorMessage, errorType) {
    // This function should be removed when JSON RPC starts returning typed errors.
    switch (true) {
        case /^account .*? does not exist while viewing$/.test(errorMessage):
            return 'AccountDoesNotExist';
        case /^Account .*? doesn't exist$/.test(errorMessage):
            return 'AccountDoesNotExist';
        case /^access key .*? does not exist while viewing$/.test(errorMessage):
            return 'AccessKeyDoesNotExist';
        case /wasm execution failed with error: FunctionCallError\(CompilationError\(CodeDoesNotExist/.test(
            errorMessage
        ):
            return 'CodeDoesNotExist';
        case /wasm execution failed with error: CompilationError\(CodeDoesNotExist/.test(errorMessage):
            return 'CodeDoesNotExist';
        case /wasm execution failed with error: FunctionCallError\(MethodResolveError\(MethodNotFound/.test(
            errorMessage
        ):
            return 'MethodNotFound';
        case /wasm execution failed with error: MethodResolveError\(MethodNotFound/.test(errorMessage):
            return 'MethodNotFound';
        case /Transaction nonce \d+ must be larger than nonce of the used access key \d+/.test(errorMessage):
            return 'InvalidNonce';
        default:
            return errorType;
    }
}

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
