import { expect, test } from 'vitest';
import { teraToGas } from '../../../src/index.js';
import type { NumericString } from '../../../src/units/types.js';

test.each<[NumericString | number, bigint]>([
    ['999.998999999999', 999998999999999n],
    ['300', 300000000000000n],
    ['30', 30000000000000n],
    ['5.3', 5300000000000n],
    ['5', 5000000000000n],
    ['0.000008999999', 8999999n],
    ['0', 0n],
    ['000', 0n],
    ['000.5', 500000000000n],
    [300, 300000000000000n],
    [30, 30000000000000n],
    [5.3, 5300000000000n],
    [5, 5000000000000n],
    [0, 0n],
])('teraToGas($0) returns $1', (near, yocto) => {
    expect(teraToGas(near)).toBe(yocto);
});

test(`teraToGas throws on empty string`, () => {
    expect(() => teraToGas(' ')).toThrowError('Amount cannot be empty');
});

test(`teraToGas throws on amount with more than 12 decimals`, () => {
    expect(() => teraToGas('0.0000000000001')).toThrowError(`Cannot parse '0.0000000000001'`);
});

test(`teraToGas throws on non-numeric input`, () => {
    expect(() => teraToGas('abc' as any)).toThrowError();
    expect(() => teraToGas('100%' as any)).toThrowError();
    expect(() => teraToGas('5.1a3' as any)).toThrowError();
});
