"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BN = require('bn.js');
// Exponent for calculating how many units of account balance are in one near.
const NEAR_NOMINATION_EXP = 18;
// actual number of units of account balance in one near.
const NEAR_NOMINATION = new BN('10', 10).pow(new BN(NEAR_NOMINATION_EXP, 10));
/**
 * Convert account balance value from internal units (currently yoctoNEAR) to NEAR.
 * @param balance
 */
function formatNearAmount(balance, digits) {
    balance = trimLeadingZeroes(balance);
    console.log(balance);
    const amtBN = new BN(balance, 10);
    if (amtBN.lt(NEAR_NOMINATION)) {
        const fractionPart = balance.padStart(NEAR_NOMINATION_EXP, '0');
        return trimTrailingZeroes(`0.${truncateFractionPart(fractionPart, digits)}`);
    }
    const wholePart = amtBN.div(NEAR_NOMINATION).toString(10, 0);
    const fractionPart = amtBN.mod(NEAR_NOMINATION).toString(10, NEAR_NOMINATION_EXP);
    return trimTrailingZeroes(`${formatWithCommas(wholePart)}.${truncateFractionPart(fractionPart, digits)}`);
}
exports.formatNearAmount = formatNearAmount;
/**
 * Convert human readable near amount to internal account balance units.
 * @param amt
 */
function parseNearAmount(amt) {
    if (!amt) {
        return amt;
    }
    amt = amt.trim();
    const split = amt.split('.');
    if (split.length === 1) {
        return `${amt.padEnd(NEAR_NOMINATION_EXP + 1, '0')}`;
    }
    if (split.length > 2 || split[1].length > NEAR_NOMINATION_EXP) {
        throw new Error(`Cannot parse '${amt}' as NEAR amount`);
    }
    const wholePart = new BN(split[0], 10).mul(NEAR_NOMINATION);
    const fractionPart = new BN(split[1].padEnd(NEAR_NOMINATION_EXP, '0'), 10);
    return `${wholePart.add(fractionPart).toString(10, 0)}`;
}
exports.parseNearAmount = parseNearAmount;
/**
 * Truncates the fraction part of a number to a given number of digits and then trims extra zeroes.
 * @param value
 * @param digits
 */
function truncateFractionPart(value, digits) {
    if (digits && value.length > digits) {
        if (value[digits] >= '5') {
            return value.substring(0, digits - 1) + String.fromCharCode(value[digits - 1].charCodeAt(0) + 1);
        }
        else {
            return value.substring(0, digits);
        }
    }
    return value;
}
function trimLeadingZeroes(value) {
    return value.replace(/^0+/, '');
}
function trimTrailingZeroes(value) {
    for (let i = value.length - 1; i >= 0; i--) {
        if (value[i] === '.') {
            return value.substring(0, i);
        }
        else if (value[i] !== '0') {
            return value.substring(0, i + 1);
        }
    }
    return value;
}
function formatWithCommas(value) {
    const pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(value)) {
        value = value.replace(pattern, '$1,$2');
    }
    return value;
}
