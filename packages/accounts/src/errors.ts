import { ValidationError } from 'is-my-json-valid';

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
    constructor(argName: string, errors: ValidationError[]) {
        super(`Argument '${argName}' does not conform to the specified ABI schema: '${JSON.stringify(errors)}'`);
    }
}

export class ConflictingOptions extends Error {
    constructor() {
        super('Conflicting contract method options have been passed. You can either specify ABI or a list of view/call methods.');
    }
}
