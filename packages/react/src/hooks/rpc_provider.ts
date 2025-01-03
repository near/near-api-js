import { getProviderByNetwork } from '@near-js/client';
import {
  BlockReference,
  BlockResult,
  ChunkResult,
  FinalExecutionOutcome,
} from '@near-js/types';
import {  useEffect, useState } from 'react';

import {
  buildRpcQueryHook,
  ViewBlockParams,
  ViewChunkParams,
  ViewTransactionParams,
} from './common';

const DEFAULT_FINALITY: BlockReference = { finality: 'optimistic' };

export function useRpcProviderByNetwork(network: string) {
  const [provider, setProvider] = useState(null);
  useEffect(() => {
    setProvider(getProviderByNetwork(network));
  }, [network]);
  return provider;
}

export const useBlock = buildRpcQueryHook<ViewBlockParams, BlockResult>(
  ({ blockReference, deps: { rpcProvider } }) => rpcProvider.block(blockReference || DEFAULT_FINALITY)
);
export const useChunk = buildRpcQueryHook<ViewChunkParams, ChunkResult>(
  ({ chunkId, deps: { rpcProvider } }) => rpcProvider.chunk(chunkId)
);
export const useTransaction = buildRpcQueryHook<ViewTransactionParams, FinalExecutionOutcome>(
  ({ transactionHash, account, waitUntil, deps: { rpcProvider } }) => rpcProvider.getTransaction({
    account,
    transactionHash,
    waitUntil,
  })
);
