import type { BigintString, NumericString } from './types.js';
import { toUnits } from './utils.js';

const NEAR_NOMINATION_EXP = 24;

/**
 * Converts NEAR to integer yoctoNEAR (10^24 yoctoNEAR per NEAR).
 * @param near - Decimal amount. Prefer a string to avoid JavaScript number precision loss.
 * @returns The amount in yoctoNEAR, without rounding.
 * @throws If the amount cannot be parsed or has more than 24 fractional digits.
 */
export function nearToYocto(near: number | NumericString): bigint {
    return toUnits(near, NEAR_NOMINATION_EXP);
}

/**
 * Formats integer yoctoNEAR as a decimal NEAR string.
 * @param yocto - Amount in yoctoNEAR as a bigint or integer string.
 * @param decimals - Maximum fractional digits, from 0 to 24. Defaults to 24; fractional values are floored.
 * @returns A decimal string with excess fractional digits truncated and trailing zeroes removed.
 * @throws If the amount is not an integer or the requested precision is outside the supported range.
 */
export function yoctoToNear(yocto: bigint | BigintString, decimals: number = NEAR_NOMINATION_EXP): NumericString {
    decimals = Math.floor(decimals);

    if (decimals < 0 || decimals > NEAR_NOMINATION_EXP) {
        throw new Error(`Decimal places argument must be between 0 and ${NEAR_NOMINATION_EXP}`);
    }

    // check if bigint is constructible
    yocto = `${BigInt(yocto)}`;
    const wholeStr = yocto.substring(0, yocto.length - NEAR_NOMINATION_EXP) || '0';
    const fractionStr = yocto
        .substring(yocto.length - NEAR_NOMINATION_EXP)
        .padStart(NEAR_NOMINATION_EXP, '0')
        .substring(0, decimals);

    return trimTrailingZeroes(`${wholeStr}.${fractionStr}`) as unknown as NumericString;
}

function trimTrailingZeroes(value: string): string {
    return value.replace(/\.?0*$/, '');
}
