export class PositionalArgsError extends Error {
    constructor() {
        super('Contract method calls expect named arguments wrapped in object, e.g. { argName1: argValue1, argName2: argValue2 }');
    }
}

export class ArgumentTypeError extends Error {
    constructor(argName: string, argType: string, argValue: any) {
        super(`Expected ${argType} for '${argName}' argument, but got '${JSON.stringify(argValue)}'`);
    }
}

export class TypedError extends Error {
    type: string;
    context?: ErrorContext;
    constructor(message?: string, type?: string, context?: ErrorContext) {
        super(message);
        this.type = type || 'UntypedError';
        this.context = context;
    }
}

export class ErrorContext {
    transactionHash?: string;
    constructor(transactionHash?: string) {
        this.transactionHash = transactionHash;
    }
}

/* This is the ONLY additional Error class for RPC errors that we have */
export class NewTypedError extends Error {
    type: string; // type is a mandatory field, developers can always rely on it
    /* errorPath example: CodeDoesNotExist.CompilationError.FunctionCallError.ActionError.TxExecutionError.ServerError.JsonRpcError
    Can be sent from JSON RPC or generated on near-api-js side
    Each error path will end with the origin of the error itself
    (like JsonRpc, Ledger, NearApiJs etc.).
    Not sure if this field should be mandatory
    Another option is to have struuctured errorPath like this:
    {"TxExecutionError":{"InvalidTxError":{"InvalidNonce":{"tx_nonce":2,"ak_nonce":28}}}}}*/
    errorPath?: string;
    shouldRetry: boolean;; // should the app try again with the same data?
    context?: NewErrorContext; // context is optional, not all the errors have it
    constructor(message: string, type: string, context?: NewErrorContext) {
        super(message);
        this.type = type;
        this.context = context;
    }

    isSubtypeOf(errorType: string) {
        return this.errorPath && this.errorPath.includes(errorType);
    }
}

export class NewErrorContext {
    // Error context can contain fields for all possible context data, still under discussion
    data: Object;
    constructor(data?: Object) {
        this.data = data;
    }
}