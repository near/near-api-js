const nearApi = require('../../lib/index');
const {
    parseRpcError,
    AccountAlreadyExists,
    ReceiverMismatch,
    InvalidTxError,
    ActionError,
    TxExecutionError,
    InvalidAccessKeyError,
    FunctionCallError,
    HostError,
    InvalidIteratorIndex,
    GasLimitExceeded,
    formatError
} = nearApi.utils.rpc_errors;
describe('rpc-errors', () => {
    test('test AccountAlreadyExists error', async () => {
        let rpc_error = {
            TxExecutionError: {
                ActionError: {
                    index: 1,
                    kind: {AccountAlreadyExists: {account_id: 'bob.near'}}
                }
            }
        };
        let error = parseRpcError(rpc_error);
        expect(error instanceof TxExecutionError).toBe(true);
        expect(error instanceof AccountAlreadyExists).toBe(true);
        expect(error.index).toBe(1);
        expect(error.account_id).toBe('bob.near');
        expect(formatError(error.type, error)).toBe('Can\'t create a new account bob.near, because it already exists');
    });

    test('test ReceiverMismatch error', async () => {
        let rpc_error = {
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
        let error = parseRpcError(rpc_error);
        expect(error instanceof TxExecutionError).toBe(true);
        expect(error instanceof InvalidTxError).toBe(true);
        expect(error instanceof InvalidAccessKeyError).toBe(true);
        expect(error instanceof ReceiverMismatch).toBe(true);
        expect(error.ak_receiver).toBe('test.near');
        expect(error.tx_receiver).toBe('bob.near');
        expect(formatError(error.type, error)).toBe(
            'Wrong AccessKey used for transaction: transaction is sent to receiver_id=bob.near, but is signed with function call access key that restricted to only use with receiver_id=test.near. Either change receiver_id in your transaction or switch to use a FullAccessKey.'
        );
    });

    test('test InvalidIteratorIndex error', async () => {
        let rpc_error = {
            TxExecutionError: {
                ActionError: {
                    FunctionCallError: {
                        HostError: {
                            InvalidIteratorIndex: {iterator_index: 42}
                        }
                    }
                }
            }
        };
        let error = parseRpcError(rpc_error);
        expect(error instanceof TxExecutionError).toBe(true);
        expect(error instanceof AccountAlreadyExists).toBe(false);
        expect(error instanceof ActionError).toBe(true);
        expect(error instanceof FunctionCallError).toBe(true);
        expect(error instanceof HostError).toBe(true);
        expect(error instanceof InvalidIteratorIndex).toBe(true);
        expect(error.iterator_index).toBe(42);
        expect(formatError(error.type, error)).toBe('Iterator index 42 does not exist');
    });

    test('test ActionError::FunctionCallError::GasLimitExceeded error', async () => {
        let rpc_error = {
            ActionError: {
                'index': 0,
                'kind': {
                    FunctionCallError: {
                        'HostError': 'GasLimitExceeded'
                    }
                }
            }
        };
        let error = parseRpcError(rpc_error);
        expect(error instanceof TxExecutionError).toBe(true);

        expect(error instanceof ActionError).toBe(true);
        expect(error instanceof FunctionCallError).toBe(true);
        expect(error instanceof HostError).toBe(true);
        expect(error instanceof GasLimitExceeded).toBe(true);

        expect(formatError(error.type, error)).toBe('Exceeded the maximum amount of gas allowed to burn per contract');
    });

});
