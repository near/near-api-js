import { expect, test } from 'bun:test';
import type {
    CurrentEpochValidatorInfo,
    NextEpochValidatorInfo,
} from '@near-js/types';
import { diffEpochValidators, findSeatPrice } from '../src/index.js';

const baseCurrentValidator: CurrentEpochValidatorInfo = {
    account_id: 'validator.test',
    public_key: 'ed25519:validator.test',
    is_slashed: false,
    stake: '0',
    shards: [],
    num_produced_blocks: 0,
    num_expected_blocks: 0,
};

const baseNextValidator: NextEpochValidatorInfo = {
    account_id: 'validator.test',
    public_key: 'ed25519:validator.test',
    stake: '0',
    shards: [],
};

const currentValidator = (
    overrides: Partial<CurrentEpochValidatorInfo> = {},
): CurrentEpochValidatorInfo => ({
    ...baseCurrentValidator,
    ...overrides,
});

const nextValidator = (
    overrides: Partial<NextEpochValidatorInfo> = {},
): NextEpochValidatorInfo => ({
    ...baseNextValidator,
    ...overrides,
});

test('find seat price', async () => {
    expect(
        findSeatPrice(
            [
                nextValidator({ stake: '1000000' }),
                nextValidator({ stake: '1000000' }),
                nextValidator({ stake: '100' }),
            ],
            2,
            [1, 6250],
            49,
        ),
    ).toEqual(101n);
    expect(
        findSeatPrice(
            // @ts-expect-error test input
            [{ stake: '1000000' }, { stake: '1000000' }, { stake: '100' }],
            3,
            [1, 6250],
        ),
    ).toEqual(101n);
    expect(
        findSeatPrice(
            // @ts-expect-error test input
            [{ stake: '1000000' }, { stake: '1000000' }, { stake: '100' }],
            4,
            [1, 6250],
            49,
        ),
    ).toEqual(320n);
    expect(
        findSeatPrice(
            [
                nextValidator({ stake: '1000000' }),
                nextValidator({ stake: '1000000' }),
                nextValidator({ stake: '100' }),
            ],
            4,
            [1, 6250],
            48,
        ),
    ).toEqual(500000n);
    expect(
        findSeatPrice(
            [
                nextValidator({ stake: '1000' }),
                nextValidator({ stake: '1000' }),
                nextValidator({ stake: '200' }),
            ],
            100,
            [1, 25],
        ),
    ).toEqual(88n);
});

test('diff validators', async () => {
    const currX = currentValidator({ account_id: 'x', stake: '10' });
    const currY = currentValidator({ account_id: 'y', stake: '10' });
    const nextX10 = nextValidator({ account_id: 'x', stake: '10' });
    const nextX11 = nextValidator({ account_id: 'x', stake: '11' });
    const nextZ = nextValidator({ account_id: 'z', stake: '11' });

    expect(diffEpochValidators([currX], [nextX10])).toEqual({
        newValidators: [],
        removedValidators: [],
        changedValidators: [],
    });
    expect(diffEpochValidators([currX, currY], [nextX11, nextZ])).toEqual({
        newValidators: [nextZ],
        removedValidators: [currY],
        changedValidators: [
            {
                current: currX,
                next: nextX11,
            },
        ],
    });
});
