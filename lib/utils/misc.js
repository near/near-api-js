"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNEAR = exports.parseGas = void 0;
const __1 = require("..");
const NOT_NUMBER_OR_UNDERLINE = /[^\d_]/;
function has_non_number(s) {
    return typeof s === 'string' && NOT_NUMBER_OR_UNDERLINE.test(s);
}
function parseGas(s) {
    if (has_non_number(s)) {
        return __1.Gas.parse(s);
    }
    return __1.Gas.from(s);
}
exports.parseGas = parseGas;
// One difference with `NEAR.parse` is that here strings of just numbers are considered `yN`
// And not `N`
function parseNEAR(s) {
    if (has_non_number(s)) {
        return __1.NEAR.parse(s);
    }
    return __1.NEAR.from(s);
}
exports.parseNEAR = parseNEAR;
