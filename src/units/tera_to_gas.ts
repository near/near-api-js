import type { NumericString } from './types.js';

const TERA_NOMINATION_EXP = 12;

export function teraToGas(tera: NumericString | number): bigint {
    const cleanedAmount = cleanupAmount(`${tera}`);
    if (!cleanedAmount) {
        throw new Error('Amount cannot be empty');
    }
    const split = cleanedAmount.split('.');
    const wholePart = split[0];
    const fracPart = split[1] || '';
    if (split.length > 2 || fracPart.length > TERA_NOMINATION_EXP) {
        throw new Error(`Cannot parse '${tera}' as Tera Gas amount`);
    }
    return BigInt(trimLeadingZeroes(wholePart + fracPart.padEnd(TERA_NOMINATION_EXP, '0')));
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
