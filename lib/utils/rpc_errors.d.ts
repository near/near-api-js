import { ServerError } from '../generated/rpc_error_types';
export * from '../generated/rpc_error_types';
export declare function parseRpcError(errorObj: Object): any;
export declare function formatError(error: ServerError): string;
