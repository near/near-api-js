import {
  AccessKeys,
  FullAccessKey,
  FunctionCallAccessKey,
  getAccessKey,
  getAccessKeys,
  getAccountState,
  getContractState,
  view,
  ViewAccessKeyParams,
  ViewAccountParams,
  ViewContractStateParams,
  ViewParams,
} from '@near-js/client';
import type { AccountView, SerializedReturnValue } from '@near-js/types';
import { buildRpcQueryHook } from './common';

export const useAccessKey = buildRpcQueryHook<ViewAccessKeyParams, FullAccessKey | FunctionCallAccessKey>(getAccessKey);
export const useAccessKeys = buildRpcQueryHook<ViewAccountParams, AccessKeys>(getAccessKeys);
export const useAccountState = buildRpcQueryHook<ViewAccountParams, AccountView>(getAccountState);
export const useContractCode = buildRpcQueryHook<ViewAccountParams, object>(getContractState);
export const useContractState = buildRpcQueryHook<ViewContractStateParams, object>(getContractState);
export const useView = buildRpcQueryHook<ViewParams, SerializedReturnValue>(view);
