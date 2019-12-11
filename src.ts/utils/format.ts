const BN = require ('bn.js');

// Exponent for calculating how many units of account balance are in one near.
const NEAR_NOMINATION_EXP = 18;
// actual number of units of account balance in one near.
const NEAR_NOMINATION = new BN('10', 10).pow(new BN(NEAR_NOMINATION_EXP, 10));

/**
 * Convert account balance value from internal units (currently yoctoNEAR) to NEAR.
 * @param balance
 */
export function formatNearAmount(balance: string): string {
    const amtBN = new BN(balance, 10);
    if (amtBN.lt(NEAR_NOMINATION)) {
        return trimTrailingZeroes(`0.${balance.padStart(NEAR_NOMINATION_EXP, '0')}`);
    }
    const wholePart = amtBN.div(NEAR_NOMINATION).toString(10, 0);
    return trimTrailingZeroes(`${formatWithCommas(wholePart)}.${amtBN.mod(NEAR_NOMINATION).toString(10, NEAR_NOMINATION_EXP)}`);
}

/**
 * Convert human readable near amount to internal account balance units.
 * @param amt
 */
export function parseNearAmount(amt?: string): string | null {
    if (!amt) { return amt; }
    amt = amt.trim();
    const split = amt.split('.');
    if (split.length === 1) {
        return `${amt.padEnd(NEAR_NOMINATION_EXP + 1, '0')}`;
    }
    if (split.length > 2 || split[1].length > NEAR_NOMINATION_EXP) {
        throw new Error(`Cannot parse '${amt}' as NEAR amount`);
    }
    const wholePart = new BN(split[0], 10).mul(NEAR_NOMINATION);
    const fractionPart = new BN(split[1].padEnd(NEAR_NOMINATION_EXP, '0'), 10);
    return `${wholePart.add(fractionPart).toString(10, 0)}`;
}

function trimTrailingZeroes(value: string): string {
    for (let i = value.length - 1; i >= 0; i--) {
        if (value[i] === '.') {
            return value.substring(0, i);
        } else if (value[i] !== '0') {
            return value.substring(0, i + 1);
        }
    }
    return value;
}

function formatWithCommas(value: string): string {
    const pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(value)) {
        value = value.replace(pattern, '$1,$2');
    }
    return value;
}
