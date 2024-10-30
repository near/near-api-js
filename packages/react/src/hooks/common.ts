import type { RpcProviderDependency, RpcQueryProvider, ViewAccessKeyParams, ViewAccountParams, ViewBaseParams } from '@near-js/client';
import { useContext, useEffect, useState } from 'react';

import { RpcContext } from '../context';
import { ViewContractStateParams } from '@near-js/client';
import { BlockReference, ChunkId, TxExecutionStatus } from '@near-js/types';

export function getRpcProvider({ deps }: Partial<RpcProviderDependency>): RpcQueryProvider {
  const rpcContext = useContext(RpcContext);
  return deps?.rpcProvider || rpcContext?.provider || null;
}

export interface ViewBlockParams extends RpcProviderDependency {
  blockReference: BlockReference;
}

export interface ViewChunkParams extends RpcProviderDependency {
  chunkId: ChunkId;
}

export interface ViewTransactionParams extends RpcProviderDependency {
  account: string;
  transactionHash: string;
  waitUntil: TxExecutionStatus;
}

type RpcViewParams = ViewBaseParams
  | ViewAccountParams
  | ViewAccessKeyParams
  | ViewContractStateParams
  | ViewBlockParams
  | ViewChunkParams;

export function buildRpcQueryHook<T extends RpcViewParams, U>(getter: (_: T) => Promise<U>): (params: T) => U {
  return function(args: T) {
    const { deps, ...queryParams } = args;
    const rpcProvider = getRpcProvider({ deps });
    const [value, setValue] = useState<U>(null);

    const dependencies = Object.entries(queryParams)
      .map(([k, v]) => k === 'blockReference' ? JSON.stringify(v || {}) : v);

    useEffect(() => {
      if (rpcProvider) {
        (async () => {
          setValue(await getter({ ...args, deps: { rpcProvider } }));
        })();
      }
    }, [rpcProvider, ...dependencies]);

    return value;
  }
}