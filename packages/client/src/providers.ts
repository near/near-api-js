import { FailoverRpcProvider, JsonRpcProvider } from '@near-js/providers';
import type { Finality } from '@near-js/types';

import type { ViewBaseParams } from './interfaces';
import { PAGODA_RPC_ENDPOINTS_MAINNET, PAGODA_RPC_ENDPOINTS_TESTNET } from './constants';

interface DefaultFinality {
  defaultFinality?: Finality;
}

/**
 * Query for a block
 * @param account target account/contract being queried
 * @param blockReference block ID/finality
 * @param defaultFinality finality value to fall back on when blockReference is not specified
 * @param rpcProvider RPC provider instance
 */
export function getBlock({ blockReference, defaultFinality, deps: { rpcProvider } }: ViewBaseParams & DefaultFinality) {
  if (!blockReference && !defaultFinality) {
    return Promise.resolve(null);
  }

  return rpcProvider.block(
    blockReference || { finality: defaultFinality! }
  );
}

/**
 * Get the set of public endpoints for the provided network
 * @param network target blockchain network (e.g. `mainnet`)
 */
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

/**
 * Initialize a failover RPC provider capable of retrying requests against a set of endpoints
 * @param urls RPC endpoint URLs
 */
export function getFailoverRpcProvider(urls: string[]) {
  if (!urls) {
    throw new Error('at least one RPC endpoint URL required');
  }

  return new FailoverRpcProvider(urls.map((url) => new JsonRpcProvider({ url })));
}

/**
 * Initialize a failover RPC provider for the given network
 * @param network target blockchain network (e.g. `mainnet`)
 */
export function getProviderByNetwork(network: string) {
  return getFailoverRpcProvider(getEndpointsByNetwork(network));
}

/**
 * Initialize a failover RPC provider for a set of RPC endpoint URLs
 * @param urls RPC endpoint URLs
 */
export function getProviderByEndpoints(...urls: string[]) {
  return getFailoverRpcProvider(urls);
}

/**
 * Initialize a testnet RPC provider
 */
export function getTestnetRpcProvider() {
  return getProviderByNetwork('testnet');
}

/**
 * Initialize a mainnet RPC provider
 */
export function getMainnetRpcProvider() {
  return getProviderByNetwork('mainnet');
}
