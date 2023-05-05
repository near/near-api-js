import { computeBlockHash, combineHash } from './utils';
import {
    SCHEMA,
    BorshApprovalInner,
    BorshValidatorStakeView,
    BorshValidatorStakeViewV1,
    BorshValidatorStakeViewWrapper,
} from './borsh';
import bs58 from 'bs58';
import { sha256 } from 'js-sha256';
import {
    LightClientBlockLiteView,
    NextLightClientBlockResponse,
    ValidatorStakeView,
} from '@near-js/types';
import { PublicKey } from '@near-js/crypto';
import BN from 'bn.js';
import { serialize } from 'borsh';

export interface ValidateLightClientBlockParams {
    lastKnownBlock: LightClientBlockLiteView;
    currentBlockProducers: ValidatorStakeView[];
    newBlock: NextLightClientBlockResponse;
}

/**
 * Validates a light client block response from the RPC against the last known block and block
 * producer set.
 *
 * @param lastKnownBlock The last light client block retrieved. This must be the block at the epoch before newBlock.
 * @param currentBlockProducers The block producer set for the epoch of the last known block.
 * @param newBlock The new block to validate.
 */
export function validateLightClientBlock({
    lastKnownBlock,
    currentBlockProducers,
    newBlock,
}: ValidateLightClientBlockParams) {
    // Numbers for each step references the spec:
    // https://github.com/near/NEPs/blob/c7d72138117ed0ab86629a27d1f84e9cce80848f/specs/ChainSpec/LightClient.md
    // (1) Verify that the block height is greater than the last known block.
    if (newBlock.inner_lite.height <= lastKnownBlock.inner_lite.height) {
        throw new Error(
            'New block must be at least the height of the last known block'
        );
    }

    // (2) Verify that the new block is in the same epoch or in the next epoch known to the last
    // known block.
    if (
        newBlock.inner_lite.epoch_id !== lastKnownBlock.inner_lite.epoch_id &&
        newBlock.inner_lite.epoch_id !== lastKnownBlock.inner_lite.next_epoch_id
    ) {
        throw new Error(
            'New block must either be in the same epoch or the next epoch from the last known block'
        );
    }

    const blockProducers: ValidatorStakeView[] = currentBlockProducers;
    if (newBlock.approvals_after_next.length < blockProducers.length) {
        throw new Error(
            'Number of approvals for next epoch must be at least the number of current block producers'
        );
    }

    // (4) and (5)
    // (4) `approvals_after_next` contains valid signatures on the block producer approval messages.
    // (5) The signatures present represent more than 2/3 of the total stake.
    const totalStake = new BN(0);
    const approvedStake = new BN(0);

    const currentBlockHash = computeBlockHash(newBlock);
    const nextBlockHash = combineHash(
        bs58.decode(newBlock.next_block_inner_hash),
        currentBlockHash
    );

    for (let i = 0; i < blockProducers.length; i++) {
        const approval = newBlock.approvals_after_next[i];
        const stake = blockProducers[i].stake;

        totalStake.iadd(new BN(stake));

        if (approval === null) {
            continue;
        }

        approvedStake.iadd(new BN(stake));

        const publicKey = PublicKey.fromString(blockProducers[i].public_key);
        const signature = bs58.decode(approval.split(':')[1]);

        const approvalEndorsement = serialize(
            SCHEMA,
            new BorshApprovalInner({ endorsement: nextBlockHash })
        );

        const approvalHeight: BN = new BN(newBlock.inner_lite.height + 2);
        const approvalHeightLe = approvalHeight.toArrayLike(Buffer, 'le', 8);
        const approvalMessage = new Uint8Array([
            ...approvalEndorsement,
            ...approvalHeightLe,
        ]);

        if (!publicKey.verify(approvalMessage, signature)) {
            throw new Error(
                `Invalid approval message signature for validator ${blockProducers[i].account_id}`
            );
        }
    }

    // (5) Calculates the 2/3 threshold and checks that the approved stake accumulated above
    // exceeds it.
    const threshold = totalStake.mul(new BN(2)).div(new BN(3));
    if (approvedStake <= threshold) {
        throw new Error('Approved stake does not exceed the 2/3 threshold');
    }

    // (6) Verify that if the new block is in the next epoch, the hash of the next block producers
    // equals the `next_bp_hash` provided in that block.
    if (
        newBlock.inner_lite.epoch_id === lastKnownBlock.inner_lite.next_epoch_id
    ) {
        // (3) If the block is in a new epoch, then `next_bps` must be present.
        if (!newBlock.next_bps) {
            throw new Error(
                'New block must include next block producers if a new epoch starts'
            );
        }

        const bpsHash = hashBlockProducers(newBlock.next_bps);

        if (!bpsHash.equals(bs58.decode(newBlock.inner_lite.next_bp_hash))) {
            throw new Error('Next block producers hash doesn\'t match');
        }
    }
}

function hashBlockProducers(bps: ValidatorStakeView[]): Buffer {
    const borshBps: BorshValidatorStakeView[] = bps.map((bp) => {
        if (bp.validator_stake_struct_version) {
            const version = parseInt(
                bp.validator_stake_struct_version.slice(1)
            );
            if (version !== 1) {
                throw new Error(
                    'Only version 1 of the validator stake struct is supported'
                );
            }
        }
        return new BorshValidatorStakeView({
            v1: new BorshValidatorStakeViewV1({
                account_id: bp.account_id,
                public_key: PublicKey.fromString(bp.public_key),
                stake: bp.stake,
            }),
        });
    });
    const serializedBps = serialize(
        SCHEMA,
        // NOTE: just wrapping because borsh-js requires this type to be in the schema for some reason
        new BorshValidatorStakeViewWrapper({ bps: borshBps })
    );
    return Buffer.from(sha256.array(serializedBps));
}
