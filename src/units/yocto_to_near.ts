import type { BigintString, NumericString } from './types.js';

const NEAR_NOMINATION_EXP = 24;

export function yoctoToNear(yocto: bigint | BigintString, decimals: number = NEAR_NOMINATION_EXP): NumericString {
    decimals = Math.floor(decimals);

    if (decimals < 0 || decimals > NEAR_NOMINATION_EXP) {
        throw new Error('Decimal places argument must be between 0 and 24');
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

const ROUNDING_OFFSETS: bigint[] = [];
const BN10 = 10n;
for (let i = 0, offset = 5n; i < NEAR_NOMINATION_EXP; i++, offset = offset * BN10) {
    ROUNDING_OFFSETS[i] = offset;
}

function trimTrailingZeroes(value: string): string {
    return value.replace(/\.?0*$/, '');
}
