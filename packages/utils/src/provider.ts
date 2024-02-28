import { TxOutcome } from '@near-js/types/lib/provider/response';

/** @hidden */
export function getTransactionLastResult(txResult: TxOutcome): any {
    if (typeof txResult.final_execution_outcome.status === 'object' && typeof txResult.final_execution_outcome.status.SuccessValue === 'string') {
        const value = Buffer.from(txResult.final_execution_outcome.status.SuccessValue, 'base64').toString();
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }
    return null;
}
