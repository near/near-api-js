import { afterAll, beforeAll, describe, expect, vi, test } from 'vitest';
import { Worker } from 'near-workspaces';
import { TextEncoder } from 'util';
import { FailoverRpcProvider, JsonRpcProvider, Provider, getTransactionLastResult } from '../../src';

global.TextEncoder = TextEncoder;

['json provider', 'fallback provider'].forEach((name) => {
    describe.skip(name, () => {
        let worker: Worker;
        let provider: Provider;

        beforeAll(async () => {
            worker = await Worker.init();
            // @ts-expect-error accessing protected property
            const url = worker.manager.config.rpcAddr as string;

            if (name === 'json provider') {
                provider = new JsonRpcProvider({
                    url,
                });
            } else if (name === 'fallback provider') {
                provider = new FailoverRpcProvider([
                    new JsonRpcProvider({
                        url,
                    }),
                ]);
            }

            await new Promise((resolve) => setTimeout(resolve, 2000));
        });

        afterAll(async () => {
            await worker.tearDown();
        });

        test('rpc fetch node status', async () => {
            const response = await provider.viewNodeStatus();
            expect(response.chain_id).toBeTruthy();
        });
        
        test('rpc fetch block info', async () => {
            const stat = await provider.viewNodeStatus();
            const height = stat.sync_info.latest_block_height - 1;
            const response = await provider.viewBlock({ blockId: height });
            expect(response.header.height).toEqual(height);
        
            const sameBlock = await provider.viewBlock({ blockId: response.header.hash });
            expect(sameBlock.header.height).toEqual(height);
        
            const optimisticBlock = await provider.viewBlock({ finality: 'optimistic' });
            expect(optimisticBlock.header.height - height).toBeLessThan(5);
        
            const nearFinalBlock = await provider.viewBlock({ finality: 'near-final' });
            expect(nearFinalBlock.header.height - height).toBeLessThan(5);
        
            const finalBlock = await provider.viewBlock({ finality: 'final' });
            expect(finalBlock.header.height - height).toBeLessThan(5);
        });
        
        test('rpc fetch block changes', async () => {
            const stat = await provider.viewNodeStatus();
            const height = stat.sync_info.latest_block_height - 1;
            const response = await provider.blockChanges({ blockId: height });
        
            expect(response).toMatchObject({
                block_hash: expect.any(String),
                changes: expect.arrayContaining([])
            });
        });
        
        test('rpc fetch chunk info', async () => {
            const stat = await provider.viewNodeStatus();
            const height = stat.sync_info.latest_block_height - 1;
            const response = await provider.viewChunk([height, 0]);
            expect(response.header.shard_id).toEqual(0);
            const sameChunk = await provider.viewChunk(response.header.chunk_hash);
            expect(sameChunk.header.chunk_hash).toEqual(response.header.chunk_hash);
            expect(sameChunk.header.shard_id).toEqual(0);
        });
        
        test('rpc fetch validators info', async () => {
            const validators = await provider.viewValidatorsV2(null);
            expect(validators.current_validators.length).toBeGreaterThanOrEqual(1);
        });
        
        test('rpc query with block_id', async () => {
            const stat = await provider.viewNodeStatus();
            const block_id = stat.sync_info.latest_block_height - 1;
        
            const response = await provider.query({
                blockId: block_id,
                request_type: 'view_account',
                account_id: 'test.near'
            });
        
            expect(response).toEqual({
                block_height: expect.any(Number),
                block_hash: expect.any(String),
                amount: expect.any(String),
                locked: expect.any(String),
                code_hash: '11111111111111111111111111111111',
                storage_usage: 182,
                storage_paid_at: 0,
            });
        });
        
        test('rpc query view_account', async () => {
            const response = await provider.query({
                request_type: 'view_account',
                finality: 'final',
                account_id: 'test.near'
            });
        
            expect(response).toEqual({
                block_height: expect.any(Number),
                block_hash: expect.any(String),
                amount: expect.any(String),
                locked: expect.any(String),
                code_hash: '11111111111111111111111111111111',
                storage_usage: 182,
                storage_paid_at: 0,
            });
        });
        
        test('json rpc fetch protocol config', async () => {
            const status = await provider.viewNodeStatus();
            const blockHeight = status.sync_info.latest_block_height;
            const blockHash = status.sync_info.latest_block_hash;
            for (const blockReference of [{ blockId: blockHeight }, { blockId: blockHash }, { finality: 'final' as const }, { finality: 'optimistic' as const }]) {
                const response = await provider.experimental_protocolConfig(blockReference);
                expect('chain_id' in response).toBe(true);
                expect('genesis_height' in response).toBe(true);
                expect('runtime_config' in response).toBe(true);
                expect('storage_amount_per_byte' in response.runtime_config).toBe(true);
            }
        });
        
        test('json rpc gas price', async () => {
            const status = await provider.viewNodeStatus();
            const positiveIntegerRegex = /^[+]?\d+([.]\d+)?$/;
        
            const response1 = await provider.viewGasPrice(status.sync_info.latest_block_height);
            expect(response1.gas_price).toMatch(positiveIntegerRegex);
        
            const response2 = await provider.viewGasPrice(status.sync_info.latest_block_hash);
            expect(response2.gas_price).toMatch(positiveIntegerRegex);
        
            const response3 = await provider.viewGasPrice();
            expect(response3.gas_price).toMatch(positiveIntegerRegex);
        });
        
        test('near json rpc fetch node status', async () => {
            const response = await provider.viewNodeStatus();
            expect(response.chain_id).toBeTruthy();
        });
    });
});

