import { FailoverRpcProvider, JsonRpcProvider } from '@near-js/providers';
import type { Finality } from '@near-js/types';

import type { ViewBaseParams } from './interfaces';
import { PAGODA_RPC_ENDPOINTS_MAINNET, PAGODA_RPC_ENDPOINTS_TESTNET } from './constants';

interface DefaultFinality {
  defaultFinality?: Finality;
}

export function getBlock({ blockReference, defaultFinality, deps: { rpcProvider } }: ViewBaseParams & DefaultFinality) {
  if (!blockReference && !defaultFinality) {
    return Promise.resolve(null);
  }

  return rpcProvider.block(
    blockReference || { finality: defaultFinality! }
  );
}

export function getEndpointsByNetwork(network: string) {
  switch (network) {
    case 'testnet':
      return PAGODA_RPC_ENDPOINTS_TESTNET;
    case 'mainnet':
      return PAGODA_RPC_ENDPOINTS_MAINNET;
    default:
      return null;
  }
}

export function getFailoverRpcProvider(urls: string[]) {
  if (!urls) {
    throw new Error('at least one RPC endpoint URL required');
  }

  return new FailoverRpcProvider(urls.map((url) => new JsonRpcProvider({ url })));
}

export function getProviderByNetwork(network: string) {
  return getFailoverRpcProvider(getEndpointsByNetwork(network));
}

export function getProviderByEndpoints(...urls: string[]) {
  return getFailoverRpcProvider(urls);
}

export function getTestnetRpcProvider() {
  return getProviderByNetwork('testnet');
}

export function getMainnetRpcProvider() {
  return getProviderByNetwork('mainnet');
}
