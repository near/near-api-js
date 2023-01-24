import { ErrorObject } from 'ajv';

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

export function logWarning(...args: any[]): void {
    if (!process.env['NEAR_NO_LOGS']) {
        console.warn(...args);
    }
}

export class UnsupportedSerializationError extends Error {
    constructor(methodName: string, serializationType: string) {
        super(`Contract method '${methodName}' is using an unsupported serialization type ${serializationType}`);
    }
}

export class UnknownArgumentError extends Error {
    constructor(actualArgName: string, expectedArgNames: string[]) {
        super(`Unrecognized argument '${actualArgName}', expected '${JSON.stringify(expectedArgNames)}'`);
    }
}

export class ArgumentSchemaError extends Error {
    constructor(argName: string, errors: ErrorObject[]) {
        super(`Argument '${argName}' does not conform to the specified ABI schema: '${JSON.stringify(errors)}'`);
    }
}

export class ConflictingOptions extends Error {
    constructor() {
        super('Conflicting contract method options have been passed. You can either specify ABI or a list of view/call methods.');
    }
}
