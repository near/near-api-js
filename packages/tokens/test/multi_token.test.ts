import { expect, test } from 'bun:test';
import { MultiTokenContract } from '../src';

function createMockAccount(accountId: string) {
    const calls: any[] = [];
    const providerCalls: any[] = [];

    return {
        account: {
            accountId,
            provider: {
                callFunction: async (contractId, methodName, args) => {
                    providerCalls.push({ contractId, methodName, args });
                    return undefined as any;
                },
            },
            getState: async () => ({ balance: { available: 0n } }),
            signAndSendTransaction: async ({ receiverId, actions }) => {
                calls.push({ type: 'signAndSendTransaction', receiverId, actions });
                return {};
            },
            callFunction: async ({ contractId, methodName, args, gas, deposit }) => {
                calls.push({ type: 'callFunction', contractId, methodName, args, gas, deposit });
                return {};
            },
        },
        get calls() { return calls; },
        get providerCalls() { return providerCalls; },
        clear() { calls.length = 0; providerCalls.length = 0; }
    };
}

const MT = new MultiTokenContract('mt.contract.testnet');

test('getBalance calls view and returns bigint', async () => {
    const mock = createMockAccount('alice.testnet');

    mock.account.provider.callFunction = async (contractId, methodName, args) => {
        mock.providerCalls.push({ contractId, methodName, args });
        return '123';
    };

    const balance = await MT.getBalance(mock.account, 'token-1');
    expect(balance).toBe(123n);

    expect(mock.providerCalls.length).toBe(1);
    expect(mock.providerCalls[0]).toEqual({
        contractId: 'mt.contract.testnet',
        methodName: 'mt_balance_of',
        args: { account_id: 'alice.testnet', token_id: 'token-1' }
    });
});

test('getBatchedBalance calls view and returns bigint[]', async () => {
    const mock = createMockAccount('bob.testnet');
    mock.account.provider.callFunction = async (contractId, methodName, args) => {
        mock.providerCalls.push({ contractId, methodName, args });
        return ['1', '2', '3'];
    };

    const balances = await MT.getBatchedBalance(mock.account, ['t1', 't2', 't3']);
    expect(balances).toEqual([1n, 2n, 3n]);

    expect(mock.providerCalls.length).toBe(1);
    expect(mock.providerCalls[0]).toEqual({
        contractId: 'mt.contract.testnet',
        methodName: 'mt_batch_balance_of',
        args: { account_id: 'bob.testnet', token_ids: ['t1', 't2', 't3'] }
    });
});

test('transfer calls mt_transfer with correct args', async () => {
    const mock = createMockAccount('carol.testnet');

    await MT.transfer({
        from: mock.account,
        receiverId: 'dave.testnet',
        tokenId: 't-1',
        amount: 42,
        approval: ['carol.testnet', 7],
        memo: 'note',
    });

    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toEqual({
        type: 'callFunction',
        contractId: 'mt.contract.testnet',
        methodName: 'mt_transfer',
        args: {
            receiver_id: 'dave.testnet',
            token_id: 't-1',
            amount: '42',
            approval: ['carol.testnet', 7],
            memo: 'note',
        },
        gas: '30000000000000',
        deposit: 1,
    });
});

test('transferCall calls mt_transfer_call with correct args', async () => {
    const mock = createMockAccount('erin.testnet');

    await MT.transferCall({
        from: mock.account,
        receiverId: 'frank.testnet',
        tokenId: 't-2',
        amount: 100n,
        msg: 'hi',
        approval: null,
        memo: null,
    });

    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toEqual({
        type: 'callFunction',
        contractId: 'mt.contract.testnet',
        methodName: 'mt_transfer_call',
        args: {
            receiver_id: 'frank.testnet',
            token_id: 't-2',
            amount: '100',
            approval: null,
            memo: null,
            msg: 'hi',
        },
        gas: '30000000000000',
        deposit: 1,
    });
});

test('batchTransfer calls mt_batch_transfer with correct args', async () => {
    const mock = createMockAccount('gina.testnet');

    await MT.batchTransfer({
        from: mock.account,
        receiverId: 'harry.testnet',
        tokenIds: ['a', 'b'],
        amounts: [1, 2n],
        approvals: [null, ['gina.testnet', 9]],
        memo: 'batch',
    });

    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toEqual({
        type: 'callFunction',
        contractId: 'mt.contract.testnet',
        methodName: 'mt_batch_transfer',
        args: {
            receiver_id: 'harry.testnet',
            token_ids: ['a', 'b'],
            amounts: ['1', '2'],
            approvals: [null, ['gina.testnet', 9]],
            memo: 'batch',
        },
        gas: '30000000000000',
        deposit: 1,
    });
});
