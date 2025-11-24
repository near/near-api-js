import { expect, test } from 'vitest';
import { NEAR } from '../../../src';

test('test toUnits parses formatted amount', () => {
    expect(NEAR.toUnits('1.234')).toBe(BigInt('1234000000000000000000000'));
    expect(NEAR.toUnits(1.234)).toBe(BigInt('1234000000000000000000000'));

    expect(NEAR.toUnits('1.234567')).toBe(BigInt('1234567000000000000000000'));
    expect(NEAR.toUnits(1.234567)).toBe(BigInt('1234567000000000000000000'));

    expect(NEAR.toUnits('1')).toBe(BigInt('1000000000000000000000000'));
    expect(NEAR.toUnits(1)).toBe(BigInt('1000000000000000000000000'));

    expect(NEAR.toUnits('00001.234')).toBe(BigInt('1234000000000000000000000'));

    expect(NEAR.toUnits('0000000000000.576919')).toBe(BigInt('576919000000000000000000'));

    // exceeds the precision, rounding down
    expect(NEAR.toUnits('0000000000000.5769191111')).toBe(BigInt('576919111100000000000000'));
    expect(NEAR.toUnits('.5769191111')).toBe(BigInt('576919111100000000000000'));

    expect(NEAR.toUnits('0')).toBe(BigInt('0'));
});

test('test toUnits parses formatted amount with comma', () => {
    expect(NEAR.toUnits('1,234')).toBe(BigInt('1234000000000000000000000'));
    expect(NEAR.toUnits('1,234567')).toBe(BigInt('1234567000000000000000000'));

    expect(NEAR.toUnits('00001,234')).toBe(BigInt('1234000000000000000000000'));
    expect(NEAR.toUnits('0000000000000,576919')).toBe(BigInt('576919000000000000000000'));
    // exceeds the precision, rounding down
    expect(NEAR.toUnits('0000000000000,5769191111')).toBe(BigInt('576919111100000000000000'));
});

test('test toUnits fails on precision of more than 24 decimals', () => {
    // there's 25 ones after the point
    expect(() => NEAR.toUnits('0.1111111111111111111111111')).toThrow();
});

test('test toUnits fails on invalid numeric string', () => {
    expect(() => NEAR.toUnits('2.1.3')).toThrow();
});

test('test toUnits fails on non-numeric symbols', () => {
    expect(() => NEAR.toUnits('1.24n')).toThrow();

    expect(() => NEAR.toUnits('abc192.31')).toThrow();

    expect(() => NEAR.toUnits('abcdefg')).toThrow();
});

test('test toDecimal formats units', () => {
    expect(NEAR.toDecimal('1000000')).toBe('0.000000000000000001');
    expect(NEAR.toDecimal(1_000_000)).toBe('0.000000000000000001');
    expect(NEAR.toDecimal(BigInt(1_000_000))).toBe('0.000000000000000001');

    expect(NEAR.toDecimal('1000001')).toBe('0.000000000000000001000001');
    expect(NEAR.toDecimal(1_000_001)).toBe('0.000000000000000001000001');
    expect(NEAR.toDecimal(BigInt(1_000_001))).toBe('0.000000000000000001000001');

    expect(NEAR.toDecimal('1234567')).toBe('0.000000000000000001234567');
    expect(NEAR.toDecimal(1_234_567)).toBe('0.000000000000000001234567');
    expect(NEAR.toDecimal(BigInt(1_234_567))).toBe('0.000000000000000001234567');

    expect(NEAR.toDecimal('12345678')).toBe('0.000000000000000012345678');
    expect(NEAR.toDecimal(12_345_678)).toBe('0.000000000000000012345678');
    expect(NEAR.toDecimal(BigInt(12_345_678))).toBe('0.000000000000000012345678');

    expect(NEAR.toDecimal('710')).toBe('0.00000000000000000000071');
    expect(NEAR.toDecimal(710)).toBe('0.00000000000000000000071');
    expect(NEAR.toDecimal(BigInt(710))).toBe('0.00000000000000000000071');

    expect(NEAR.toDecimal('1')).toBe('0.000000000000000000000001');
    expect(NEAR.toDecimal(1)).toBe('0.000000000000000000000001');
    expect(NEAR.toDecimal(BigInt(1))).toBe('0.000000000000000000000001');

    expect(NEAR.toDecimal('0')).toBe('0');
    expect(NEAR.toDecimal(0)).toBe('0');
    expect(NEAR.toDecimal(BigInt(0))).toBe('0');
});

test('test toDecimal fails on non-integer units', () => {
    expect(() => NEAR.toDecimal('0.1')).toThrow();
    expect(() => NEAR.toDecimal(0.1)).toThrow();
});

test('test toDecimal fails on non-numeric symbols', () => {
    expect(() => NEAR.toDecimal('1.24n')).toThrow();

    expect(() => NEAR.toDecimal('abc192.31')).toThrow();

    expect(() => NEAR.toDecimal('abcdefg')).toThrow();
});
