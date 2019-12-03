const BN = require ('bn.js');

// Exponent for calculating how many units of account balance are in one near.
const exp = 24;
// actual number of units of account balance in one near.
const unitsInOneNear = new BN('10', 10).pow(new BN(exp, 10));

/**
 * Convert account balance to near.
 * @param balance
 */
export function convertAccountBalanceAmountToNear(balance: string): string {
    const amtBN = new BN(balance, 10);
    if (amtBN.lte(unitsInOneNear)) {
        return `0.${balance.padStart(exp, '0')}`;
    }
    return `${amtBN.div(unitsInOneNear).toString(10, 0)}.${amtBN.mod(unitsInOneNear).toString(10, 0)}`;
}

/**
 *
 * @param amt
 */
export function nearAmountToAccountBalanceAmount(amt) {
    if (!amt) { return amt; }
    amt = amt.trim();
    const split = amt.split('.');
    if (split.length === 1) {
        return `${amt.padEnd(exp + 1, '0')}`;
    }
    if (split.length > 2 || split[1].length > exp) {
        throw new Error('Invalid input format');
    }
    const wholePart = new BN(split[0], 10).mul(unitsInOneNear);
    const fractionPart = new BN(split[1].padEnd(exp, '0'), 10);
    return `${wholePart.add(fractionPart).toString(10, 0)}`;
}
