import type { AccountView, CodeResult, QueryResponseKind } from '@near-js/types';

import type {
  Dependent,
  RpcProviderDependency,
  RpcProviderQueryParams,
  ViewAccessKeyParams,
  ViewAccountParams,
  ViewContractStateParams,
  ViewParams,
} from './interfaces';
import { AccessKeyList, AccessKeyView, ViewStateResult } from '@near-js/types';

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
  args?: any;
}

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

export async function view({ account, method, args = {}, blockReference, deps }: ViewParams) {
  const { result } = await callViewMethod({ account, method, args, blockReference, deps });
  const stringResult = Buffer.from(result).toString();
  try {
    return JSON.parse(stringResult);
  } catch {
    return isNaN(+stringResult) ? stringResult : +stringResult;
  }
}

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

export function getAccountState({ account, blockReference, deps }: ViewAccountParams) {
  return query<AccountView>({
    request: RequestType.ViewAccount,
    account,
    blockReference,
    deps,
  });
}

export function getAccessKeys({ account, blockReference, deps }: ViewAccountParams) {
  return query<AccessKeyList>({
    request: RequestType.ViewAccessKeyList,
    account,
    blockReference,
    deps,
  });
}

export function getContractCode({ account, blockReference, deps }: ViewAccountParams) {
  return query<ViewStateResult>({
    request: RequestType.ViewCode,
    account,
    blockReference,
    deps,
  });
}

export function getContractState({ account, prefix, blockReference, deps }: ViewContractStateParams) {
  return query<ViewStateResult>({
    request: RequestType.ViewState,
    account,
    args: {
      prefix_base64: Buffer.from(prefix).toString('base64'),
    },
    blockReference,
    deps,
  });
}

export async function getNonce({ account, publicKey, blockReference, deps }: ViewAccessKeyParams) {
  const { nonce } = await getAccessKey({
    account,
    publicKey,
    blockReference,
    deps,
  });

  return nonce;
}
