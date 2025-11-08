import { FinalExecutionOutcome } from '@near-js/types';

/** @hidden */
export function getTransactionLastResult(txResult: FinalExecutionOutcome): object | string | number | null {
    if (typeof txResult.status === 'object' && typeof txResult.status.SuccessValue === 'string') {
        const value = Buffer.from(txResult.status.SuccessValue, 'base64').toString();
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }
    return null;
}
