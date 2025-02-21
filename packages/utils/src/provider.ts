import type { FinalExecutionOutcome } from '@near-js/types';

/** @hidden */
export function getTransactionLastResult(
    txResult: FinalExecutionOutcome,
): Exclude<object | string | number | null, Function> {
    if (typeof txResult.status === 'object' && typeof txResult.status.SuccessValue === 'string') {
        const value = Buffer.from(txResult.status.SuccessValue, 'base64').toString();
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }
    return null;
}
