import { TypedError } from './errors';
export declare function parseRpcError(errorObj: Record<string, any>): TypedError;
export declare function parseResultError(result: any): TypedError;
export declare function formatError(errorClassName: string, errorData: any): string;
export declare function getErrorTypeFromErrorMessage(errorMessage: any): "CodeDoesNotExist" | "AccountDoesNotExist" | "InvalidNonce" | "AccessKeyDoesNotExist" | "UntypedError";
