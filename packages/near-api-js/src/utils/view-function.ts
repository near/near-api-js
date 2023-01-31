import { BlockReference, CodeResult } from '../providers/provider';
import { printTxOutcomeLogs } from './logging';
import { FunctionCallOptions } from '../account';
import { Connection } from '../connection';

function parseJsonFromRawResponse(response: Uint8Array): any {
    return JSON.parse(Buffer.from(response).toString());
}

function bytesJsonStringify(input: any): Buffer {
    return Buffer.from(JSON.stringify(input));
}

export interface ViewFunctionCallOptions extends FunctionCallOptions {
    connection: Connection;
    parse?: (response: Uint8Array) => any;
    blockQuery?: BlockReference;
}

// TBD fix params
/**
 * Invoke a contract view function using the RPC API.
 * @see [https://docs.near.org/api/rpc/contracts#call-a-contract-function](https://docs.near.org/api/rpc/contracts#call-a-contract-function)
 *
 * @param viewFunctionCallOptions.contractId NEAR account where the contract is deployed
 * @param viewFunctionCallOptions.methodName The view-only method (no state mutations) name on the contract as it is written in the contract code
 * @param viewFunctionCallOptions.args Any arguments to the view contract method, wrapped in JSON
 * @param viewFunctionCallOptions.parse Parse the result of the call. Receives a Buffer (bytes array) and converts it to any object. By default result will be treated as json.
 * @param viewFunctionCallOptions.stringify Convert input arguments into a bytes array. By default the input is treated as a JSON.
 * @param viewFunctionCallOptions.jsContract Is contract from JS SDK, automatically encodes args from JS SDK to binary.
 * @param viewFunctionCallOptions.blockQuery specifies which block to query state at. By default returns last "optimistic" block (i.e. not necessarily finalized).
 * @returns {Promise<any>}
 */
export async function viewFunction({
    connection,
    contractId,
    methodName,
    args = {},
    parse = parseJsonFromRawResponse,
    stringify = bytesJsonStringify,
    jsContract = false,
    blockQuery = { finality: 'optimistic' }
}: ViewFunctionCallOptions): Promise<any> {
    let encodedArgs;

    this.validateArgs(args);

    if(jsContract){
        encodedArgs = this.encodeJSContractArgs(contractId, methodName, Object.keys(args).length >  0 ? JSON.stringify(args): '');
    } else{
        encodedArgs =  stringify(args);
    }

    const result = await connection.provider.query<CodeResult>({
        request_type: 'call_function',
        ...blockQuery,
        account_id: jsContract ? this.connection.jsvmAccountId : contractId,
        method_name: jsContract ? 'view_js_contract'  : methodName,
        args_base64: encodedArgs.toString('base64')
    });

    if (result.logs) {
        printTxOutcomeLogs({ contractId, logs: result.logs });
    }

    return result.result && result.result.length > 0 && parse(Buffer.from(result.result));
}