import { FailoverRpcProvider, JsonRpcProvider } from '@near-js/providers';

import type { RpcQueryProvider } from './interfaces';
import {
    PAGODA_RPC_ARCHIVAL_ENDPOINTS_TESTNET,
    PAGODA_RPC_ENDPOINTS_MAINNET,
    PAGODA_RPC_ENDPOINTS_TESTNET,
} from './constants';

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
export function createRpcClientWrapper(urls: string[]): RpcQueryProvider {
    if (!urls) {
        throw new Error('at least one RPC endpoint URL required');
    }

    const provider = new FailoverRpcProvider(urls.map((url) => new JsonRpcProvider({ url })));
    return {
        block: (block) => provider.block(block),
        chunk: (chunkId) => provider.chunk(chunkId),
        getTransaction: ({ transactionHash, account, includeReceipts, waitUntil }) => {
            if (includeReceipts) {
                return provider.txStatusReceipts(transactionHash, account, waitUntil);
            }
            return provider.txStatus(transactionHash, account, waitUntil);
        },
        sendTransaction: (transaction) => provider.sendTransaction(transaction),
        query: (params) => provider.query(params),
    };
}

/**
 * Initialize a failover RPC provider for the given network
 * @param network target blockchain network (e.g. `mainnet`)
 */
export function getProviderByNetwork(network: string) {
    return createRpcClientWrapper(getEndpointsByNetwork(network));
}

/**
 * Initialize a failover RPC provider for a set of RPC endpoint URLs
 * @param urls RPC endpoint URLs
 */
export function getProviderByEndpoints(...urls: string[]) {
    return createRpcClientWrapper(urls);
}

/**
 * Initialize a testnet RPC provider
 */
export function getTestnetRpcProvider() {
    return getProviderByNetwork('testnet');
}

/**
 * Initialize a testnet archival RPC provider
 */
export function getTestnetRpcArchivalProvider() {
    return createRpcClientWrapper(PAGODA_RPC_ARCHIVAL_ENDPOINTS_TESTNET);
}

/**
 * Initialize a mainnet RPC provider
 */
export function getMainnetRpcProvider() {
    return getProviderByNetwork('mainnet');
}
