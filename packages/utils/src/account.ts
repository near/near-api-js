import type { AccountView, NearProtocolConfig } from '@near-js/types';

export interface AccountBalanceDetail {
    available: BigInt;
    staked: BigInt;
    stateStaked: BigInt;
    total: BigInt;
}

/**
 * Parse account balance details
 *
 * @param account account state from `view_account`
 * @param protocolConfig
 * @returns AccountBalanceDetail
 */
export function parseBalance(account: AccountView, protocolConfig: NearProtocolConfig): AccountBalanceDetail {
    const { amount, locked, storage_usage } = account;

    const costPerByte = BigInt(protocolConfig.runtime_config.storage_amount_per_byte);
    const stateStaked = BigInt(storage_usage) * costPerByte;
    const staked = BigInt(locked);
    const total = BigInt(amount) + staked;
    const available = total - (staked > stateStaked ? staked : stateStaked);

    return {
        available,
        staked,
        stateStaked,
        total,
    };
}
