import { beforeAll, describe, expect, test } from '@jest/globals';
import {
    GUESTBOOK_CONTRACT_ID,
    GUESTBOOK_CONTRACT_STATE,
    loadGuestBookContractCode,
} from './test-utils';
import { Runtime } from '../src/local-view-execution/runtime';

let contractCode;
const blockHeight = 1;
const blockTimestamp = Math.floor(Date.now() * 1000000);
const contractState = GUESTBOOK_CONTRACT_STATE;

const parse = (result) => JSON.parse(Buffer.from(result).toString());

const newRuntime = (methodArgs = {}) => {
    return new Runtime({
        contractId: GUESTBOOK_CONTRACT_ID,
        contractCode,
        contractState,
        blockHeight,
        blockTimestamp,
        methodArgs: JSON.stringify(methodArgs),
    });
};

describe('Local View Execution - Runtime', () => {
    beforeAll(async () => {
        contractCode = await loadGuestBookContractCode();
    });

    test('execute total_messages function in WASM runtime', async () => {
        const methodName = 'total_messages';
        const methodArgs = {};

        const runtime = newRuntime(methodArgs);

        const { result } = await runtime.execute(methodName);

        expect(parse(result)).toBe(2);
    });

    test('execute get_messages(0, 1) function in WASM runtime', async () => {
        const methodName = 'get_messages';
        const methodArgs = { from_index: 0, limit: 1 };

        const runtime = newRuntime(methodArgs);

        const { result } = await runtime.execute(methodName);
        const expected = contractState[1].value; // '{\'premium\':true,\'sender\':\'dev-1688987398360-47112266275867\',\'text\':\'a message\'}'

        expect(parse(result)).toEqual([parse(expected)]);
    });

    test('executes get_messages(0, 10) function in WASM runtime', async () => {
        const methodName = 'get_messages';
        const methodArgs = { from_index: 0, limit: 10 };

        const runtime = newRuntime(methodArgs);

        const { result } = await runtime.execute(methodName);

        expect(parse(result)).toEqual([
            parse(contractState[1].value),
            parse(contractState[2].value),
        ]);
    });

    test('executes get_messages(1, 1) function in WASM runtime', async () => {
        const methodName = 'get_messages';
        const methodArgs = { from_index: 1, limit: 1 };

        const runtime = newRuntime(methodArgs);

        const { result } = await runtime.execute(methodName);

        expect(parse(result)).toEqual([parse(contractState[2].value)]);
    });

    test('executes get_messages({}) function with ignored args in WASM runtime', async () => {
        const methodName = 'get_messages';
        const methodArgs = { fromInde: 0, Limit: 1 };

        const runtime = newRuntime(methodArgs);

        const { result } = await runtime.execute(methodName);

        expect(parse(result)).toEqual([
            parse(contractState[1].value),
            parse(contractState[2].value),
        ]);
    });

    test('throws UnknownContractMethodError on non-existing function from WASM runtime', async () => {
        const methodName = 'unknown_method';
        const methodArgs = { from_index: 1, limit: 1 };

        const runtime = newRuntime(methodArgs);

        await expect(runtime.execute(methodName)).rejects.toThrow();
    });
});
