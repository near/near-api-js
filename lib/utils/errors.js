"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewErrorContext = exports.NewTypedError = exports.ErrorContext = exports.TypedError = exports.ArgumentTypeError = exports.PositionalArgsError = void 0;
class PositionalArgsError extends Error {
    constructor() {
        super('Contract method calls expect named arguments wrapped in object, e.g. { argName1: argValue1, argName2: argValue2 }');
    }
}
exports.PositionalArgsError = PositionalArgsError;
class ArgumentTypeError extends Error {
    constructor(argName, argType, argValue) {
        super(`Expected ${argType} for '${argName}' argument, but got '${JSON.stringify(argValue)}'`);
    }
}
exports.ArgumentTypeError = ArgumentTypeError;
class TypedError extends Error {
    constructor(message, type, context) {
        super(message);
        this.type = type || 'UntypedError';
        this.context = context;
    }
}
exports.TypedError = TypedError;
class ErrorContext {
    constructor(transactionHash) {
        this.transactionHash = transactionHash;
    }
}
exports.ErrorContext = ErrorContext;
/* This is the ONLY additional Error class for RPC errors that we have */
class NewTypedError extends Error {
    constructor(message, type, context) {
        super(message);
        this.type = type;
        this.context = context;
    }
    ; // should the app try again with the same data?
    isSubtypeOf(errorType) {
        return this.errorPath && this.errorPath.includes(errorType);
    }
}
exports.NewTypedError = NewTypedError;
class NewErrorContext {
    constructor(data) {
        this.data = data;
    }
}
exports.NewErrorContext = NewErrorContext;
