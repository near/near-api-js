import type { BlockReference } from '@near-js/types';

import type { RpcProviderDependency } from './dependencies.js';

export interface RpcProviderQueryParams {
    blockReference?: BlockReference;
}

export interface ViewBaseParams
    extends RpcProviderDependency,
        RpcProviderQueryParams {}

export interface ViewAccountParams extends ViewBaseParams {
    account: string;
}

export interface ViewValidatorStakeParams extends ViewAccountParams {
    validator: string;
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

interface AccessKey {
    nonce: bigint;
    publicKey: string;
}

export interface FullAccessKey extends AccessKey {}
export interface FunctionCallAccessKey extends AccessKey {
    contract: string;
    methods: string[];
    allowance: bigint;
}

export interface AccessKeys {
    fullAccessKeys: FullAccessKey[];
    functionCallAccessKeys: FunctionCallAccessKey[];
}

export interface AccountState {
    availableBalance: bigint;
    codeHash: string;
    locked: bigint;
    storageUsed: bigint;
}
