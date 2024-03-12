import bs58 from 'bs58';
import { sha256 } from 'js-sha256';
import {
    LightClientBlockLiteView,
} from '@near-js/types';
import BN from 'bn.js';
import { serialize } from 'borsh';
import { BorshBlockHeaderInnerLite, SCHEMA } from './borsh';

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
