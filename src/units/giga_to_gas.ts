import type { NumericString } from './types.js';

const GIGA_NOMINATION_EXP = 9;

export function gigaToGas(giga: NumericString | number): bigint {
    const cleanedAmount = cleanupAmount(`${giga}`);
    if (!cleanedAmount) {
        throw new Error('Amount cannot be empty');
    }
    const split = cleanedAmount.split('.');
    const wholePart = split[0];
    const fracPart = split[1] || '';
    if (split.length > 2 || fracPart.length > GIGA_NOMINATION_EXP) {
        throw new Error(`Cannot parse '${giga}' as Giga Gas amount`);
    }
    return BigInt(trimLeadingZeroes(wholePart + fracPart.padEnd(GIGA_NOMINATION_EXP, '0')));
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
