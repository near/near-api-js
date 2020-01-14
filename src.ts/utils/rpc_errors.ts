
import Mustache from 'mustache';
import schema from '../generated/rpc_error_schema.json';
import messages from '../res/error_messages.json';
import * as CLASSMAP from '../generated/rpc_error_types';
import { ServerError } from '../generated/rpc_error_types';

export * from '../generated/rpc_error_types';

export function parseRpcError(errorObj: Object): ServerError {
    const result = {};
    const errorClassName = walkSubtype(errorObj, schema.schema, result, '');
    // NOTE: This assumes that all errors extend TypedError
    const error = new CLASSMAP[errorClassName](formatError(errorClassName, result), errorClassName);
    Object.assign(error, result);
    return error;
}

export function formatError(errorClassName: string, errorData): string {
    if (typeof messages[errorClassName] === 'string') {
        return Mustache.render(messages[errorClassName], errorData);
    }
    return JSON.stringify(errorData);
}

function walkSubtype(errorObj, schema, result, typeName) {
    let error;
    let type;
    let errorTypeName;
    for (const errorName in schema) {
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
        for (const prop in type.props) {
            if (type.props.hasOwnProperty(prop)) {
                result[prop] = error[prop];
            }
        }
        return walkSubtype(error, schema, result, errorTypeName);
    } else {
        return typeName;
    }
}

function isObject(n) {
    return Object.prototype.toString.call(n) === '[object Object]';
}
