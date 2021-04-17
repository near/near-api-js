
import Mustache from 'mustache';
import schema from '../generated/rpc_error_schema.json';
import messages from '../res/error_messages.json';
import { TypedError } from './errors';
import { ExecutionOutcomeWithIdView } from '../providers/provider';

export class RpcError extends TypedError {
    transactionHash?: string;
    errorPath?: Record<string, any>; //TODO: do we need this field?
    constructor(message: string, type: string, transactionHash?: string, errorPath?: Record<string, any>) {
        super(message, type);
        this.transactionHash = transactionHash;
        this.errorPath = errorPath;
    }
}
export class ReceiptExecutionFailure extends TypedError {
    //TODO: add transaction hash?
    //TODO: add recurcive search
    errorPath?: Record<string, any>;
    public transaction_outcome: ExecutionOutcomeWithIdView; //TODO: add to constructor?
    constructor(message: string, type: string, errorPath?: Record<string, any>) {
        super(message, type);
        this.errorPath = errorPath;
    }
}

export function parseRpcError(errorObj: Record<string, any>): RpcError {
    const additionalData = {};
    const errorType = walkSubtype(errorObj, schema.schema, additionalData, '');
    const rpcError = new RpcError(
        formatError(errorType, additionalData),
        errorType,
        undefined, //TODO: should it be here? (transaction hash)
        errorObj);
    Object.assign(rpcError, additionalData);
    return rpcError;
}

export function parseReceiptExecutionFailure(result: any): ReceiptExecutionFailure {
    const additionalData = {};
    const errorType = walkSubtype(result.status.Failure, schema.schema, additionalData, '');
    const receiptExecutionFailure = new ReceiptExecutionFailure(
        formatError(errorType, additionalData),
        errorType,
        result.status.Failure);
    Object.assign(receiptExecutionFailure, additionalData);
    receiptExecutionFailure.transaction_outcome = result.transaction_outcome;
    return receiptExecutionFailure;
}

export function formatError(errorType: string, errorData): string {
    if (typeof messages[errorType] === 'string') {
        return Mustache.render(messages[errorType], errorData);
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
        } else {
            continue;
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

export function getErrorTypeFromErrorMessage(errorMessage) {
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
