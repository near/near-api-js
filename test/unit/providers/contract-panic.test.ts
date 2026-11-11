import { expect, test } from 'vitest';
import { parseRpcError, parseTransactionExecutionError } from '../../../src/providers/errors/parse.js';
import type { FunctionCallError } from '../../../src/rpc/types.gen.js';
import { ContractExecutionError, HostGuestPanicError } from '../../../src/rpc-errors/index.js';

test.each(['only the administrator may do this', '', 'first line\nsecond line', 'Smart contract panicked: nested'])(
    'structured and flattened guest panics expose the same message: %j',
    (panicMessage) => {
        const representations: FunctionCallError[] = [
            { HostError: { GuestPanic: { panic_msg: panicMessage } } },
            { ExecutionError: `Smart contract panicked: ${panicMessage}` },
        ];
        for (const representation of representations) {
            const error = parseTransactionExecutionError(
                { ActionError: { index: 0, kind: { FunctionCallError: representation } } },
                'tx',
                'block'
            );
            expect(error).toBeInstanceOf(HostGuestPanicError);
            expect(error).toBeInstanceOf(ContractExecutionError);
            expect(error).toMatchObject({ panicMessage, blockHash: 'block', blockHeight: -1 });

            const viewError = parseRpcError({
                name: 'HANDLER_ERROR',
                cause: {
                    name: 'CONTRACT_EXECUTION_ERROR',
                    info: {
                        error: representation,
                        vm_error: 'Contract execution failed',
                        block_hash: 'block',
                        block_height: 42,
                    },
                },
            });
            expect(viewError).toBeInstanceOf(HostGuestPanicError);
            expect(viewError).toMatchObject({ panicMessage, blockHash: 'block', blockHeight: 42 });
        }
    }
);

test.each(['Exceeded the prepaid gas.', 'prefix Smart contract panicked: text', 'Smart contract panicked'])(
    'other execution errors retain their original message: %j',
    (message) => {
        const error = parseTransactionExecutionError(
            { ActionError: { index: 0, kind: { FunctionCallError: { ExecutionError: message } } } },
            'tx',
            'block'
        );
        expect(error.constructor).toBe(ContractExecutionError);
        expect(error.message).toBe(message);
    }
);
