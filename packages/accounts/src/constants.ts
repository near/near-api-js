import { parseNearAmount } from '@near-js/utils';
/** @deprecated Will be removed in the next major release */
export const MULTISIG_STORAGE_KEY = '__multisigRequest';
/** @deprecated Will be removed in the next major release */
export const MULTISIG_ALLOWANCE = BigInt(parseNearAmount('1'));
// TODO: Different gas value for different requests (can reduce gas usage dramatically)
/** @deprecated Will be removed in the next major release */
export const MULTISIG_GAS = 100000000000000n;
/** @deprecated Will be removed in the next major release */
export const MULTISIG_DEPOSIT = 0n;
/** @deprecated Will be removed in the next major release */
export const MULTISIG_CHANGE_METHODS = [
    'add_request',
    'add_request_and_confirm',
    'delete_request',
    'confirm',
];
/** @deprecated Will be removed in the next major release */
export const MULTISIG_CONFIRM_METHODS = ['confirm'];
