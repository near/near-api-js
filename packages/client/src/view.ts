import type { AccountView, BlockReference, CodeResult, QueryResponseKind } from '@near-js/types';

import type {
  RpcQueryProvider,
  ViewAccessKeyParams,
  ViewAccountParams,
  ViewContractStateParams,
  ViewParams,
} from './interfaces';
import { AccessKeyList, AccessKeyView, ViewStateResult } from '@near-js/types';

const DEFAULT_VIEW_BLOCK_REFERENCE = { finality: 'optimistic' };

interface QueryParams {
  account: string;
  rpcProvider: RpcQueryProvider;
  request: string;
  args?: any;
  blockReference?: BlockReference;
}

export function query<T extends QueryResponseKind>({
  rpcProvider,
  account,
  request,
  args = {},
  blockReference,
}: QueryParams): Promise<T> {
  return rpcProvider.query<T>({
    request_type: request,
    account_id: account,
    ...(blockReference ? blockReference : DEFAULT_VIEW_BLOCK_REFERENCE),
    ...args,
  });
}

export function callViewMethod({ account, method, args = {}, blockReference, deps: { rpcProvider } }: ViewParams) {
  return query<CodeResult>({
    request: 'call_function',
    rpcProvider,
    account,
    args: {
      args_base64: Buffer.isBuffer(args) ? args : Buffer.from(JSON.stringify(args)).toString('base64'),
      method_name: method,
    },
    blockReference,
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

export function getAccessKey({ account, publicKey, blockReference, deps: { rpcProvider } }: ViewAccessKeyParams) {
  return query<AccessKeyView>({
    request: 'view_access_key',
    rpcProvider,
    account,
    args: {
      publicKey,
    },
    blockReference,
  });
}

export function getAccountState({ account, blockReference, deps: { rpcProvider } }: ViewAccountParams) {
  return query<AccountView>({
    request: 'view_account',
    rpcProvider,
    account,
    blockReference,
  });
}

export function getAccessKeys({ account, blockReference, deps: { rpcProvider } }: ViewAccountParams) {
  return query<AccessKeyList>({
    request: 'view_access_key_list',
    rpcProvider,
    account,
    blockReference,
  });
}

export function getContractCode({ account, blockReference, deps: { rpcProvider } }: ViewAccountParams) {
  return query<ViewStateResult>({
    request: 'view_code',
    rpcProvider,
    account,
    blockReference,
  });
}

export function getContractState({ account, prefix, blockReference, deps: { rpcProvider }}: ViewContractStateParams) {
  return query<ViewStateResult>({
    request: 'view_state',
    rpcProvider,
    account,
    args: {
      prefix_base64: Buffer.from(prefix).toString('base64'),
    },
    blockReference,
  });
}

export async function getNonce({ account, publicKey, blockReference, deps: { rpcProvider } }: ViewAccessKeyParams) {
  const { nonce } = await getAccessKey({
    account,
    publicKey,
    blockReference,
    deps: { rpcProvider },
  });

  return nonce;
}
