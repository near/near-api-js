import type { NumericString } from './types.js';

export function toUnits(amount: NumericString | number, exponent: number): bigint {
    const cleanedAmount = cleanupAmount(`${amount}`);
    if (!cleanedAmount) {
        throw new Error('Amount cannot be empty');
    }
    const split = cleanedAmount.split('.');
    const wholePart = split[0];
    const fracPart = split[1] || '';
    if (split.length > 2 || fracPart.length > exponent) {
        throw new Error(`Cannot parse '${amount}'`);
    }
    return BigInt(trimLeadingZeroes(wholePart + fracPart.padEnd(exponent, '0')));
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
