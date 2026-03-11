// No-op stub for is-my-json-valid in the IIFE browser bundle.
// ABI schema validation is a development-time feature that adds ~44KB of
// dependencies (is-my-json-valid, generate-function, is-property, etc).
// In the browser IIFE bundle, validation is skipped — all arguments pass.
interface ValidateFunction {
    (value: unknown): boolean;
    errors: null;
}

function validator(_schema: unknown): ValidateFunction {
    const fn = (_value: unknown) => true;
    fn.errors = null;
    return fn as ValidateFunction;
}

export default validator;
