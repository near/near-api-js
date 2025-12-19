import { Worker } from 'near-workspaces';
import { TextEncoder } from 'util';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { FailoverRpcProvider, getTransactionLastResult, JsonRpcProvider, type Provider } from '../../../src';

global.TextEncoder = TextEncoder;

['json provider', 'fallback provider'].forEach((name) => {
    describe(name, () => {
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
            expect(response.chainId).toBeTruthy();
        });

        test('rpc fetch block info', async () => {
            const stat = await provider.viewNodeStatus();
            const height = stat.syncInfo.latestBlockHeight - 1;
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
            const height = stat.syncInfo.latestBlockHeight - 1;
            const response = await provider.blockChanges({ blockId: height });

            expect(response).toMatchObject({
                blockHash: expect.any(String),
                changes: expect.arrayContaining([]),
            });
        });

        test('rpc fetch chunk info', async () => {
            const stat = await provider.viewNodeStatus();
            const height = stat.syncInfo.latestBlockHeight - 1;
            const response = await provider.viewChunk([height, 0]);
            expect(response.header.shardId).toEqual(0);
            const sameChunk = await provider.viewChunk(response.header.chunkHash);
            expect(sameChunk.header.chunkHash).toEqual(response.header.chunkHash);
            expect(sameChunk.header.shardId).toEqual(0);
        });

        test('rpc fetch validators info', async () => {
            const validators = await provider.viewValidators();
            expect(validators.currentValidators.length).toBeGreaterThanOrEqual(1);
        });

        test('rpc query with block_id', async () => {
            const stat = await provider.viewNodeStatus();
            const block_id = stat.syncInfo.latestBlockHeight - 1;

            const response = await provider.query({
                blockId: block_id,
                requestType: 'view_account',
                accountId: 'test.near',
            });

            expect(response).toEqual({
                blockHeight: expect.any(Number),
                blockHash: expect.any(String),
                amount: expect.any(String),
                locked: expect.any(String),
                codeHash: '11111111111111111111111111111111',
                storageUsage: 182,
                storagePaidAt: 0,
            });
        });

        test('rpc query view_account', async () => {
            const response = await provider.query({
                requestType: 'view_account',
                finality: 'final',
                accountId: 'test.near',
            });

            expect(response).toEqual({
                blockHeight: expect.any(Number),
                blockHash: expect.any(String),
                amount: expect.any(String),
                locked: expect.any(String),
                codeHash: '11111111111111111111111111111111',
                storageUsage: 182,
                storagePaidAt: 0,
            });
        });

        test('json rpc fetch protocol config', async () => {
            const status = await provider.viewNodeStatus();
            const blockHeight = status.syncInfo.latestBlockHeight;
            const blockHash = status.syncInfo.latestBlockHash;
            for (const blockReference of [
                { blockId: blockHeight },
                { blockId: blockHash },
                { finality: 'final' as const },
                { finality: 'optimistic' as const },
            ]) {
                const response = await provider.experimental_protocolConfig(blockReference);
                expect('chainId' in response).toBe(true);
                expect('genesisHeight' in response).toBe(true);
                expect('runtimeConfig' in response).toBe(true);
                expect('storageAmountPerByte' in response.runtimeConfig!).toBe(true);
            }
        });

        test('json rpc gas price', async () => {
            const status = await provider.viewNodeStatus();
            const positiveIntegerRegex = /^[+]?\d+([.]\d+)?$/;

            const response1 = await provider.viewGasPrice(status.syncInfo.latestBlockHeight);
            expect(response1.gasPrice).toMatch(positiveIntegerRegex);

            const response2 = await provider.viewGasPrice(status.syncInfo.latestBlockHash);
            expect(response2.gasPrice).toMatch(positiveIntegerRegex);

            const response3 = await provider.viewGasPrice();
            expect(response3.gasPrice).toMatch(positiveIntegerRegex);
        });

        test('near json rpc fetch node status', async () => {
            const response = await provider.viewNodeStatus();
            expect(response.chainId).toBeTruthy();
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
    test('FailoverRpc throws error on empty list of providers in constructor', async () => {
        expect(() => new FailoverRpcProvider([])).toThrow();
    });

    test('FailoverRpc uses first provider as default', async () => {
        const jsonProviders = [
            Object.setPrototypeOf(
                {
                    viewNodeStatus() {
                        return 'first';
                    },
                },
                JsonRpcProvider.prototype
            ),
            Object.setPrototypeOf(
                {
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
                    viewNodeStatus() {
                        throw new Error();
                    },
                },
                JsonRpcProvider.prototype
            ),
            Object.setPrototypeOf(
                {
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
                    status() {
                        throw new Error();
                    },
                },
                JsonRpcProvider.prototype
            ),
            Object.setPrototypeOf(
                {
                    status() {
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
test('json rpc get next light client block', async () => {
    const provider = new JsonRpcProvider({ url: 'https://rpc.testnet.near.org' });
    const stat = await provider.viewNodeStatus();

    // Get block in at least the last epoch (epoch duration 43,200 blocks on mainnet and testnet)
    const height = stat.syncInfo.latestBlockHeight;
    const protocolConfig = await provider.experimental_protocolConfig({ finality: 'final' });

    // NOTE: This will underflow if the network used has not produced an epoch yet. If a new network
    // config is required, can retrieve a block a few height behind (1+buffer for indexing). If run
    // on a fresh network, would need to wait for blocks to be produced and indexed.
    // @ts-expect-error test input
    const prevEpochHeight = height - protocolConfig.epochLength;
    const prevBlock = await provider.viewBlock({ blockId: prevEpochHeight });
    const nextBlock = await provider.nextLightClientBlock({ lastBlockHash: prevBlock.header.hash });
    expect('innerLite' in nextBlock).toBeTruthy();
    // Verify that requesting from previous epoch includes the set of new block producers.
    expect('nextBps' in nextBlock).toBeTruthy();

    // Greater than or equal check because a block could have been produced during the test.
    // There is a buffer of 10 given to the height, because this seems to be lagging behind the
    // latest finalized block by a few seconds. This delay might just be due to slow or delayed
    // indexing in a node's db. If this fails in the future, we can increase the buffer.
    expect(nextBlock.innerLite!.height).toBeGreaterThanOrEqual(height - 10);
    expect(nextBlock.innerLite!.height).toBeGreaterThan(prevEpochHeight);
    expect('prevBlockHash' in nextBlock).toBeTruthy();
    expect('nextBlockInnerHash' in nextBlock).toBeTruthy();
    expect('innerRestHash' in nextBlock).toBeTruthy();
    expect('approvalsAfterNext' in nextBlock).toBeTruthy();
});
