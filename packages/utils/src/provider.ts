import { FinalExecutionOutcome } from '@near-js/types';

import { base64Decode, bytesToString } from './format';

/** @hidden */
export function getTransactionLastResult(txResult: FinalExecutionOutcome): Exclude<object | string | number | null, Function> {
    if (typeof txResult.status === 'object' && typeof txResult.status.SuccessValue === 'string') {
        const value = bytesToString(base64Decode(txResult.status.SuccessValue));
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }
    return null;
}
