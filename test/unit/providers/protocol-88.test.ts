import { expect, test, vi } from 'vitest';
import { JsonRpcProvider } from '../../../src/index.js';
import { parseRpcError, parseTransactionExecutionError } from '../../../src/providers/errors/parse.js';
import {
    InvalidUniversalStateInitReceiverActionError,
    MalformedUniversalStateInitActionError,
    RemovedProtocolFeatureActionError,
    TooManyAccessKeysError,
} from '../../../src/rpc-errors/index.js';

test('access-key pagination passes opaque hashed-key cursors without public-key normalization', async () => {
    const provider = new JsonRpcProvider({ url: 'http://localhost:3030' });
    const query = vi.spyOn(provider, 'query').mockResolvedValue({} as never);
    await provider.viewAccessKeyList({ accountId: 'example.near', afterKey: 'ml-dsa-65-hash:cursor', limit: 10 });
    expect(query).toHaveBeenLastCalledWith({
        account_id: 'example.near',
        after_key: 'ml-dsa-65-hash:cursor',
        limit: 10,
        request_type: 'view_access_key_list',
        finality: 'optimistic',
    });
});

test('universal state-init failures retain their action and transaction context', () => {
    const details = { receiver_id: 'wrong.near', derived_id: '0u-derived' };
    const error = parseTransactionExecutionError(
        { InvalidTxError: { ActionsValidation: { InvalidUniversalStateInitReceiver: details } } },
        'tx',
        'block'
    );
    expect(error).toBeInstanceOf(InvalidUniversalStateInitReceiverActionError);
    expect(error).toMatchObject({ actionIndex: null, txHash: 'tx', blockHash: 'block', details });
    const malformed = parseTransactionExecutionError(
        { ActionError: { index: 0, kind: 'MalformedUniversalStateInit' } },
        'tx',
        'block'
    );
    expect(malformed).toBeInstanceOf(MalformedUniversalStateInitActionError);
    const removed = parseTransactionExecutionError(
        {
            InvalidTxError: {
                ActionsValidation: { RemovedProtocolFeature: { protocol_feature: 'DelegateActionV2', version: 87 } },
            },
        },
        'tx',
        'block'
    );
    expect(removed).toBeInstanceOf(RemovedProtocolFeatureActionError);
});

test('too many keys reports the server-provided pagination limit', () => {
    const details = { requested_account_id: 'example.near', limit: 100, block_hash: 'block', block_height: 42 };
    const error = parseRpcError({
        name: 'HANDLER_ERROR',
        cause: { name: 'TOO_MANY_ACCESS_KEYS', info: details },
    });
    expect(error).toBeInstanceOf(TooManyAccessKeysError);
    expect(error).toMatchObject({ details });
});
