"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isImplicitAccount = exports.isValidId = void 0;
const NAMED_ACCOUNT_ID_REGEX = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;
const IMPLICIT_ACCOUNT_ID_REGEX = /^[a-f0-9]{64}$/;
/*
 * Validate a NEAR account ID.
 */
exports.isValidId = (address) => {
    if (exports.isImplicitAccount(address)) {
        return IMPLICIT_ACCOUNT_ID_REGEX.test(address);
    }
    return NAMED_ACCOUNT_ID_REGEX.test(address);
};
exports.isImplicitAccount = (address) => {
    return !address.includes('.');
};
