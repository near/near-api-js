import { afterAll, beforeAll, describe, expect, jest, test } from 'bun:test';
import { getSandboxInfo, startSandbox, stopSandbox } from '@near-js/sandbox';
import type { AccountViewRaw, BlockReference } from '@near-js/types';
import { getTransactionLastResult } from '@near-js/utils';
import { TextEncoder } from 'util';
import { FailoverRpcProvider, JsonRpcProvider } from '../src/index.js';

jest.setTimeout(20000);
global.TextEncoder = TextEncoder;

['json provider', 'fallback provider'].forEach((name) => {
    describe(name, () => {
        let worker: Awaited<ReturnType<typeof getSandboxInfo>>;
        let provider: JsonRpcProvider | FailoverRpcProvider;

        beforeAll(async () => {
            await startSandbox();
            worker = await getSandboxInfo();

            if (name === 'json provider') {
                provider = new JsonRpcProvider({
                    url: worker.rpcUrl,
                });
            } else if (name === 'fallback provider') {
                provider = new FailoverRpcProvider([
                    new JsonRpcProvider({
                        url: worker.rpcUrl,
                    }),
                ]);
            }
            if (!provider) {
                throw new Error(`Unknown provider type: ${name}`);
            }

            await new Promise((resolve) => setTimeout(resolve, 2000));
        });

        afterAll(async () => {
            await stopSandbox();
        });

        test('rpc fetch node status', async () => {
            const response = await provider.status();
            expect(response.chain_id).toBeTruthy();
        });

        test('rpc fetch block info', async () => {
            const stat = await provider.status();
            const height = stat.sync_info.latest_block_height - 1;
            const response = await provider.block({ blockId: height });
            expect(response.header.height).toEqual(height);

            const sameBlock = await provider.block({
                blockId: response.header.hash,
            });
            expect(sameBlock.header.height).toEqual(height);

            const optimisticBlock = await provider.block({
                finality: 'optimistic',
            });
            expect(optimisticBlock.header.height - height).toBeLessThan(5);

            const nearFinalBlock = await provider.block({
                finality: 'near-final',
            });
            expect(nearFinalBlock.header.height - height).toBeLessThan(5);

            const finalBlock = await provider.block({ finality: 'final' });
            expect(finalBlock.header.height - height).toBeLessThan(5);
        });

        test('rpc fetch block changes', async () => {
            const stat = await provider.status();
            const height = stat.sync_info.latest_block_height - 1;
            const response = await provider.blockChanges({ blockId: height });

            expect(response).toMatchObject({
                block_hash: expect.any(String),
                changes: expect.arrayContaining([]),
            });
        });

        test('rpc fetch chunk info', async () => {
            const stat = await provider.status();
            const height = stat.sync_info.latest_block_height - 1;
            const response = await provider.chunk([height, 0]);
            expect(response.header.shard_id).toEqual(0);
            const sameChunk = await provider.chunk(response.header.chunk_hash);
            expect(sameChunk.header.chunk_hash).toEqual(
                response.header.chunk_hash,
            );
            expect(sameChunk.header.shard_id).toEqual(0);
        });

        test('rpc fetch validators info', async () => {
            const validators = await provider.validators(null);
            expect(validators.current_validators.length).toBeGreaterThanOrEqual(
                1,
            );
        });

        test('rpc query with block_id', async () => {
            const stat = await provider.status();
            const block_id = stat.sync_info.latest_block_height - 1;

            const response = await provider.query<AccountViewRaw>({
                block_id,
                request_type: 'view_account',
                account_id: 'test.near',
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
            const response = await provider.query<AccountViewRaw>({
                request_type: 'view_account',
                finality: 'final',
                account_id: 'test.near',
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
            const status = await provider.status();
            const blockHeight = status.sync_info.latest_block_height;
            const blockHash = status.sync_info.latest_block_hash;
            const blockReferences: Array<
                BlockReference | { sync_checkpoint: 'genesis' }
            > = [
                { sync_checkpoint: 'genesis' as const },
                { blockId: blockHeight },
                { blockId: blockHash },
                { finality: 'final' },
                { finality: 'optimistic' },
            ];
            for (const blockReference of blockReferences) {
                const response =
                    await provider.experimental_protocolConfig(blockReference);
                expect('chain_id' in response).toBe(true);
                expect('genesis_height' in response).toBe(true);
                expect('runtime_config' in response).toBe(true);
                expect(
                    'storage_amount_per_byte' in response.runtime_config,
                ).toBe(true);
            }
        });

        test('json rpc gas price', async () => {
            const status = await provider.status();
            const positiveIntegerRegex = /^[+]?\d+([.]\d+)?$/;

            const response1 = await provider.gasPrice(
                status.sync_info.latest_block_height,
            );
            expect(response1.gas_price).toMatch(positiveIntegerRegex);

            const response2 = await provider.gasPrice(
                status.sync_info.latest_block_hash,
            );
            expect(response2.gas_price).toMatch(positiveIntegerRegex);

            const response3 = await provider.gasPrice(null);
            expect(response3.gas_price).toMatch(positiveIntegerRegex);
        });

        test('near json rpc fetch node status', async () => {
            const response = await provider.status();
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
        const mockStatus1 = { chain_id: 'first' } as any;
        const mockStatus2 = { chain_id: 'second' } as any;

        const jsonProviders = [
            Object.setPrototypeOf(
                {
                    status() {
                        return mockStatus1;
                    },
                },
                JsonRpcProvider.prototype,
            ),
            Object.setPrototypeOf(
                {
                    status() {
                        return mockStatus2;
                    },
                },
                JsonRpcProvider.prototype,
            ),
        ];

        const provider = new FailoverRpcProvider(jsonProviders);

        expect(await provider.status()).toBe(mockStatus1);
    });

    test('FailoverRpc switches to next provider in case of error', async () => {
        const mockStatus = { chain_id: 'second' } as any;

        const jsonProviders = [
            Object.setPrototypeOf(
                {
                    status() {
                        throw new Error();
                    },
                },
                JsonRpcProvider.prototype,
            ),
            Object.setPrototypeOf(
                {
                    status() {
                        return mockStatus;
                    },
                },
                JsonRpcProvider.prototype,
            ),
        ];

        const provider = new FailoverRpcProvider(jsonProviders);

        expect(await provider.status()).toBe(mockStatus);
    });

    test('FailoverRpc returns error if all providers are unavailable', async () => {
        const jsonProviders = [
            Object.setPrototypeOf(
                {
                    status() {
                        throw new Error();
                    },
                },
                JsonRpcProvider.prototype,
            ),
            Object.setPrototypeOf(
                {
                    status() {
                        throw new Error();
                    },
                },
                JsonRpcProvider.prototype,
            ),
        ];

        const provider = new FailoverRpcProvider(jsonProviders);

        await expect(provider.status()).rejects.toThrow();
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

// TODO: Add helper that simulates time travel via sandbox snapshots
test('json rpc get next light client block', async () => {
    const provider = new JsonRpcProvider({
        url: 'https://rpc.testnet.near.org',
    });
    const stat = await provider.status();

    // Get block in at least the last epoch (epoch duration 43,200 blocks on mainnet and testnet)
    const height = stat.sync_info.latest_block_height;
    const protocolConfig = await provider.experimental_protocolConfig({
        finality: 'final',
    });

    // NOTE: This will underflow if the network used has not produced an epoch yet. If a new network
    // config is required, can retrieve a block a few height behind (1+buffer for indexing). If run
    // on a fresh network, would need to wait for blocks to be produced and indexed.
    // @ts-expect-error test input
    const prevEpochHeight = height - protocolConfig.epoch_length;
    const prevBlock = await provider.block({ blockId: prevEpochHeight });
    const nextBlock = await provider.nextLightClientBlock({
        last_block_hash: prevBlock.header.hash,
    });
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
