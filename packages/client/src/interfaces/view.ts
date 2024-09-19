import type { BlockReference } from '@near-js/types';

import { RpcProviderDependency } from './dependencies';

export interface RpcProviderQueryParams {
  blockReference?: BlockReference;
}

export interface ViewBaseParams extends RpcProviderDependency, RpcProviderQueryParams {
}

export interface ViewAccountParams extends ViewBaseParams {
  account: string;
}

export interface ViewParams<T = object> extends ViewAccountParams {
  method: string;
  args?: T;
}

export interface ViewContractStateParams extends ViewAccountParams {
  prefix: string | Uint8Array;
}

export interface ViewAccessKeyParams extends ViewAccountParams {
  publicKey: string;
}
