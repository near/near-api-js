import { ServerError } from '../generated/rpc_error_types';
export * from '../generated/rpc_error_types';
declare class ServerTransactionError extends ServerError {
    transaction_outcome: any;
}
export declare function parseRpcError(errorObj: Record<string, any>): ServerError;
export declare function parseResultError(result: any): ServerTransactionError;
export declare function formatError(errorClassName: string, errorData: any): string;
