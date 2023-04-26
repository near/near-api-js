import bs58 from "bs58";
import { sha256 } from "js-sha256";
import {
    BlockHeaderInnerLiteView,
    ExecutionOutcomeWithIdView,
    ExecutionStatus,
    ExecutionStatusBasic,
    LightClientBlockLiteView,
    LightClientProof,
    MerklePath,
    NextLightClientBlockResponse,
    ValidatorStakeView,
} from "@near-js/types";
import { Assignable } from "@near-js/types";
import { PublicKey } from "@near-js/crypto";
import BN from "bn.js";
import { serialize } from "borsh";

// TODO this abstract class exists in NAJ and seems unused. It is also copied in the transactions
// TODO ..package. This should probably exist in utils and shared.
abstract class Enum {
    enum: string;

    constructor(properties: any) {
        if (Object.keys(properties).length !== 1) {
            throw new Error("Enum can only take single value");
        }
        Object.keys(properties).map((key: string) => {
            (this as any)[key] = properties[key];
            this.enum = key;
        });
    }
}

// TODO: refactor this into separate files

const ED_PREFIX = "ed25519:";

class BorshBlockHeaderInnerLite extends Assignable {
    height: BN;
    epoch_id: Uint8Array;
    next_epoch_id: Uint8Array;
    prev_state_root: Uint8Array;
    outcome_root: Uint8Array;
    timestamp: BN;
    next_bp_hash: Uint8Array;
    block_merkle_root: Uint8Array;
}

class BorshApprovalInner extends Enum {
    endorsement?: Uint8Array;
    skip?: BN;
}

class BorshValidatorStakeViewV1 extends Assignable {
    account_id: string;
    public_key: PublicKey;
    stake: BN;
}

class BorshValidatorStakeView extends Enum {
    v1?: BorshValidatorStakeViewV1;
}

class BorshValidatorStakeViewWrapper extends Assignable {
    bps: BorshValidatorStakeView[];
}

class BorshEmpty extends Assignable {}

class BorshPartialExecutionStatus extends Enum {
    unknown?: BorshEmpty;
    failure?: BorshEmpty;
    successValue?: Uint8Array;
    successReceiptId?: Uint8Array;
}

class BorshPartialExecutionOutcome extends Assignable {
    receiptIds: Uint8Array[];
    gasBurnt: BN;
    tokensBurnt: BN;
    executorId: string;
    status: BorshPartialExecutionStatus;
}

class BorshCryptoHash extends Assignable {
    array: Uint8Array;
}

class BorshCryptoHashes extends Assignable {
    hashes: Uint8Array[];
}

type Class<T = any> = new (...args: any[]) => T;
const SCHEMA = new Map<Class, any>([
    [
        BorshBlockHeaderInnerLite,
        {
            kind: "struct",
            fields: [
                ["height", "u64"],
                ["epoch_id", [32]],
                ["next_epoch_id", [32]],
                ["prev_state_root", [32]],
                ["outcome_root", [32]],
                ["timestamp", "u64"],
                ["next_bp_hash", [32]],
                ["block_merkle_root", [32]],
            ],
        },
    ],
    [
        BorshApprovalInner,
        {
            kind: "enum",
            field: "enum",
            values: [
                ["endorsement", [32]],
                ["skip", "u64"],
            ],
        },
    ],
    [
        BorshValidatorStakeViewV1,
        {
            kind: "struct",
            fields: [
                ["account_id", "string"],
                ["public_key", PublicKey],
                ["stake", "u128"],
            ],
        },
    ],
    [
        BorshValidatorStakeView,
        {
            kind: "enum",
            field: "enum",
            values: [["v1", BorshValidatorStakeViewV1]],
        },
    ],
    [
        BorshValidatorStakeViewWrapper,
        {
            kind: "struct",
            fields: [["bps", [BorshValidatorStakeView]]],
        },
    ],
    [
        BorshEmpty,
        {
            kind: "struct",
            fields: [],
        },
    ],
    [
        BorshCryptoHash,
        {
            kind: "struct",
            fields: [["hash", [32]]],
        },
    ],
    [
        BorshCryptoHashes,
        {
            kind: "struct",
            fields: [["hashes", [[32]]]],
        },
    ],
    [
        BorshPartialExecutionStatus,
        {
            kind: "enum",
            field: "enum",
            values: [
                ["unknown", BorshEmpty],
                ["failure", BorshEmpty],
                ["successValue", ["u8"]],
                ["successReceiptId", [32]],
            ],
        },
    ],
    [
        BorshPartialExecutionOutcome,
        {
            kind: "struct",
            fields: [
                ["receiptIds", [[32]]],
                ["gasBurnt", "u64"],
                ["tokensBurnt", "u128"],
                ["executorId", "string"],
                ["status", BorshPartialExecutionStatus],
            ],
        },
    ],
    // Note: Copied from transactions schema
    [
        PublicKey,
        {
            kind: "struct",
            fields: [
                ["keyType", "u8"],
                ["data", [32]],
            ],
        },
    ],
]);

