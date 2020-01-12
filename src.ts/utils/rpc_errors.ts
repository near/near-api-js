
import Mustache from 'mustache';
import schema from '../generated/rpc_error_schema.json';
import messages from '../res/error_messages.json';
import * as CLASSMAP from '../generated/rpc_error_types';
import { ServerError } from '../generated/rpc_error_types';
import { TypedError } from './errors';

export * from '../generated/rpc_error_types';

export function parseRpcError(errorObj: Object): ServerError {
    const result = {};
    const errorClassName = walkSubtype(errorObj, schema.schema, result, '');
    const error = new CLASSMAP[errorClassName]();
    Object.assign(error, result);
    return error;
}

// Transforms error to the old "TypedError"
export function parseIntoOldTypedError(errorObj: Object): TypedError {
    const result = {};
    const errorClassName = walkSubtype(errorObj, schema.schema, result, '');
    const error = new CLASSMAP[errorClassName]();
    Object.assign(error, result);
    return new TypedError(formatError(error), '');
}

export function formatError(error: ServerError): string {
    if (typeof messages[error.constructor.name] === 'string') {
        return Mustache.render(messages[error.constructor.name], error);
    }
    return JSON.stringify(error);
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
