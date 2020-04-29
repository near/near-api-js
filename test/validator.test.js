
const nearApi = require('../lib/index');
const BN = require('bn.js');

test('find seat price', async () => {
    expect(nearApi.validators.findSeatPrice(
        [{stake: '1000000'}, {stake: '1000000'}, {stake: '10'}], 10)).toEqual(new BN('200000'));
    expect(nearApi.validators.findSeatPrice(
        [{ stake: '1000000000' }, { stake: '10' }], 10)).toEqual(new BN('100000000'));
    expect(nearApi.validators.findSeatPrice(
        [{ stake: '1000000000' }], 1000000000)).toEqual(new BN('1'));
    expect(nearApi.validators.findSeatPrice(
        [{ stake: '1000' }, { stake: '1' }, { stake: '1' }, { stake: '1' }, { stake: '1' }, { stake: '1' }, { stake: '1' }, { stake: '1' }, { stake: '1' }], 1)).toEqual(new BN('1000'));
    expect(() => { nearApi.validators.findSeatPrice(
        [{ stake: '1' }, { stake: '1' }, { stake: '2' }], 100); }).toThrow();
});

test('diff validators', async () => {
    expect(nearApi.validators.diffEpochValidators(
        [{account_id: 'x', stake: '10'}],
        [{ account_id: 'x', stake: '10' }]
    )).toEqual({newValidators: [], removedValidators: [], changedValidators: []});
    expect(nearApi.validators.diffEpochValidators(
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