import type { NumericString } from './types.js';
import { toUnits } from './utils.js';

const GIGA_NOMINATION_EXP = 9;
const TERA_NOMINATION_EXP = 12;

export function gigaToGas(giga: NumericString | number): bigint {
    return toUnits(giga, GIGA_NOMINATION_EXP);
}

export function teraToGas(tera: NumericString | number): bigint {
    return toUnits(tera, TERA_NOMINATION_EXP);
}
