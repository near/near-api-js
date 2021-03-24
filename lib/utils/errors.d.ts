import { ExecutionOutcomeWithIdView } from '../providers/provider';
export declare class PositionalArgsError extends Error {
    constructor();
}
export declare class ArgumentTypeError extends Error {
    constructor(argName: string, argType: string, argValue: any);
}
export declare class TypedError extends Error {
    type: string;
    context?: ErrorContext;
    constructor(message: string, type: string, context?: ErrorContext);
    isSubtypeOf(errorType: string): boolean;
}
export declare class ErrorContext {
    transactionHash?: string;
    errorPath?: Record<string, any>;
    transactionOutcome?: any;
    constructor(transactionHash?: string, errorPath?: Record<string, any>, transactionOutcome?: ExecutionOutcomeWithIdView);
}
