import { TypedError } from './errors';
import { ExecutionOutcomeWithIdView } from '../providers/provider';
declare class ServerError extends TypedError {
}
declare class ServerTransactionError extends ServerError {
    transaction_outcome: ExecutionOutcomeWithIdView;
}
export declare function parseRpcError(errorObj: Record<string, any>): ServerError;
export declare function parseRpcResultError(result: any): ServerTransactionError;
export declare function formatError(errorClassName: string, errorData: any): string;
export declare function getErrorTypeFromErrorMessage(errorMessage: any): "CodeDoesNotExist" | "AccountDoesNotExist" | "InvalidNonce" | "AccessKeyDoesNotExist" | "UntypedError";
export {};
