import BN from 'bn.js';
import { Gas, NEAR } from '..';

const NOT_NUMBER_OR_UNDERLINE = /[^\d_]/;

function has_non_number(s: unknown): s is string {
    return typeof s === 'string' && NOT_NUMBER_OR_UNDERLINE.test(s);
}

export function parseGas(s: string | BN): Gas {
    if (has_non_number(s)) {
        return Gas.parse(s);
    }

    return Gas.from(s);
}

// One difference with `NEAR.parse` is that here strings of just numbers are considered `yN`
// And not `N`
export function parseNEAR(s: string | BN): NEAR {
    if (has_non_number(s)) {
        return NEAR.parse(s);
    }

    return NEAR.from(s);
}
