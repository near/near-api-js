import { expect, test } from 'vitest';
import { nearToYocto } from '../../../src';
import type { NumericString } from '../../../src/units/types';

test.each<[NumericString | number, bigint]>([
    ['999999.998999999999837087887', 999999998999999999837087887000n],
    ['999.998999999999837087887', 999998999999999837087887000n],
    ['5.3', 5300000000000000000000000n],
    ['5', 5000000000000000000000000n],
    ['0.000008999999999837087887', 8999999999837087887n],
    ['0.000000000000001', 1000000000n],
    ['0.000000000000000000000001', 1n],
    ['0', 0n],
    ['000', 0n],
    ['000.5', 500000000000000000000000n],
    [999.998999999999, 999998999999999000000000000n],
    [5.3, 5300000000000000000000000n],
    [5, 5000000000000000000000000n],
    [10.04, 10040000000000000000000000n],
])('nearToYocto($0) returns $1', (near, yocto) => {
    expect(nearToYocto(near)).toBe(yocto);
});

test(`nearToYocto throws on empty string`, () => {
    expect(() => nearToYocto(' ')).toThrowError('Amount cannot be empty');
});

test(`nearToYocto throws on amount with more than 24 decimals`, () => {
    expect(() => nearToYocto('0.0000000000000000000000001')).toThrowError(
        `Cannot parse '0.0000000000000000000000001' as NEAR amount`
    );
});

test(`nearToYocto throws on non-numeric input`, () => {
    expect(() => nearToYocto('abc' as any)).toThrowError();
    expect(() => nearToYocto('100%' as any)).toThrowError();
    expect(() => nearToYocto('5.1a3' as any)).toThrowError();
});
