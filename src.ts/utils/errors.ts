export class PositionalArgsError extends Error {
    constructor() {
        super('Contract method calls expect named arguments wrapped in object, e.g. { argName1: argValue1, argName2: argValue2 }');
    }
}
