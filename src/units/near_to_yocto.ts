import type { NumericString } from './types.js';

const NEAR_NOMINATION_EXP = 24;

export function nearToYocto(near: number | NumericString): bigint {
    const cleanedAmount = cleanupAmount(near.toString());
    if (!cleanedAmount) {
        throw new Error('Amount cannot be empty');
    }
    const split = cleanedAmount.split('.');
    const wholePart = split[0];
    const fracPart = split[1] || '';
    if (split.length > 2 || fracPart.length > NEAR_NOMINATION_EXP) {
        throw new Error(`Cannot parse '${near}' as NEAR amount`);
    }
    return BigInt(trimLeadingZeroes(wholePart + fracPart.padEnd(NEAR_NOMINATION_EXP, '0')) as unknown as bigint);
}

function cleanupAmount(amount: string): string {
    return amount.replace(/,/g, '').trim();
}

function trimLeadingZeroes(value: string): string {
    value = value.replace(/^0+/, '');
    if (value === '') {
        return '0';
    }
    return value;
}
