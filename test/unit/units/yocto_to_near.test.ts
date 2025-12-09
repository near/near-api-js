import { expect, test } from 'vitest';
import { yoctoToNear } from '../../../src';
import type { BigintString, NumericString } from '../../../src/units/types';

test.each<[bigint | BigintString, NumericString]>([
    [999999998999999999837087887000n, '999999.998999999999837087887'],
    [999998999999999837087887000n, '999.998999999999837087887'],
    [5300000000000000000000000n, '5.3'],
    [5000000000000000000000000n, '5'],
    [8999999999837087887n, '0.000008999999999837087887'],
    [1000000000n, '0.000000000000001'],
    [1n, '0.000000000000000000000001'],
    [0n, '0'],
])('yoctoToNear($0) returns $1', (yocto, near) => {
    expect(yoctoToNear(yocto)).toBe(near);
});

test.each<[bigint | BigintString, number, NumericString]>([
    [999999998999999999837087887000n, 3, '999999.998'],
    [999111999999999837087887000n, 3, '999.111'],
    [999111999999999837087887000n, 3.87, '999.111'],
    [999998999999999837087887000n, 6, '999.998999'],
    [5300000000000000000000000n, 0, '5'],
    [5300000000000000000000000n, 1, '5.3'],
    [5300000000000000000000000n, 3, '5.3'],
    [5300000000000000000000000n, 6, '5.3'],
    [8999999999837087887n, 3, '0'],
    [8999999999837087887n, 6, '0.000008'],
    [8999999999837087887n, 9, '0.000008999'],
    [8999999999837087887n, 24, '0.000008999999999837087887'],
    [0n, 0, '0'],
    [0n, 9, '0'],
    [0n, 24, '0'],
])('yoctoToNear($0, $1) returns $2', (yocto, decimals, near) => {
    expect(yoctoToNear(yocto, decimals)).toBe(near);
});

test('yoctoToNear throws on integer decimals places not in range [0, 24]', () => {
    expect(() => yoctoToNear(1000000000n, -1)).toThrowError('Decimal places argument must be between 0 and 24');
    expect(() => yoctoToNear(1000000000n, -1_000)).toThrowError('Decimal places argument must be between 0 and 24');
    expect(() => yoctoToNear(1000000000n, 25)).toThrowError('Decimal places argument must be between 0 and 24');
    expect(() => yoctoToNear(1000000000n, 1_000)).toThrowError('Decimal places argument must be between 0 and 24');
});

test('yoctoToNear throws on non-integer input', () => {
    expect(() => yoctoToNear(1.15 as any)).toThrowError();
    expect(() => yoctoToNear('abc' as any)).toThrowError();
    expect(() => yoctoToNear('100000000%' as any)).toThrowError();
    expect(() => yoctoToNear('51828e-24' as any)).toThrowError();
});

test('yoctoToNear treats float decimals as floor integers', () => {
    expect(yoctoToNear(999111999999999837087887000n, 3)).toBe('999.111');
    expect(yoctoToNear(999111999999999837087887000n, 3.14)).toBe('999.111');
    expect(yoctoToNear(999111999999999837087887000n, 3.986)).toBe('999.111');

    expect(yoctoToNear(999111999999999837087887000n, 4)).toBe('999.1119');
    expect(yoctoToNear(999111999999999837087887000n, 4.001)).toBe('999.1119');
    expect(yoctoToNear(999111999999999837087887000n, 4.999)).toBe('999.1119');
});
