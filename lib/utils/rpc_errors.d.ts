import { ServerError } from '../generated/rpc_error_types';
import { TypedError } from './errors';
export * from '../generated/rpc_error_types';
export declare function parseRpcError(errorObj: Object): ServerError;
export declare function parseIntoOldTypedError(errorObj: Object): TypedError;
export declare function formatError(error: ServerError): string;
