import { TypedError } from './errors';
import { ExecutionOutcomeWithIdView } from '../providers/provider';
export declare class RpcError extends TypedError {
    transactionHash?: string;
    errorPath?: Record<string, any>;
    constructor(message: string, type: string, transactionHash?: string, errorPath?: Record<string, any>);
}
export declare class ReceiptExecutionFailure extends TypedError {
    errorPath?: Record<string, any>;
    transaction_outcome: ExecutionOutcomeWithIdView;
    constructor(message: string, type: string, errorPath?: Record<string, any>);
}
export declare function parseRpcError(errorObj: Record<string, any>): RpcError;
export declare function parseReceiptExecutionFailure(result: any): ReceiptExecutionFailure;
export declare function formatError(errorType: string, errorData: any): string;
export declare function getErrorTypeFromErrorMessage(errorMessage: any): "CodeDoesNotExist" | "AccountDoesNotExist" | "InvalidNonce" | "AccessKeyDoesNotExist" | "UntypedError";
