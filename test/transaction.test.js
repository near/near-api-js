const { functionCall } = require('../lib/transaction');
const BN = require('bn.js');

test('functionCall with already serialized args', () => {
    const serializedArgs = Buffer.from('{}');
    const action = functionCall('methodName', serializedArgs, new BN(1), new BN(2));    
    expect(action).toMatchObject({ 
        functionCall: {
            methodName: 'methodName',
            args: serializedArgs,
            gas: new BN(1),
            deposit: new BN(2)
        }
    });
});

test('functionCall with non-serialized args', () => {
    const serializedArgs = Buffer.from('{}');
    const action = functionCall('methodName', {}, new BN(1), new BN(2));    
    expect(action).toMatchObject({ 
        functionCall: {
            methodName: 'methodName',
            args: serializedArgs,
            gas: new BN(1),
            deposit: new BN(2)
        }
    });
});