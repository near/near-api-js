import { expect, test } from '@jest/globals';
import { actionCreators } from '../../src';

const { functionCall } = actionCreators;

test('functionCall with already serialized args', () => {
    const serializedArgs = Buffer.from('{key: value}');
    const action = functionCall({ methodName: 'methodName', args: serializedArgs, gas: 1n, deposit: 2n });
    expect(action).toMatchObject({
        functionCall: {
            methodName: 'methodName',
            args: serializedArgs,
            gas: 1n,
            deposit: 2n
        }
    });
});

test('functionCall with non-serialized args', () => {
    const serializedArgs = Buffer.from(JSON.stringify({ key: 'value' }));
    const action = functionCall({ methodName: 'methodName', args: { key: 'value' }, gas: 1n, deposit: 2n });
    expect(action).toMatchObject({
        functionCall: {
            methodName: 'methodName',
            args: serializedArgs,
            gas: 1n,
            deposit: 2n
        }
    });
});
