import type { BigintString, NumericString } from './types.js';
import { toUnits } from './utils.js';

const NEAR_NOMINATION_EXP = 24;

export function nearToYocto(near: number | NumericString): bigint {
    return toUnits(near, NEAR_NOMINATION_EXP);
}

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
