const nearlib = require('../../lib/index');
const { parseRpcError, AccountAlreadyExists, TxExecutionError } = nearlib.utils.rpc_errors;

test('test parseRpcError', async () => {
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
});
