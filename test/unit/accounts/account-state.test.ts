import { describe, expect, test } from 'vitest';
import { Account, type Provider } from '../../../src/index.js';

describe('Account.getState', () => {
    test('normalizes an omitted RPC initialization state to initialized', async () => {
        const provider = {
            experimental_protocolConfig: async () => ({
                runtime_config: { storage_amount_per_byte: '1' },
            }),
            viewAccount: async () => ({
                amount: '10',
                locked: '0',
                storage_usage: 1,
                code_hash: '11111111111111111111111111111111',
            }),
        } as unknown as Provider;

        const state = await new Account('initialized.near', provider).getState();

        expect(state.initializationState).toBe('initialized');
    });
});