describe('json provider', () => {
    test('JsonRpc connection object exist without connectionInfo provided', async () => {
        // @ts-expect-error test input
        const provider = new JsonRpcProvider();
        expect(provider.connection).toStrictEqual({ url: '' });
    });
});

describe('failover provider', () => {
    beforeAll(async () => {});

    test('FailoverRpc throws error on empty list of providers in constructor', async () => {
        expect(() => new FailoverRpcProvider([])).toThrow();
    });

    test('FailoverRpc uses first provider as default', async () => {
        const jsonProviders = [
            Object.setPrototypeOf(
                {
                    connection: { url: 'test' },
                    viewNodeStatus() {
                        return 'first';
                    },
                },
                JsonRpcProvider.prototype
            ),
            Object.setPrototypeOf(
                {
                    connection: { url: 'test' },
                    viewNodeStatus() {
                        return 'second';
                    },
                },
                JsonRpcProvider.prototype
            ),
        ];

        const provider = new FailoverRpcProvider(jsonProviders);

        expect(await provider.viewNodeStatus()).toBe('first');
    });

    test('FailoverRpc switches to next provider in case of error', async () => {
        const jsonProviders = [
            Object.setPrototypeOf(
                {
                    connection: { url: 'test' },
                    viewNodeStatus() {
                        throw new Error();
                    },
                },
                JsonRpcProvider.prototype
            ),
            Object.setPrototypeOf(
                {
                    connection: { url: 'test' },
                    viewNodeStatus() {
                        return 'second';
                    },
                },
                JsonRpcProvider.prototype
            ),
        ];

        const provider = new FailoverRpcProvider(jsonProviders);

        expect(await provider.viewNodeStatus()).toBe('second');
    });

    test('FailoverRpc returns error if all providers are unavailable', async () => {
        const jsonProviders = [
            Object.setPrototypeOf(
                {
                    connection: { url: 'test' },
                    status() {
                        throw new Error();
                    },
                    viewNodeStatus() {
                        throw new Error();
                    },
                },
                JsonRpcProvider.prototype
            ),
            Object.setPrototypeOf(
                {
                    connection: { url: 'test' },
                    status() {
                        throw new Error();
                    },
                    viewNodeStatus() {
                        throw new Error();
                    },
                },
                JsonRpcProvider.prototype
            ),
        ];

        const provider = new FailoverRpcProvider(jsonProviders);

        await expect(() => provider.viewNodeStatus()).rejects.toThrow();
    });
});

