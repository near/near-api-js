
import Mustache from 'mustache';
import schema from '../generated/rpc_error_schema.json';
import messages from '../res/error_messages.json';
import * as CLASSMAP from '../generated/rpc_error_types';
import { ServerError } from '../generated/rpc_error_types';;
export * from '../generated/rpc_error_types';


export function parseRpcError(errorObj: Object) {
    let result = {};
    let errorClassName = walkSubtype(errorObj, schema.schema, result, '');
    let error = new CLASSMAP[errorClassName];
    Object.assign(error, result);
    return error;
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
    for (let errorName in schema) {
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
        for (let prop in type.props) {
            result[prop] = error[prop];
        }
        return walkSubtype(error, schema, result, errorTypeName);
    } else {
        return typeName;
    }
}

function isObject(n) {
    return Object.prototype.toString.call(n) === '[object Object]';
}

