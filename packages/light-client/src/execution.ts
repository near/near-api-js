import bs58 from 'bs58';
import { sha256 } from 'js-sha256';
import {
    BlockHeaderInnerLiteView,
    ExecutionOutcomeWithIdView,
    ExecutionStatus,
    ExecutionStatusBasic,
    LightClientProof,
    MerklePath,
} from '@near-js/types';
import BN from 'bn.js';
import { serialize } from 'borsh';
import {
    BorshCryptoHash,
    BorshCryptoHashes,
    BorshEmpty,
    BorshPartialExecutionOutcome,
    BorshPartialExecutionStatus,
    SCHEMA,
} from './borsh';
import { combineHash } from './utils';

export interface ValidateExecutionProofParams {
    proof: LightClientProof;
    blockMerkleRoot: Uint8Array;
}

/**
 * Validates the execution proof returned from the RPC. This will validate that the proof itself,
 * and ensure that the block merkle root matches the one passed in.
 *
 * @param proof The proof given by the RPC.
 * @param blockMerkleRoot The block merkle root for the block that was used to generate the proof.
 */
export function validateExecutionProof({
    proof,
    blockMerkleRoot,
}: ValidateExecutionProofParams) {
    // Execution outcome root verification
    const computedOutcomeRoot = computeOutcomeRoot(
        proof.outcome_proof,
        proof.outcome_root_proof
    );
    const proofRoot = proof.block_header_lite.inner_lite.outcome_root;
    if (!computedOutcomeRoot.equals(bs58.decode(proofRoot))) {
        throw new Error(
            `Block outcome root (${bs58.encode(
                computedOutcomeRoot
            )}) doesn't match proof (${proofRoot})}`
        );
    }

    // Block merkle root verification
    const computedBlockRoot = computeMerkleRoot(proof);
    if (!computedBlockRoot.equals(blockMerkleRoot)) {
        throw new Error(
            `Block merkle root (${bs58.encode(
                computedBlockRoot
            )}) doesn't match proof (${bs58.encode(blockMerkleRoot)})}`
        );
    }
}

function computeRoot(node: Buffer, proof: MerklePath): Buffer {
    proof.forEach((step) => {
        if (step.direction == 'Left') {
            node = combineHash(bs58.decode(step.hash), node);
        } else {
            node = combineHash(node, bs58.decode(step.hash));
        }
    });
    return node;
}

function blockHeaderInnerLiteHash(data: BlockHeaderInnerLiteView): Buffer {
    const hash = sha256.create();
    hash.update(new BN(data.height).toArrayLike(Buffer, 'le', 8));
    hash.update(bs58.decode(data.epoch_id));
    hash.update(bs58.decode(data.next_epoch_id));
    hash.update(bs58.decode(data.prev_state_root));
    hash.update(bs58.decode(data.outcome_root));
    hash.update(
        new BN(data.timestamp_nanosec || data.timestamp).toArrayLike(
            Buffer,
            'le',
            8
        )
    );
    hash.update(bs58.decode(data.next_bp_hash));
    hash.update(bs58.decode(data.block_merkle_root));
    return Buffer.from(hash.digest());
}

function computeMerkleRoot(proof: LightClientProof): Buffer {
    const innerLiteHash = blockHeaderInnerLiteHash(
        proof.block_header_lite.inner_lite
    );

    const headerHash = combineHash(
        combineHash(
            innerLiteHash,
            bs58.decode(proof.block_header_lite.inner_rest_hash)
        ),
        bs58.decode(proof.block_header_lite.prev_block_hash)
    );

    return computeRoot(headerHash, proof.block_proof);
}

function computeOutcomeRoot(
    outcomeWithId: ExecutionOutcomeWithIdView,
    outcomeRootProof: MerklePath
) {
    // Generate outcome proof hash through borsh encoding
    const receiptIds = outcomeWithId.outcome.receipt_ids.map((id) =>
        bs58.decode(id)
    );

    const borshStatus = (
        status: ExecutionStatus | ExecutionStatusBasic
    ): BorshPartialExecutionStatus => {
        if (status === ExecutionStatusBasic.Pending) {
            throw new Error('Pending status is not supported');
        } else if (status === ExecutionStatusBasic.Unknown) {
            return new BorshPartialExecutionStatus({
                unknown: new BorshEmpty({}),
            });
        } else if (
            status === ExecutionStatusBasic.Failure ||
            'Failure' in status
        ) {
            return new BorshPartialExecutionStatus({
                failure: new BorshEmpty({}),
            });
        } else if (
            status.SuccessValue !== undefined &&
            status.SuccessValue !== null
        ) {
            return new BorshPartialExecutionStatus({
                successValue: Buffer.from(status.SuccessValue, 'base64'),
            });
        } else if (
            status.SuccessReceiptId !== undefined &&
            status.SuccessReceiptId !== null
        ) {
            return new BorshPartialExecutionStatus({
                successReceiptId: bs58.decode(status.SuccessReceiptId),
            });
        } else {
            throw new Error(`Unexpected execution status ${status}`);
        }
    };
    const partialExecOutcome: BorshPartialExecutionOutcome =
        new BorshPartialExecutionOutcome({
            receiptIds: receiptIds,
            gasBurnt: new BN(outcomeWithId.outcome.gas_burnt),
            tokensBurnt: new BN(outcomeWithId.outcome.tokens_burnt),
            executorId: outcomeWithId.outcome.executor_id,
            status: borshStatus(outcomeWithId.outcome.status),
        });
    const serializedPartialOutcome = serialize(SCHEMA, partialExecOutcome);
    const partialOutcomeHash = Buffer.from(
        sha256.array(serializedPartialOutcome)
    );
    const logsHashes: Uint8Array[] = outcomeWithId.outcome.logs.map((log) => {
        return Buffer.from(sha256.array(log));
    });
    const outcomeHashes: Uint8Array[] = [
        bs58.decode(outcomeWithId.id),
        partialOutcomeHash,
        ...logsHashes,
    ];

    const outcomeSerialized = serialize(
        SCHEMA,
        new BorshCryptoHashes({ hashes: outcomeHashes })
    );
    const outcomeHash = Buffer.from(sha256.array(outcomeSerialized));

    // Generate shard outcome root
    // computeRoot(sha256(borsh(outcome)), outcome.proof)
    const outcomeShardRoot = computeRoot(outcomeHash, outcomeWithId.proof);

    // Generate block outcome root
    // computeRoot(sha256(borsh(shardOutcomeRoot)), outcomeRootProof)
    const shardRootBorsh = serialize(
        SCHEMA,
        new BorshCryptoHash({ hash: outcomeShardRoot })
    );
    const shardRootHash = Buffer.from(sha256.array(shardRootBorsh));

    return computeRoot(shardRootHash, outcomeRootProof);
}
