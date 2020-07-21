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
    txnId?: string;
    constructor(message?: string, type?: string, txnId?: string) {
        super(message);
        this.type = type || 'UntypedError';
        this.txnId = txnId;
    }
}
