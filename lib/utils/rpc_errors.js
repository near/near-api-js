"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mustache_1 = __importDefault(require("mustache"));
const rpc_error_schema_json_1 = __importDefault(require("../generated/rpc_error_schema.json"));
const error_messages_json_1 = __importDefault(require("../res/error_messages.json"));
const CLASSMAP = __importStar(require("../generated/rpc_error_types"));
__export(require("../generated/rpc_error_types"));
function parseRpcError(errorObj) {
    const result = {};
    const errorClassName = walkSubtype(errorObj, rpc_error_schema_json_1.default.schema, result, '');
    // NOTE: This assumes that all errors extend TypedError
    const error = new CLASSMAP[errorClassName](formatError(errorClassName, result), errorClassName);
    Object.assign(error, result);
    return error;
}
exports.parseRpcError = parseRpcError;
function formatError(errorClassName, errorData) {
    if (typeof error_messages_json_1.default[errorClassName] === 'string') {
        return mustache_1.default.render(error_messages_json_1.default[errorClassName], errorData);
    }
    return JSON.stringify(errorData);
}
exports.formatError = formatError;
function walkSubtype(errorObj, schema, result, typeName) {
    let error;
    let type;
    let errorTypeName;
    for (const errorName in schema) {
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
        for (const prop in type.props) {
            if (type.props.hasOwnProperty(prop)) {
                result[prop] = error[prop];
            }
        }
        return walkSubtype(error, schema, result, errorTypeName);
    }
    else {
        return typeName;
    }
}
function isObject(n) {
    return Object.prototype.toString.call(n) === '[object Object]';
}
