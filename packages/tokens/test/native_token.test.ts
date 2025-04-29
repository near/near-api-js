import { expect, test } from '@jest/globals';
import { NearToken } from '../src';

const NEAR = new NearToken();

test('test toUnits parses formatted amount', () => {
    expect(NEAR.toUnits('1.234')).toBe(BigInt('1234000000000000000000000'));
    expect(NEAR.toUnits(1.234)).toBe(BigInt('1234000000000000000000000'));

    expect(NEAR.toUnits('1.234567')).toBe(BigInt('1234567000000000000000000'));
    expect(NEAR.toUnits(1.234567)).toBe(BigInt('1234567000000000000000000'));

    expect(NEAR.toUnits('1')).toBe(BigInt('1000000000000000000000000'));
    expect(NEAR.toUnits(1)).toBe(BigInt('1000000000000000000000000'));

    expect(NEAR.toUnits('00001.234')).toBe(BigInt('1234000000000000000000000'));

    expect(NEAR.toUnits('0000000000000.576919')).toBe(
        BigInt('576919000000000000000000')
    );

    // exceeds the precision, rounding down
    expect(NEAR.toUnits('0000000000000.5769191111')).toBe(
        BigInt('576919111100000000000000')
    );
    expect(NEAR.toUnits('.5769191111')).toBe(
        BigInt('576919111100000000000000')
    );

    expect(NEAR.toUnits('0')).toBe(BigInt('0'));
});

test('test toUnits parses formatted amount with comma', () => {
    expect(NEAR.toUnits('1,234')).toBe(BigInt('1234000000000000000000000'));
    expect(NEAR.toUnits('1,234567')).toBe(BigInt('1234567000000000000000000'));

    expect(NEAR.toUnits('00001,234')).toBe(BigInt('1234000000000000000000000'));
    expect(NEAR.toUnits('0000000000000,576919')).toBe(
        BigInt('576919000000000000000000')
    );
    // exceeds the precision, rounding down
    expect(NEAR.toUnits('0000000000000,5769191111')).toBe(
        BigInt('576919111100000000000000')
    );
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

test('test toAmount formats units', () => {
    expect(NEAR.toAmount('1000000')).toBe('0.000000000000000001');
    expect(NEAR.toAmount(1_000_000)).toBe('0.000000000000000001');
    expect(NEAR.toAmount(BigInt(1_000_000))).toBe('0.000000000000000001');

    expect(NEAR.toAmount('1000001')).toBe('0.000000000000000001000001');
    expect(NEAR.toAmount(1_000_001)).toBe('0.000000000000000001000001');
    expect(NEAR.toAmount(BigInt(1_000_001))).toBe('0.000000000000000001000001');

    expect(NEAR.toAmount('1234567')).toBe('0.000000000000000001234567');
    expect(NEAR.toAmount(1_234_567)).toBe('0.000000000000000001234567');
    expect(NEAR.toAmount(BigInt(1_234_567))).toBe('0.000000000000000001234567');

    expect(NEAR.toAmount('12345678')).toBe('0.000000000000000012345678');
    expect(NEAR.toAmount(12_345_678)).toBe('0.000000000000000012345678');
    expect(NEAR.toAmount(BigInt(12_345_678))).toBe(
        '0.000000000000000012345678'
    );

    expect(NEAR.toAmount('710')).toBe('0.00000000000000000000071');
    expect(NEAR.toAmount(710)).toBe('0.00000000000000000000071');
    expect(NEAR.toAmount(BigInt(710))).toBe('0.00000000000000000000071');

    expect(NEAR.toAmount('1')).toBe('0.000000000000000000000001');
    expect(NEAR.toAmount(1)).toBe('0.000000000000000000000001');
    expect(NEAR.toAmount(BigInt(1))).toBe('0.000000000000000000000001');

    expect(NEAR.toAmount('0')).toBe('0');
    expect(NEAR.toAmount(0)).toBe('0');
    expect(NEAR.toAmount(BigInt(0))).toBe('0');
});

test('test toAmount fails on non-integer units', () => {
    expect(() => NEAR.toAmount('0.1')).toThrow();
    expect(() => NEAR.toAmount(0.1)).toThrow();
});

test('test toAmount fails on non-numeric symbols', () => {
    expect(() => NEAR.toAmount('1.24n')).toThrow();

    expect(() => NEAR.toAmount('abc192.31')).toThrow();

    expect(() => NEAR.toAmount('abcdefg')).toThrow();
});