function hashBlockProducers(bps: ValidatorStakeView[]): Buffer {
    const borshBps: BorshValidatorStakeView[] = bps.map((bp) => {
        if (bp.validator_stake_struct_version) {
            const version = parseInt(
                bp.validator_stake_struct_version.slice(1)
            );
            if (version !== 1) {
                throw new Error(
                    "Only version 1 of the validator stake struct is supported"
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

function combineHash(h1: Uint8Array, h2: Uint8Array): Buffer {
    const hash = sha256.create();
    hash.update(h1);
    hash.update(h2);
    return Buffer.from(hash.digest());
}

/**
 * Computes the block hash given a `LightClientBlockLiteView`. Unlike the regular block header,
 * the hash has to be calculated since it is not included in the response.
 *
 * @param block The block to compute the hash for.
 */
export function computeBlockHash(block: LightClientBlockLiteView): Buffer {
    const header = block.inner_lite;
    const borshHeader = new BorshBlockHeaderInnerLite({
        height: new BN(header.height),
        epoch_id: bs58.decode(header.epoch_id),
        next_epoch_id: bs58.decode(header.next_epoch_id),
        prev_state_root: bs58.decode(header.prev_state_root),
        outcome_root: bs58.decode(header.outcome_root),
        timestamp: new BN(header.timestamp_nanosec),
        next_bp_hash: bs58.decode(header.next_bp_hash),
        block_merkle_root: bs58.decode(header.block_merkle_root),
    });
    const msg = serialize(SCHEMA, borshHeader);
    const innerRestHash = bs58.decode(block.inner_rest_hash);
    const prevHash = bs58.decode(block.prev_block_hash);
    const innerLiteHash = Buffer.from(sha256.array(msg));
    const innerHash = combineHash(innerLiteHash, innerRestHash);
    const finalHash = combineHash(innerHash, prevHash);

    return finalHash;
}

/**
 * Validates a light client block response from the RPC against the last known block and block
 * producer set.
 *
 * @param lastKnownBlock The last light client block retrieved. This must be the block at the epoch before newBlock.
 * @param currentBlockProducers The block producer set for the epoch of the last known block.
 * @param newBlock The new block to validate.
 */
export function validateLightClientBlock(
    lastKnownBlock: LightClientBlockLiteView,
    currentBlockProducers: ValidatorStakeView[],
    newBlock: NextLightClientBlockResponse
) {
    // Numbers for each step references the spec:
    // https://github.com/near/NEPs/blob/c7d72138117ed0ab86629a27d1f84e9cce80848f/specs/ChainSpec/LightClient.md
    const newBlockHash = computeBlockHash(lastKnownBlock);
    const nextBlockHashDecoded = combineHash(
        bs58.decode(newBlock.next_block_inner_hash),
        newBlockHash
    );

    // (1)
    if (newBlock.inner_lite.height <= lastKnownBlock.inner_lite.height) {
        throw new Error(
            "New block must be at least the height of the last known block"
        );
    }

    // (2)
    if (
        newBlock.inner_lite.epoch_id !== lastKnownBlock.inner_lite.epoch_id &&
        newBlock.inner_lite.epoch_id !== lastKnownBlock.inner_lite.next_epoch_id
    ) {
        throw new Error(
            "New block must either be in the same epoch or the next epoch from the last known block"
        );
    }

    const blockProducers: ValidatorStakeView[] = currentBlockProducers;
    if (newBlock.approvals_after_next.length < blockProducers.length) {
        throw new Error(
            "Number of approvals for next epoch must be at least the number of current block producers"
        );
    }

    // (4) and (5)
    const totalStake = new BN(0);
    const approvedStake = new BN(0);

    for (let i = 0; i < blockProducers.length; i++) {
        const approval = newBlock.approvals_after_next[i];
        const stake = blockProducers[i].stake;

        totalStake.iadd(new BN(stake));

        if (approval === null) {
            continue;
        }

        approvedStake.iadd(new BN(stake));

        const publicKey = PublicKey.fromString(blockProducers[i].public_key);
        const signature = bs58.decode(approval.slice(ED_PREFIX.length));

        const approvalEndorsement = serialize(
            SCHEMA,
            new BorshApprovalInner({ endorsement: nextBlockHashDecoded })
        );

        const approvalHeight: BN = new BN(newBlock.inner_lite.height + 2);
        const approvalHeightLe = approvalHeight.toArrayLike(Buffer, "le", 8);
        const approvalMessage = new Uint8Array([
            ...approvalEndorsement,
            ...approvalHeightLe,
        ]);

        publicKey.verify(approvalMessage, signature);
    }

    // (5)
    const threshold = totalStake.mul(new BN(2)).div(new BN(3));
    if (approvedStake <= threshold) {
        throw new Error("Approved stake does not exceed the 2/3 threshold");
    }

    // (6)
    if (
        newBlock.inner_lite.epoch_id === lastKnownBlock.inner_lite.next_epoch_id
    ) {
        // (3)
        if (!newBlock.next_bps) {
            throw new Error(
                "New block must include next block producers if a new epoch starts"
            );
        }

        const bpsHash = hashBlockProducers(newBlock.next_bps);

        if (!bpsHash.equals(bs58.decode(newBlock.inner_lite.next_bp_hash))) {
            throw new Error("Next block producers hash doesn't match");
        }
    }
}

function blockHeaderInnerLiteHash(data: BlockHeaderInnerLiteView): Buffer {
    const hash = sha256.create();
    hash.update(new BN(data.height).toArrayLike(Buffer, "le", 8));
    hash.update(bs58.decode(data.epoch_id));
    hash.update(bs58.decode(data.next_epoch_id));
    hash.update(bs58.decode(data.prev_state_root));
    hash.update(bs58.decode(data.outcome_root));
    hash.update(
        new BN(data.timestamp_nanosec || data.timestamp).toArrayLike(
            Buffer,
            "le",
            8
        )
    );
    hash.update(bs58.decode(data.next_bp_hash));
    hash.update(bs58.decode(data.block_merkle_root));
    return Buffer.from(hash.digest());
}

function computeRoot(node: Buffer, proof: MerklePath): Buffer {
    proof.forEach((step) => {
        if (step.direction == "Left") {
            node = combineHash(bs58.decode(step.hash), node);
        } else {
            node = combineHash(node, bs58.decode(step.hash));
        }
    });
    return node;
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
            throw new Error("Pending status is not supported");
        } else if (status === ExecutionStatusBasic.Unknown) {
            return new BorshPartialExecutionStatus({
                unknown: new BorshEmpty({}),
            });
        } else if (
            status === ExecutionStatusBasic.Failure ||
            "Failure" in status
        ) {
            return new BorshPartialExecutionStatus({
                failure: new BorshEmpty({}),
            });
        } else if (
            status.SuccessValue !== undefined &&
            status.SuccessValue !== null
        ) {
            return new BorshPartialExecutionStatus({
                successValue: Buffer.from(status.SuccessValue, "base64"),
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
            // TODO update with types once https://github.com/near/near-api-js/pull/1113 comes in
            tokensBurnt: new BN((outcomeWithId.outcome as any).tokens_burnt),
            executorId: (outcomeWithId.outcome as any).executor_id,
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

/**
 * Validates the execution proof returned from the RPC. This will validate that the proof itself,
 * and ensure that the block merkle root matches the one passed in.
 *
 * @param proof The proof given by the RPC.
 * @param blockMerkleRoot The block merkle root for the block that was used to generate the proof.
 */
export function validateExecutionProof(
    proof: LightClientProof,
    blockMerkleRoot: Uint8Array
) {
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
