const { actionCreators } = require('../lib');

const { functionCall } = actionCreators;

test('functionCall with already serialized args', () => {
    const serializedArgs = Buffer.from('{}');
    const action = functionCall('methodName', serializedArgs, BigInt(1), BigInt(2));    
    expect(action).toMatchObject({ 
        functionCall: {
            methodName: 'methodName',
            args: serializedArgs,
            gas: BigInt(1),
            deposit: BigInt(2)
        }
    });
});

test('functionCall with non-serialized args', () => {
    const serializedArgs = Buffer.from('{}');
    const action = functionCall('methodName', {}, BigInt(1), BigInt(2));    
    expect(action).toMatchObject({ 
        functionCall: {
            methodName: 'methodName',
            args: serializedArgs,
            gas: BigInt(1),
            deposit: BigInt(2)
        }
    });
});
