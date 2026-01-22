import { expect, test } from 'vitest';
import { nearToYocto, yoctoToNear } from '../../../src/index.js';
import type { BigintString, NumericString } from '../../../src/units/types.js';

test.each<[bigint | BigintString, NumericString]>([
    [999999998999999999837087887000n, '999999.998999999999837087887'],
    [999998999999999837087887100n, '999.9989999999998370878871'],
    [5300000000000000000000000n, '5.3'],
    [5000000000000000000000000n, '5'],
    [8999999999837087887n, '0.000008999999999837087887'],
    [1000000000n, '0.000000000000001'],
    [1n, '0.000000000000000000000001'],
    [0n, '0'],
])('yoctoToNear($0) returns $1', (yocto, near) => {
    expect(nearToYocto(yoctoToNear(yocto))).toBe(yocto);
    expect(yoctoToNear(nearToYocto(near))).toBe(near);
});