test('final tx result', async () => {
    const result = {
        status: { SuccessValue: 'e30=' },
        transaction: {
            id: '11111',
            outcome: {
                status: { SuccessReceiptId: '11112' },
                logs: [],
                receipt_ids: ['11112'],
                gas_burnt: 1,
            },
        },
        receipts: [
            {
                id: '11112',
                outcome: {
                    status: { SuccessValue: 'e30=' },
                    logs: [],
                    receipt_ids: ['11112'],
                    gas_burnt: 9001,
                },
            },
            {
                id: '11113',
                outcome: {
                    status: { SuccessValue: '' },
                    logs: [],
                    receipt_ids: [],
                    gas_burnt: 0,
                },
            },
        ],
    };
    // @ts-expect-error test input
    expect(getTransactionLastResult(result)).toEqual({});
});

test('final tx result with null', async () => {
    const result = {
        status: 'Failure',
        transaction: {
            id: '11111',
            outcome: {
                status: { SuccessReceiptId: '11112' },
                logs: [],
                receipt_ids: ['11112'],
                gas_burnt: 1,
            },
        },
        receipts: [
            {
                id: '11112',
                outcome: {
                    status: 'Failure',
                    logs: [],
                    receipt_ids: ['11112'],
                    gas_burnt: 9001,
                },
            },
            {
                id: '11113',
                outcome: {
                    status: { SuccessValue: '' },
                    logs: [],
                    receipt_ids: [],
                    gas_burnt: 0,
                },
            },
        ],
    };
    // @ts-expect-error test input
    expect(getTransactionLastResult(result)).toEqual(null);
});

// TODO: Use a near-workspaces Worker when time traveling is available
test.skip('json rpc get next light client block', async () => {
    const provider = new JsonRpcProvider({ url: 'https://rpc.testnet.near.org' });
    const stat = await provider.viewNodeStatus();

    // Get block in at least the last epoch (epoch duration 43,200 blocks on mainnet and testnet)
    const height = stat.sync_info.latest_block_height;
    const protocolConfig = await provider.experimental_protocolConfig({ finality: 'final' });

    // NOTE: This will underflow if the network used has not produced an epoch yet. If a new network
    // config is required, can retrieve a block a few height behind (1+buffer for indexing). If run
    // on a fresh network, would need to wait for blocks to be produced and indexed.
    // @ts-expect-error test input
    const prevEpochHeight = height - protocolConfig.epoch_length;
    const prevBlock = await provider.viewBlock({ blockId: prevEpochHeight });
    const nextBlock = await provider.nextLightClientBlock({ last_block_hash: prevBlock.header.hash });
    expect('inner_lite' in nextBlock).toBeTruthy();
    // Verify that requesting from previous epoch includes the set of new block producers.
    expect('next_bps' in nextBlock).toBeTruthy();

    // Greater than or equal check because a block could have been produced during the test.
    // There is a buffer of 10 given to the height, because this seems to be lagging behind the
    // latest finalized block by a few seconds. This delay might just be due to slow or delayed
    // indexing in a node's db. If this fails in the future, we can increase the buffer.
    expect(nextBlock.inner_lite.height).toBeGreaterThanOrEqual(height - 10);
    expect(nextBlock.inner_lite.height).toBeGreaterThan(prevEpochHeight);
    expect('prev_block_hash' in nextBlock).toBeTruthy();
    expect('next_block_inner_hash' in nextBlock).toBeTruthy();
    expect('inner_rest_hash' in nextBlock).toBeTruthy();
    expect('approvals_after_next' in nextBlock).toBeTruthy();
});