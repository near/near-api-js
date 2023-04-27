import bs58 from 'bs58';
import { sha256 } from 'js-sha256';
import {
    LightClientBlockLiteView,
} from '@near-js/types';
import { Assignable, Enum } from '@near-js/types';
import { PublicKey } from '@near-js/crypto';
import BN from 'bn.js';
import { serialize } from 'borsh';

export class BorshBlockHeaderInnerLite extends Assignable {
    height: BN;
    epoch_id: Uint8Array;
    next_epoch_id: Uint8Array;
    prev_state_root: Uint8Array;
    outcome_root: Uint8Array;
    timestamp: BN;
    next_bp_hash: Uint8Array;
    block_merkle_root: Uint8Array;
}

export class BorshApprovalInner extends Enum {
    endorsement?: Uint8Array;
    skip?: BN;
}

export class BorshValidatorStakeViewV1 extends Assignable {
    account_id: string;
    public_key: PublicKey;
    stake: BN;
}

export class BorshValidatorStakeView extends Enum {
    v1?: BorshValidatorStakeViewV1;
}

export class BorshValidatorStakeViewWrapper extends Assignable {
    bps: BorshValidatorStakeView[];
}

export class BorshEmpty extends Assignable {}

export class BorshPartialExecutionStatus extends Enum {
    unknown?: BorshEmpty;
    failure?: BorshEmpty;
    successValue?: Uint8Array;
    successReceiptId?: Uint8Array;
}

export class BorshPartialExecutionOutcome extends Assignable {
    receiptIds: Uint8Array[];
    gasBurnt: BN;
    tokensBurnt: BN;
    executorId: string;
    status: BorshPartialExecutionStatus;
}

export class BorshCryptoHash extends Assignable {
    array: Uint8Array;
}

export class BorshCryptoHashes extends Assignable {
    hashes: Uint8Array[];
}

type Class<T = any> = new (...args: any[]) => T;
export const SCHEMA = new Map<Class, any>([
    [
        BorshBlockHeaderInnerLite,
        {
            kind: 'struct',
            fields: [
                ['height', 'u64'],
                ['epoch_id', [32]],
                ['next_epoch_id', [32]],
                ['prev_state_root', [32]],
                ['outcome_root', [32]],
                ['timestamp', 'u64'],
                ['next_bp_hash', [32]],
                ['block_merkle_root', [32]],
            ],
        },
    ],
    [
        BorshApprovalInner,
        {
            kind: 'enum',
            field: 'enum',
            values: [
                ['endorsement', [32]],
                ['skip', 'u64'],
            ],
        },
    ],
    [
        BorshValidatorStakeViewV1,
        {
            kind: 'struct',
            fields: [
                ['account_id', 'string'],
                ['public_key', PublicKey],
                ['stake', 'u128'],
            ],
        },
    ],
    [
        BorshValidatorStakeView,
        {
            kind: 'enum',
            field: 'enum',
            values: [['v1', BorshValidatorStakeViewV1]],
        },
    ],
    [
        BorshValidatorStakeViewWrapper,
        {
            kind: 'struct',
            fields: [['bps', [BorshValidatorStakeView]]],
        },
    ],
    [
        BorshEmpty,
        {
            kind: 'struct',
            fields: [],
        },
    ],
    [
        BorshCryptoHash,
        {
            kind: 'struct',
            fields: [['hash', [32]]],
        },
    ],
    [
        BorshCryptoHashes,
        {
            kind: 'struct',
            fields: [['hashes', [[32]]]],
        },
    ],
    [
        BorshPartialExecutionStatus,
        {
            kind: 'enum',
            field: 'enum',
            values: [
                ['unknown', BorshEmpty],
                ['failure', BorshEmpty],
                ['successValue', ['u8']],
                ['successReceiptId', [32]],
            ],
        },
    ],
    [
        BorshPartialExecutionOutcome,
        {
            kind: 'struct',
            fields: [
                ['receiptIds', [[32]]],
                ['gasBurnt', 'u64'],
                ['tokensBurnt', 'u128'],
                ['executorId', 'string'],
                ['status', BorshPartialExecutionStatus],
            ],
        },
    ],
    // Note: Copied from transactions schema
    [
        PublicKey,
        {
            kind: 'struct',
            fields: [
                ['keyType', 'u8'],
                ['data', [32]],
            ],
        },
    ],
]);

export function combineHash(h1: Uint8Array, h2: Uint8Array): Buffer {
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
