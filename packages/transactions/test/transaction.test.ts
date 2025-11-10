import { expect, test } from 'bun:test';
import { actionCreators } from '../src/index.js';

const { functionCall } = actionCreators;

test('functionCall with already serialized args', () => {
    const serializedArgs = Buffer.from('{key: value}');
    const action = functionCall('methodName', serializedArgs, 1n, 2n);
    expect(action).toMatchObject({
        functionCall: {
            methodName: 'methodName',
            args: serializedArgs,
            gas: 1n,
            deposit: 2n,
        },
    });
});

test('functionCall with non-serialized args', () => {
    const serializedArgs = Buffer.from(JSON.stringify({ key: 'value' }));
    const action = functionCall('methodName', { key: 'value' }, 1n, 2n);
    expect(action).toMatchObject({
        functionCall: {
            methodName: 'methodName',
            args: serializedArgs,
            gas: 1n,
            deposit: 2n,
        },
    });
});
