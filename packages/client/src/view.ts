import type {
  AccessKeyList,
  AccessKeyView,
  AccountView,
  CodeResult,
  ContractCodeView,
  QueryResponseKind,
  ViewStateResult,
} from '@near-js/types';

import type {
  Dependent,
  RpcProviderDependency,
  RpcProviderQueryParams,
  ViewAccessKeyParams,
  ViewAccountParams,
  ViewContractStateParams,
  ViewParams,
} from './interfaces';

const DEFAULT_VIEW_BLOCK_REFERENCE = { finality: 'optimistic' };

enum RequestType {
  CallFunction = 'call_function',
  ViewAccessKey = 'view_access_key',
  ViewAccessKeyList = 'view_access_key_list',
  ViewAccount = 'view_account',
  ViewCode = 'view_code',
  ViewState = 'view_state',
}

interface QueryParams extends Dependent<RpcProviderDependency>, RpcProviderQueryParams {
  account: string;
  request: string;
  args?: object;
}

/**
 * Make a readonly request to an RPC endpoint targeting a specific account/contract
 * @param account target account/contract being queried
 * @param request type of request (e.g. `call_function`)
 * @param args named arguments passed in the request body
 * @param blockReference block ID/finality
 * @param rpcProvider RPC provider instance
 */
export function query<T extends QueryResponseKind>({
  account,
  request,
  args = {},
  blockReference,
  deps: { rpcProvider },
}: QueryParams): Promise<T> {
  return rpcProvider.query<T>({
    request_type: request,
    account_id: account,
    ...(blockReference ? blockReference : DEFAULT_VIEW_BLOCK_REFERENCE),
    ...args,
  });
}

/**
 * Call a view method on an account/contract, returning the raw response
 * @param account target account/contract being queried
 * @param method name of the method being invoked
 * @param args named arguments passed in the request body
 * @param blockReference block ID/finality
 * @param deps readonly RPC dependencies
 */
export function callViewMethod({ account, method, args = {}, blockReference, deps }: ViewParams) {
  return query<CodeResult>({
    request: RequestType.CallFunction,
    account,
    args: {
      args_base64: Buffer.isBuffer(args) ? args : Buffer.from(JSON.stringify(args)).toString('base64'),
      method_name: method,
    },
    blockReference,
    deps,
  });
}

/**
 * Call a view method on an account/contract, parsing the returned data
 * NB if the data returned is a byte array, this method will convert it
 *  to string - use `await (viewRaw(...)).result` to get the buffer
 * @param account target account/contract being queried
 * @param method name of the method being invoked
 * @param args named arguments passed in the request body
 * @param blockReference block ID/finality
 * @param deps readonly RPC dependencies
 */
export async function view({ account, method, args = {}, blockReference, deps }: ViewParams): Promise<string | number | boolean | object> {
  const { result } = await callViewMethod({ account, method, args, blockReference, deps });
  const stringResult = Buffer.from(result).toString();
  try {
    return JSON.parse(stringResult);
  } catch {
    return isNaN(+stringResult) ? stringResult : +stringResult;
  }
}

/**
 * Get metadata for the specified access key
 * @param account target account/contract being queried
 * @param publicKey public key string to be queried
 * @param blockReference block ID/finality
 * @param deps readonly RPC dependencies
 */
export function getAccessKey({ account, publicKey, blockReference, deps }: ViewAccessKeyParams) {
  return query<AccessKeyView>({
    request: RequestType.ViewAccessKey,
    account,
    args: {
      publicKey,
    },
    blockReference,
    deps,
  });
}

/**
 * Get account metadata (e.g. balance, storage)
 * @param account target account/contract being queried
 * @param blockReference block ID/finality
 * @param deps readonly RPC dependencies
 */
export function getAccountState({ account, blockReference, deps }: ViewAccountParams) {
  return query<AccountView>({
    request: RequestType.ViewAccount,
    account,
    blockReference,
    deps,
  });
}

/**
 * Get list of access keys for the specified account/contract
 * @param account target account/contract being queried
 * @param blockReference block ID/finality
 * @param deps readonly RPC dependencies
 */
export function getAccessKeys({ account, blockReference, deps }: ViewAccountParams) {
  return query<AccessKeyList>({
    request: RequestType.ViewAccessKeyList,
    account,
    blockReference,
    deps,
  });
}

/**
 * Get the code for the contract deployed to the target account
 * @param account target account/contract being queried
 * @param blockReference block ID/finality
 * @param deps readonly RPC dependencies
 */
export async function getContractCode({ account, blockReference, deps }: ViewAccountParams) {
  const { code_base64, hash } = await query<ContractCodeView>({
    request: RequestType.ViewCode,
    account,
    blockReference,
    deps,
  });

  return { code: Buffer.from(code_base64, 'base64').toString(), code_base64, hash };
}

/**
 * Get the state on the contract deployed to the target account in key-value pairs
 * @param account target account/contract being queried
 * @param prefix target prefix filter (empty string/buffer returns all keys)
 * @param blockReference block ID/finality
 * @param deps readonly RPC dependencies
 * @returns object key-value pairs
 */
export async function getContractState({ account, prefix, blockReference, deps }: ViewContractStateParams) {
  const { values } = await query<ViewStateResult>({
    request: RequestType.ViewState,
    account,
    args: {
      prefix_base64: Buffer.from(prefix).toString('base64'),
    },
    blockReference,
    deps,
  });

  return values.reduce((state, { key, value }) => ({
    ...state,
    [key]: value,
  }), {});
}

/**
 * Get the nonce for the specified access key
 * @param account target account/contract being queried
 * @param publicKey public key string to be queried
 * @param blockReference block ID/finality
 * @param deps readonly RPC dependencies
 */
export async function getNonce({ account, publicKey, blockReference, deps }: ViewAccessKeyParams) {
  const { nonce } = await getAccessKey({
    account,
    publicKey,
    blockReference,
    deps,
  });

  return nonce;
}
