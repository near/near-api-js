import BN from 'bn.js';

/** Default amount of gas to be sent with the function calls. Used to pay for the fees
* incurred while running the contract execution. The unused amount will be refunded back to
* the originator.
* Due to protocol changes that charge upfront for the maximum possible gas price inflation due to
* full blocks, the price of max_prepaid_gas is decreased to `300 * 10**12`.
* For discussion see https://github.com/nearprotocol/NEPs/issues/67
*/
export const DEFAULT_FUNCTION_CALL_GAS = new BN('30000000000000');

/**
 * Hash if no contract is present for an account.
 */
export const EMPTY_CONTRACT_HASH = "11111111111111111111111111111111";

export const ZERO_NEAR = new BN('0');