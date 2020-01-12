const nearlib = require('../../lib/index');
const {
    parseRpcError,
    AccountAlreadyExists,
    ReceiverMismatch,
    InvalidTx,
    Action,
    TxExecutionError,
    InvalidAccessKey,
    FunctionCall,
    FunctionExecError,
    HostError,
    InvalidIteratorIndex,
    formatError
} = nearlib.utils.rpc_errors;
describe('rpc-errors', () => {
    test('test AccountAlreadyExists error', async () => {
        let rpc_error = {
            TxExecutionError: {
                Action: {
                    index: 1,
                    kind: { AccountAlreadyExists: { account_id: 'bob.near' } }
                }
            }
        };
        let error = parseRpcError(rpc_error);
        expect(error instanceof TxExecutionError).toBe(true);
        expect(error instanceof AccountAlreadyExists).toBe(true);
        expect(error.index).toBe(1);
        expect(error.account_id).toBe('bob.near');
        expect(formatError(error)).toBe('Can\'t create a new account bob.near, because it already exists');
    });

    test('test ReceiverMismatch error', async () => {
        let rpc_error = {
            TxExecutionError: {
                InvalidTx: {
                    InvalidAccessKey: {
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
        expect(error instanceof InvalidTx).toBe(true);
        expect(error instanceof InvalidAccessKey).toBe(true);
        expect(error instanceof ReceiverMismatch).toBe(true);
        expect(error.ak_receiver).toBe('test.near');
        expect(error.tx_receiver).toBe('bob.near');
        expect(formatError(error)).toBe(
            'Transaction receiver_id bob.near doesn\'t match the access key receiver_id test.near'
        );
    });

    test('test InvalidIteratorIndex error', async () => {
        let rpc_error = {
            TxExecutionError: {
                Action: {
                    FunctionCall: {
                        FunctionExecError: {
                            HostError: {
                                InvalidIteratorIndex: { iterator_index: 42 }
                            }
                        }
                    }
                }
            }
        };
        let error = parseRpcError(rpc_error);
        expect(error instanceof TxExecutionError).toBe(true);
        expect(error instanceof AccountAlreadyExists).toBe(false);
        expect(error instanceof Action).toBe(true);
        expect(error instanceof FunctionCall).toBe(true);
        expect(error instanceof FunctionExecError).toBe(true);
        expect(error instanceof HostError).toBe(true);
        expect(error instanceof InvalidIteratorIndex).toBe(true);
        expect(error.iterator_index).toBe(42);
        expect(formatError(error)).toBe('Iterator index 42 does not exist');
    });

});
