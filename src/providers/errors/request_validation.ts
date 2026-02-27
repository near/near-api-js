import { RpcError } from './rpc.js';

export class RequestValidationError extends RpcError {}

export class RpcMethodNotFoundError extends RequestValidationError {
    constructor(public readonly methodName: string) {
        super(`RPC method ${methodName} not found`);
    }
}

export class RpcRequestParseError extends RequestValidationError {}
