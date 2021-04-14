import { TypedError } from './errors';
import { ExecutionOutcomeWithIdView } from '../providers/provider';
export declare class ServerError extends TypedError {
    context?: ServerErrorContext;
    constructor(message: string, type: string, context?: ServerErrorContext);
}
export declare class ServerErrorContext {
    transactionHash?: string;
    errorPath?: Record<string, any>;
    constructor(transactionHash?: string, errorPath?: Record<string, any>);
}
export declare class ServerTransactionError extends ServerError {
    transaction_outcome: ExecutionOutcomeWithIdView;
}
export declare function parseRpcError(errorObj: Record<string, any>): ServerError;
export declare function parseRpcResultError(result: any): ServerTransactionError;
export declare function formatError(errorClassName: string, errorData: any): string;
export declare function getErrorTypeFromErrorMessage(errorMessage: any): "CodeDoesNotExist" | "AccountDoesNotExist" | "InvalidNonce" | "AccessKeyDoesNotExist" | "UntypedError";
