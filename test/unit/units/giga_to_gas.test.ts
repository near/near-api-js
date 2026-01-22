import { expect, test } from 'vitest';
import { gigaToGas } from '../../../src/index.js';
import type { NumericString } from '../../../src/units/types.js';

test.each<[NumericString | number, bigint]>([
    ['300000', 300000000000000n],
    ['999.998999999', 999998999999n],
    ['300', 300000000000n],
    ['30', 30000000000n],
    ['5.3', 5300000000n],
    ['5', 5000000000n],
    ['0.008999999', 8999999n],
    ['0', 0n],
    ['000', 0n],
    ['000.5', 500000000n],
    [300, 300000000000n],
    [30, 30000000000n],
    [5.3, 5300000000n],
    [5, 5000000000n],
    [0, 0n],
])('gigaToGas($0) returns $1', (near, yocto) => {
    expect(gigaToGas(near)).toBe(yocto);
});

test(`gigaToGas throws on empty string`, () => {
    expect(() => gigaToGas(' ')).toThrowError('Amount cannot be empty');
});

test(`gigaToGas throws on amount with more than 9 decimals`, () => {
    expect(() => gigaToGas('0.0000000001')).toThrowError(`Cannot parse '0.0000000001'`);
});

test(`gigaToGas throws on non-numeric input`, () => {
    expect(() => gigaToGas('abc' as any)).toThrowError();
    expect(() => gigaToGas('100%' as any)).toThrowError();
    expect(() => gigaToGas('5.1a3' as any)).toThrowError();
});
