import {
    type BlockReference,
    type CodeResult,
    PositionalArgsError,
    type ViewStateResult,
} from '@near-js/types';
import { printTxOutcomeLogs } from '@near-js/utils';
import depd from 'depd';
import type { Connection } from './connection';
import type { ViewFunctionCallOptions } from './interface';

function parseJsonFromRawResponse(response: Uint8Array): any {
    return JSON.parse(Buffer.from(response).toString());
}

function bytesJsonStringify(input: any): Buffer {
    return Buffer.from(JSON.stringify(input));
}

/** @deprecated Will be removed in the next major release */
export function validateArgs(args: any) {
    const isUint8Array =
        args.byteLength !== undefined && args.byteLength === args.length;
    if (isUint8Array) {
        return;
    }

    if (Array.isArray(args) || typeof args !== 'object') {
        throw new PositionalArgsError();
    }
}

/**
 * @deprecated Will be removed in the next major release
 *
 * Returns the state (key value pairs) of account's contract based on the key prefix.
 * Pass an empty string for prefix if you would like to return the entire state.
 * @see [https://docs.near.org/api/rpc/contracts#view-contract-state](https://docs.near.org/api/rpc/contracts#view-contract-state)
 *
 * @param connection connection to query state from
 * @param accountId account whose state is viewed
 * @param prefix allows to filter which keys should be returned. Empty prefix means all keys. String prefix is utf-8 encoded.
 * @param blockQuery specifies which block to query state at. By default returns last "optimistic" block (i.e. not necessarily finalized).
 */
export async function viewState(
    connection: Connection,
    accountId: string,
    prefix: string | Uint8Array,
    blockQuery: BlockReference = { finality: 'optimistic' },
): Promise<Array<{ key: Buffer; value: Buffer }>> {
    const deprecate = depd('viewState()');
    deprecate('It will be removed in the next major release');

    const { values } = await connection.provider.query<ViewStateResult>({
        request_type: 'view_state',
        ...blockQuery,
        account_id: accountId,
        prefix_base64: Buffer.from(prefix).toString('base64'),
    });

    return values.map(({ key, value }) => ({
        key: Buffer.from(key, 'base64'),
        value: Buffer.from(value, 'base64'),
    }));
}

/**
 * @deprecated Will be removed in the next major release
 *
 * Invoke a contract view function using the RPC API.
 * @see [https://docs.near.org/api/rpc/contracts#call-a-contract-function](https://docs.near.org/api/rpc/contracts#call-a-contract-function)
 *
 * @param options Function call options.
 * @param options.contractId NEAR account where the contract is deployed
 * @param options.methodName The view-only method (no state mutations) name on the contract as it is written in the contract code
 * @param options.args Any arguments to the view contract method, wrapped in JSON
 * @param options.parse Parse the result of the call. Receives a Buffer (bytes array) and converts it to any object. By default result will be treated as json.
 * @param options.stringify Convert input arguments into a bytes array. By default the input is treated as a JSON.
 * @param options.blockQuery specifies which block to query state at. By default returns last "optimistic" block (i.e. not necessarily finalized).
 * @returns {Promise<any>}
 */
export async function viewFunction(
    connection: Connection,
    {
        contractId,
        methodName,
        args = {},
        parse = parseJsonFromRawResponse,
        stringify = bytesJsonStringify,
        blockQuery = { finality: 'optimistic' },
    }: ViewFunctionCallOptions,
): Promise<any> {
    const deprecate = depd('viewFunction()');
    deprecate('It will be removed in the next major release');

    validateArgs(args);

    const encodedArgs = stringify(args);

    const result = await connection.provider.query<CodeResult>({
        request_type: 'call_function',
        ...blockQuery,
        account_id: contractId,
        method_name: methodName,
        args_base64: encodedArgs.toString('base64'),
    });

    if (result.logs) {
        printTxOutcomeLogs({ contractId, logs: result.logs });
    }

    return (
        result.result &&
        result.result.length > 0 &&
        parse(new Uint8Array(result.result))
    );
}
