import type { RpcTransactionResponse } from '../rpc/types.gen.js';
import type { FinalExecutionOutcome } from '../types/index.js';

/** @hidden */
// eslint-disable-next-line @typescript-eslint/ban-types
export function getTransactionLastResult(
    txResult: FinalExecutionOutcome | RpcTransactionResponse
): Exclude<object | string | number | null, Function> {
    if (
        typeof txResult.status === 'object' &&
        txResult.status !== null &&
        'SuccessValue' in txResult.status &&
        typeof txResult.status.SuccessValue === 'string'
    ) {
        const value = Buffer.from(txResult.status.SuccessValue, 'base64').toString();
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }
    return null;
}
