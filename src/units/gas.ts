import type { NumericString } from './types.js';
import { toUnits } from './utils.js';

const GIGA_NOMINATION_EXP = 9;
const TERA_NOMINATION_EXP = 12;

/**
 * Converts gigagas to integer gas units (10^9 gas per gigagas).
 * @param giga - Decimal gigagas amount. Prefer a string to avoid number precision loss.
 * @returns Integer gas units, without rounding.
 * @throws If the amount cannot be parsed or has more than 9 fractional digits.
 */
export function gigaToGas(giga: NumericString | number): bigint {
    return toUnits(giga, GIGA_NOMINATION_EXP);
}

/**
 * Converts teragas (TGas) to integer gas units (10^12 gas per TGas).
 * @param tera - Decimal TGas amount. Prefer a string to avoid number precision loss.
 * @returns Integer gas units, without rounding.
 * @throws If the amount cannot be parsed or has more than 12 fractional digits.
 */
export function teraToGas(tera: NumericString | number): bigint {
    return toUnits(tera, TERA_NOMINATION_EXP);
}
