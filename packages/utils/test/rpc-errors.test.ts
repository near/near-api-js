import { describe, expect, test } from '@jest/globals';

import { formatError, getErrorTypeFromErrorMessage, parseRpcError, ServerError } from '../src';

describe('rpc-errors', () => {
    test('test AccountAlreadyExists error', async () => {
        const rpc_error = {
            TxExecutionError: {
                ActionError: {
                    index: 1,
                    kind: { AccountAlreadyExists: { account_id: 'bob.near' } }
                }
            }
        };
        const error = parseRpcError(rpc_error);
        expect(error.type === 'AccountAlreadyExists').toBe(true);
        // @ts-expect-error test input
        expect(error.index).toBe(1);
        // @ts-expect-error test input
        expect(error.account_id).toBe('bob.near');
        expect(formatError(error.type, error)).toBe('Can\'t create a new account bob.near, because it already exists');
    });

    test('test ReceiverMismatch error', async () => {
        const rpc_error = {
            TxExecutionError: {
                InvalidTxError: {
                    InvalidAccessKeyError: {
                        ReceiverMismatch: {
                            ak_receiver: 'test.near',
                            tx_receiver: 'bob.near'
                        }
                    }
                }
            }
        };
        const error = parseRpcError(rpc_error);
        expect(error.type === 'ReceiverMismatch').toBe(true);
        // @ts-expect-error test input
        expect(error.ak_receiver).toBe('test.near');
        // @ts-expect-error test input
        expect(error.tx_receiver).toBe('bob.near');
        expect(formatError(error.type, error)).toBe(
            'Wrong AccessKey used for transaction: transaction is sent to receiver_id=bob.near, but is signed with function call access key that restricted to only use with receiver_id=test.near. Either change receiver_id in your transaction or switch to use a FullAccessKey.'
        );
    });

    test('test ShardCongested error', async () => {
        const rpc_error = {
            TxExecutionError: {
                InvalidTxError: {
                    ShardCongested: {
                        shard_id: 2,
                        congestion_level: 0.4
                    }
                }
            }
        };
        const error: any = parseRpcError(rpc_error);
        expect(error.type === 'ShardCongested').toBe(true);
        expect(error.shard_id).toBe(2);
        expect(error.congestion_level).toBe(0.4);
        expect(formatError(error.type, error)).toBe(
            'Shard 2 rejected the transaction due to congestion level 0.4, try again later'
        );
    });

    test('test ShardStuck error', async () => {
        const rpc_error = {
            TxExecutionError: {
                InvalidTxError: {
                    ShardStuck: {
                        shard_id: 2,
                        missed_chunks: 5
                    }
                }
            }
        };
        const error: any = parseRpcError(rpc_error);
        expect(error.type === 'ShardStuck').toBe(true);
        expect(error.shard_id).toBe(2);
        expect(error.missed_chunks).toBe(5);
        expect(formatError(error.type, error)).toBe(
            'Shard 2 rejected the transaction because it missed 5 chunks and needs to recover before accepting new transactions, try again later'
        );
    });

    test('test ReceiptSizeExceeded error', async () => {
        const rpc_error = {
            TxExecutionError: {
                InvalidTxError: {
                    ReceiptValidationError: {
                        ReceiptSizeExceeded: {
                            limit: 100,
                            size: 101
                        }
                    }
                }
            }
        };
        const error: any = parseRpcError(rpc_error);
        expect(error.type === 'ReceiptSizeExceeded').toBe(true);
        expect(error.limit).toBe(100);
        expect(error.size).toBe(101);
        expect(formatError(error.type, error)).toBe(
            '{"type":"ReceiptSizeExceeded","limit":100,"size":101,"kind":{"limit":100,"size":101}}'
        );
    });

    test('test InvalidIteratorIndex error', async () => {
        const rpc_error = {
            TxExecutionError: {
                ActionError: {
                    FunctionCallError: {
                        HostError: {
                            InvalidIteratorIndex: { iterator_index: 42 }
                        }
                    }
                }
            }
        };
        const error = parseRpcError(rpc_error);
        expect(error.type).toBe('ActionError');
        expect(formatError(error.type, error)).toBe('{"type":"ActionError","kind":{"FunctionCallError":{"HostError":{"InvalidIteratorIndex":{"iterator_index":42}}}}}');
    });

    test('test ActionError::FunctionCallError::GasLimitExceeded error', async () => {
        const rpc_error = {
            ActionError: {
                'index': 0,
                'kind': {
                    FunctionCallError: {
                        'HostError': 'GasLimitExceeded'
                    }
                }
            }
        };
        const error = parseRpcError(rpc_error);
        expect(error.type).toBe('ActionError');

        expect(formatError(error.type, error)).toBe('{"type":"ActionError","index":0,"kind":{"index":0,"kind":{"FunctionCallError":{"HostError":"GasLimitExceeded"}}}}');
    });

    test('test parse error object', async () => {
        const errorStr = '{"status":{"Failure":{"ActionError":{"index":0,"kind":{"FunctionCallError":{"EvmError":"ArgumentParseError"}}}}},"transaction":{"signer_id":"test.near","public_key":"ed25519:D5HVgBE8KgXkSirDE4UQ8qwieaLAR4wDDEgrPRtbbNep","nonce":110,"receiver_id":"evm","actions":[{"FunctionCall":{"method_name":"transfer","args":"888ZO7SvECKvfSCJ832LrnFXuF/QKrSGztwAAA==","gas":300000000000000,"deposit":"0"}}],"signature":"ed25519:7JtWQ2Ux63ixaKy7bTDJuRTWnv6XtgE84ejFMMjYGKdv2mLqPiCfkMqbAPt5xwLWwFdKjJniTcxWZe7FdiRWpWv","hash":"E1QorKKEh1WLJwRQSQ1pdzQN3f8yeFsQQ8CbJjnz1ZQe"},"transaction_outcome":{"proof":[],"block_hash":"HXXBPjGp65KaFtam7Xr67B8pZVGujZMZvTmVW6Fy9tXf","id":"E1QorKKEh1WLJwRQSQ1pdzQN3f8yeFsQQ8CbJjnz1ZQe","outcome":{"logs":[],"receipt_ids":["ZsKetkrZQGVTtmXr2jALgNjzcRqpoQQsk9HdLmFafeL"],"gas_burnt":2428001493624,"tokens_burnt":"2428001493624000000000","executor_id":"test.near","status":{"SuccessReceiptId":"ZsKetkrZQGVTtmXr2jALgNjzcRqpoQQsk9HdLmFafeL"}}},"receipts_outcome":[{"proof":[],"block_hash":"H6fQCVpxBDv9y2QtmTVHoxHibJvamVsHau7fDi7AmFa2","id":"ZsKetkrZQGVTtmXr2jALgNjzcRqpoQQsk9HdLmFafeL","outcome":{"logs":[],"receipt_ids":["DgRyf1Wv3ZYLFvM8b67k2yZjdmnyUUJtRkTxAwoFi3qD"],"gas_burnt":2428001493624,"tokens_burnt":"2428001493624000000000","executor_id":"evm","status":{"Failure":{"ActionError":{"index":0,"kind":{"FunctionCallError":{"EvmError":"ArgumentParseError"}}}}}}},{"proof":[],"block_hash":"9qNVA235L9XdZ8rZLBAPRNBbiGPyNnMUfpbi9WxbRdbB","id":"DgRyf1Wv3ZYLFvM8b67k2yZjdmnyUUJtRkTxAwoFi3qD","outcome":{"logs":[],"receipt_ids":[],"gas_burnt":0,"tokens_burnt":"0","executor_id":"test.near","status":{"SuccessValue":""}}}]}';
        const error = parseRpcError(JSON.parse(errorStr).status.Failure);
        expect(error).toEqual(new ServerError('{"index":0,"kind":{"index":0,"kind":{"FunctionCallError":{"EvmError":"ArgumentParseError"}}}}'));
    });

    test('test getErrorTypeFromErrorMessage', () => {
        const err1 = 'account random.near does not exist while viewing';
        const err2 = 'Account random2.testnet doesn\'t exist';
        const err3 = 'access key ed25519:DvXowCpBHKdbD2qutgfhG6jvBMaXyUh7DxrDSjkLxMHp does not exist while viewing';
        const err4 = 'wasm execution failed with error: CompilationError(CodeDoesNotExist { account_id: "random.testnet" })';
        const err5 = '[-32000] Server error: Invalid transaction: Transaction nonce 1 must be larger than nonce of the used access key 1';
        const err6 = 'wasm execution failed with error: MethodResolveError(MethodNotFound)';
        const err7 = 'wasm execution failed with error: FunctionCallError(CompilationError(CodeDoesNotExist { account_id: "random.testnet" }))';
        const err8 = 'wasm execution failed with error: FunctionCallError(MethodResolveError(MethodNotFound))';

        // @ts-expect-error test input
        expect(getErrorTypeFromErrorMessage(err1)).toEqual('AccountDoesNotExist');
        // @ts-expect-error test input
        expect(getErrorTypeFromErrorMessage(err2)).toEqual('AccountDoesNotExist');
        // @ts-expect-error test input
        expect(getErrorTypeFromErrorMessage(err3)).toEqual('AccessKeyDoesNotExist');
        // @ts-expect-error test input
        expect(getErrorTypeFromErrorMessage(err4)).toEqual('CodeDoesNotExist');
        // @ts-expect-error test input
        expect(getErrorTypeFromErrorMessage(err5)).toEqual('InvalidNonce');
        // @ts-expect-error test input
        expect(getErrorTypeFromErrorMessage(err6)).toEqual('MethodNotFound');
        // @ts-expect-error test input
        expect(getErrorTypeFromErrorMessage(err7)).toEqual('CodeDoesNotExist');
        // @ts-expect-error test input
        expect(getErrorTypeFromErrorMessage(err8)).toEqual('MethodNotFound');
    });

    test('test NotEnoughBalance message uses human readable values', () => {
        const error = parseRpcError({
            NotEnoughBalance: {
                balance: '1000000000000000000000000',
                cost: '10000000000000000000000000',
                signer_id: 'test.near'
            }
        });

        expect(error.message).toEqual('Sender test.near does not have enough balance 1 for operation costing 10');
    });

    test('test TriesToStake message uses human readable values', () => {
        const error = parseRpcError({
            TriesToStake: {
                account_id: 'test.near',
                balance: '9000000000000000000000000',
                locked: '1000000000000000000000000',
                stake: '10000000000000000000000000',
            }
        });

        expect(error.message).toEqual('Account test.near tried to stake 10, but has staked 1 and only has 9');
    });
});
