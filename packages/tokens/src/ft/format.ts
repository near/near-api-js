export const MAX_NOMINATION_EXP = 24;

/**
 * Convert internal indivisible units to formatted human-readable amount
 */
export function formatAmount(
    units: string | number | bigint,
    fracDigits: number,
    precision: number = fracDigits,
): string {
    units = cleanupUnits(units);

    const wholeStr = units.substring(0, units.length - fracDigits) || '0';
    let fractionStr = units
        .substring(units.length - fracDigits)
        .substring(0, fracDigits)
        .padStart(fracDigits, '0');

    fractionStr = fractionStr.substring(0, precision);

    return trimTrailingZeroes(`${wholeStr}.${fractionStr}`);
}

/**
 * Convert human readable amount to internal indivisible units.
 */
export function parseAmount(amount: string, fracDigits: number): string {
    amount = cleanupAmount(amount);
    const split = amount.split('.');

    if (split.length > 2) {
        throw new Error(
            `Cannot parse amount '${amount}' as it contains more than a single dot`,
        );
    }

    const wholePart = split[0];
    const fracPart = split[1] || '';

    if (fracPart.length > MAX_NOMINATION_EXP) {
        throw new Error(
            `Cannot parse amount '${amount}' as it exceeds maximum decimal precision of ${MAX_NOMINATION_EXP}`,
        );
    }

    return trimLeadingZeroes(
        wholePart + fracPart.substring(0, fracDigits).padEnd(fracDigits, '0'),
    );
}

/**
 * Removes commas from the input
 * @param amount A value or amount that may contain commas
 * @returns string The cleaned value
 */
function cleanupAmount(amount: string): string {
    return amount.replace(/,/g, '.').trim();
}

/**
 * Removes .000… from an input
 * @param value A value that may contain trailing zeroes in the decimals place
 * @returns string The value without the trailing zeros
 */
function trimTrailingZeroes(value: string): string {
    return value.replace(/\.?0*$/, '');
}

/**
 * Removes leading zeroes from an input
 * @param value A value that may contain leading zeroes
 * @returns string The value without the leading zeroes
 */
function trimLeadingZeroes(value: string): string {
    value = value.replace(/^0+/, '');
    if (value === '') {
        return '0';
    }
    return value;
}

function cleanupUnits(amount: string | number | bigint): string {
    return BigInt(amount).toString();
}
