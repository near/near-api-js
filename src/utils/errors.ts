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
    constructor(message: string, type: string, context?: ErrorContext) {
        super(message);
        this.type = type;
        this.context = context;
    }

    isSubtypeOf(errorType: string) {
        return this.context && this.context.errorPath &&
            JSON.stringify(this.context.errorPath).includes(errorType);
    }
}

export class ErrorContext {
    transactionHash?: string;
    errorPath?: Record<string, any>;
    transactionOutcome?: any;
    constructor(transactionHash?: string, errorPath?: Record<string, any>, transactionOutcome?: any) {
        this.transactionHash = transactionHash;
        this.errorPath = errorPath;
        this.transactionOutcome = transactionOutcome;
    }
}