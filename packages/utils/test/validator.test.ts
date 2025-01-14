import { expect, test } from '@jest/globals';
import { diffEpochValidators, findSeatPrice } from '../src';

test('find seat price', async () => {
    expect(findSeatPrice(
        // @ts-expect-error test input
        [{ stake: '1000000' }, { stake: '1000000' }, { stake: '100' }], 2, [1, 6250], 49
    )).toEqual(101n);
    expect(findSeatPrice(
        // @ts-expect-error test input
        [{ stake: '1000000' }, { stake: '1000000' }, { stake: '100' }], 3, [1, 6250]
    )).toEqual(101n);
    expect(findSeatPrice(
        // @ts-expect-error test input
        [{ stake: '1000000' }, { stake: '1000000' }, { stake: '100' }], 4, [1, 6250], 49
    )).toEqual(320n);
    expect(findSeatPrice(
        // @ts-expect-error test input
        [{ stake: '1000000' }, { stake: '1000000' }, { stake: '100' }], 4, [1, 6250], 48
    )).toEqual(500000n);
    expect(findSeatPrice(
        // @ts-expect-error test input
        [{ stake: '1000' }, { stake: '1000' }, { stake: '200' }], 100, [1, 25]
    )).toEqual(88n);
});

test('diff validators', async () => {
    expect(diffEpochValidators(
        // @ts-expect-error test input
        [{ account_id: 'x', stake: '10' }],
        [{ account_id: 'x', stake: '10' }]
    )).toEqual({ newValidators: [], removedValidators: [], changedValidators: [] });
    expect(diffEpochValidators(
        // @ts-expect-error test input
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
