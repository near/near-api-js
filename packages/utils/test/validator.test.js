const BN = require('bn.js');

const { diffEpochValidators, findSeatPrice } = require('../lib');

test('find seat price', async () => {
    expect(findSeatPrice(
        [{stake: '1000000'}, {stake: '1000000'}, {stake: '100'}], 2, [1, 6250], 49
    )).toEqual(new BN('101'));
    expect(findSeatPrice(
        [{stake: '1000000'}, {stake: '1000000'}, {stake: '100'}], 3, [1, 6250]
    )).toEqual(new BN('101'));
    expect(findSeatPrice(
        [{stake: '1000000'}, {stake: '1000000'}, {stake: '100'}], 4, [1, 6250], 49
    )).toEqual(new BN('320'));
    expect(findSeatPrice(
        [{stake: '1000'}, {stake: '1000'}, {stake: '200'}], 100, [1, 25]
    )).toEqual(new BN('88'));
});

test('diff validators', async () => {
    expect(diffEpochValidators(
        [{account_id: 'x', stake: '10'}],
        [{ account_id: 'x', stake: '10' }]
    )).toEqual({newValidators: [], removedValidators: [], changedValidators: []});
    expect(diffEpochValidators(
        [{ account_id: 'x', stake: '10' }, { account_id: 'y', stake: '10' }],
        [{ account_id: 'x', stake: '11' }, { account_id: 'z', stake: '11' }]
    )).toEqual({
        newValidators: [{ account_id: 'z', stake: '11' }],
        removedValidators: [{ account_id: 'y', stake: '10' }],
        changedValidators: [{ 
            current: { account_id: 'x', stake: '10' },
            next: { account_id: 'x', stake: '11' }
        }]
    });
});
