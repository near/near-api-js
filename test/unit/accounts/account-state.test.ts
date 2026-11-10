import { describe, expect, test } from 'vitest';
import { Account, type Provider } from '../../../src/index.js';

describe('Account.getState', () => {
    const accountState = async (overrides: Record<string, unknown> = {}) => {
        const provider = {
            experimental_protocolConfig: async () => ({
                runtime_config: { storage_amount_per_byte: '1' },
            }),
            viewAccount: async () => ({
                amount: '10',
                locked: '0',
                storage_usage: 1,
                code_hash: '11111111111111111111111111111111',
                ...overrides,
            }),
        } as unknown as Provider;

        return new Account('initialized.near', provider).getState();
    };

    test('normalizes an omitted RPC initialization state to initialized', async () => {
        const state = await accountState();

        expect(state.initializationState).toBe('initialized');
    });

    test.each([
        ['global_contract_hash', '11111111111111111111111111111111', { codeHash: '11111111111111111111111111111111' }],
        ['global_contract_account_id', 'publisher.near', { accountId: 'publisher.near' }],
    ])('exposes the %s reference', async (field, value, expected) => {
        const state = await accountState({ [field]: value });

        expect(state.globalContract).toEqual(expected);
    });

    test('omits the global contract reference for locally deployed code', async () => {
        const state = await accountState();

        expect(state.globalContract).toBeUndefined();
    });
});
