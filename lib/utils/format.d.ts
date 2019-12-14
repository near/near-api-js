/**
 * Convert account balance value from internal units (currently yoctoNEAR) to NEAR.
 * @param balance
 */
export declare function formatNearAmount(balance: string, digits?: number): string;
/**
 * Convert human readable near amount to internal account balance units.
 * @param amt
 */
export declare function parseNearAmount(amt?: string): string | null;
