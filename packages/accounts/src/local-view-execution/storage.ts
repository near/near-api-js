import type { BlockHash, BlockReference } from '@near-js/types';
import * as LRU from 'lru_map';
import type { ContractState } from './types.js';

export interface StorageData {
    blockHeight: number;
    blockTimestamp: number;
    contractCode: string;
    contractState: ContractState;
}

export interface StorageOptions {
    max: number;
}

export class Storage {
    private readonly cache: LRU.LRUMap<string | number, any>;

    private static MAX_ELEMENTS = 100;

    // map block hash to block height
    private blockHeights: Map<string, number>;

    constructor(options: StorageOptions = { max: Storage.MAX_ELEMENTS }) {
        this.cache = new LRU.LRUMap(options.max);
        this.blockHeights = new Map();
    }

    public load(blockRef: BlockReference): StorageData | undefined {
        const noBlockId = !('blockId' in blockRef);

        if (noBlockId) return undefined;

        let blockId = blockRef.blockId;

        // block hash is passed, so get its corresponding block height
        if (blockId.toString().length === 44) {
            blockId = this.blockHeights.get(blockId.toString());
        }
        // get cached values for the given block height
        return this.cache.get(blockId);
    }

    public save(
        blockHash: BlockHash,
        {
            blockHeight,
            blockTimestamp,
            contractCode,
            contractState,
        }: StorageData,
    ) {
        this.blockHeights.set(blockHash, blockHeight);
        this.cache.set(blockHeight, {
            blockHeight,
            blockTimestamp,
            contractCode,
            contractState,
        });
    }
}
