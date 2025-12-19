import type { RpcTransactionResponse } from '@near-js/jsonrpc-types';

/** @hidden */
// eslint-disable-next-line @typescript-eslint/ban-types
export function getTransactionLastResult(
    txResult: RpcTransactionResponse
): Exclude<object | string | number | null, Function> {
    if (
        typeof txResult.status === 'object' &&
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
