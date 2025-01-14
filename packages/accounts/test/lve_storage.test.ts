import { beforeAll, describe, expect, test } from '@jest/globals';
import { sha256 } from '@noble/hashes/sha256';
import { Storage } from '../src/local-view-execution/storage';
import {
    GUESTBOOK_CONTRACT_STATE,
    loadGuestBookContractCode,
} from './test-utils';

let contractCode;
const contractState = GUESTBOOK_CONTRACT_STATE;
const blockHash = 'G2DF9Pe4KegQK7PkcxDu5cxakvcy99zgrFZEadRCxrwF';

const blockHeight = 1;
const blockTimestamp = Math.floor(Date.now() * 1000000);

const createBlockHash = (data) => Buffer.from(sha256(JSON.stringify(data))).toString('base64');

describe('Local View Execution - Storage', () => {
    beforeAll(async () => {
        contractCode = await loadGuestBookContractCode();
    });

    test('load empty cached data', async () => {
        const storage = new Storage();

        // @ts-expect-error test input
        const data = storage.load({});

        expect(data).toBe(undefined);
    });

    test('load empty cached data by block hash', async () => {
        const storage = new Storage();

        const data = storage.load({ blockId: blockHash });

        expect(data).toBe(undefined);
    });

    test('load empty cached data by block height', async () => {
        const storage = new Storage();

        const data = storage.load({ blockId: blockHeight });

        expect(data).toBe(undefined);
    });

    test('save & load cached data by block height', async () => {
        const storage = new Storage();
        const data = {
            blockHeight,
            blockTimestamp,
            contractCode,
            contractState,
        };

        storage.save(blockHash, data);

        const stored = storage.load({ blockId: blockHeight });

        expect(stored).toEqual(data);
    });

    test('save & load cached data by block hash', async () => {
        const storage = new Storage();
        const data = {
            blockHeight,
            blockTimestamp,
            contractCode,
            contractState,
        };

        storage.save(blockHash, data);

        const stored = storage.load({ blockId: blockHash });

        expect(stored).toEqual(data);
    });

    test('overwrite the less-recently used value', async () => {
        const storage = new Storage({ max: 2 });

        const data = {
            blockHeight,
            blockTimestamp,
            contractCode,
            contractState,
        };

        const firstData = { ...data, blockHeight: 0 };
        const secondData = { ...data, blockHeight: 1 };
        const newData = { ...data, blockHeight: 2 };

        storage.save(createBlockHash(firstData), firstData);
        storage.save(createBlockHash(secondData), secondData);

        // the less-recently used value
        expect(storage.load({ blockId: 0 })).toEqual(firstData);
        expect(storage.load({ blockId: 1 })).toEqual(secondData);

        storage.save(createBlockHash(newData), newData);

        expect(storage.load({ blockId: 0 })).toBe(undefined);
        expect(storage.load({ blockId: 1 })).toEqual(secondData);
        expect(storage.load({ blockId: 2 })).toEqual(newData);
    });
});
