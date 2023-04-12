/**
 * NEAR RPC API request types and responses
 * @module
 */

export interface CurrentEpochValidatorInfo {
    account_id: string;
    public_key: string;
    is_slashed: boolean;
    stake: string;
    shards: number[];
    num_produced_blocks: number;
    num_expected_blocks: number;
}

export interface NextEpochValidatorInfo {
    account_id: string;
    public_key: string;
    stake: string;
    shards: number[];
}

export interface ValidatorStakeView {
    account_id: string;
    public_key: string;
    stake: string;
    validator_stake_struct_version: string;
}

export interface EpochValidatorInfo {
    // Validators for the current epoch.
    next_validators: NextEpochValidatorInfo[];
    // Validators for the next epoch.
    current_validators: CurrentEpochValidatorInfo[];
    // Fishermen for the current epoch.
    next_fisherman: ValidatorStakeView[];
    // Fishermen for the next epoch.
    current_fisherman: ValidatorStakeView[];
    // Proposals in the current epoch.
    current_proposals: ValidatorStakeView[];
    // Kickout in the previous epoch.
    prev_epoch_kickout: ValidatorStakeView[];
    // Epoch start height.
    epoch_start_height: number;
}
