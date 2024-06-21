import { expect, test } from '@jest/globals';
import { actionCreators } from '../src';

const { functionCall } = actionCreators;

test('functionCall with already serialized args', () => {
    const serializedArgs = Buffer.from('{}');
    const action = functionCall('methodName', serializedArgs, 1n, 2n);    
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
    const serializedArgs = Buffer.from('{}');
    const action = functionCall('methodName', {}, 1n, 2n);    
    expect(action).toMatchObject({ 
        functionCall: {
            methodName: 'methodName',
            args: serializedArgs,
            gas: 1n,
            deposit: 2n
        }
    });
});
