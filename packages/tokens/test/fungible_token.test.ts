import { expect, test } from '@jest/globals';
import { FungibleToken } from '../src';

const FT = new FungibleToken('ft.testnet', { decimals: 6, symbol: 'TEST', name: 'Test Token' });

test('test props are accessible', () => {
    expect(FT.accountId).toBe('ft.testnet');

    expect(FT.metadata.decimals).toBe(6);
    expect(FT.metadata.symbol).toBe('TEST');
});

test('test toUnits parses formatted amount', () => {
    expect(FT.toUnits('1.234')).toBe(BigInt('1234000'));
    expect(FT.toUnits(1.234)).toBe(BigInt('1234000'));

    expect(FT.toUnits('1.234567')).toBe(BigInt('1234567'));
    expect(FT.toUnits(1.234567)).toBe(BigInt('1234567'));

    // exceeds the precision, rounding down
    expect(FT.toUnits('1.2345678')).toBe(BigInt('1234567'));
    expect(FT.toUnits(1.2345678)).toBe(BigInt('1234567'));

    expect(FT.toUnits('1')).toBe(BigInt('1000000'));
    expect(FT.toUnits(1)).toBe(BigInt('1000000'));

    expect(FT.toUnits('00001.234')).toBe(BigInt('1234000'));

    expect(FT.toUnits('0000000000000.576919')).toBe(BigInt('576919'));

    // exceeds the precision, rounding down
    expect(FT.toUnits('0000000000000.5769191111')).toBe(BigInt('576919'));
    expect(FT.toUnits('.5769191111')).toBe(BigInt('576919'));

    expect(FT.toUnits('0')).toBe(BigInt('0'));
});

test('test toUnits parses formatted amount with comma', () => {
    expect(FT.toUnits('1,234')).toBe(BigInt('1234000'));
    expect(FT.toUnits('1,234567')).toBe(BigInt('1234567'));
    // exceeds the precision, rounding down
    expect(FT.toUnits('1,2345678')).toBe(BigInt('1234567'));
    expect(FT.toUnits('00001,234')).toBe(BigInt('1234000'));
    expect(FT.toUnits('0000000000000,576919')).toBe(BigInt('576919'));
    // exceeds the precision, rounding down
    expect(FT.toUnits('0000000000000,5769191111')).toBe(BigInt('576919'));
});

test('test toUnits fails on precision of more than 24 decimals', () => {
    // there's 25 ones after the point
    expect(() => FT.toUnits('0.1111111111111111111111111')).toThrow();
});

test('test toUnits fails on invalid numeric string', () => {
    expect(() => FT.toUnits('2.1.3')).toThrow();
});

test('test toUnits fails on non-numeric symbols', () => {
    expect(() => FT.toUnits('1.24n')).toThrow();

    expect(() => FT.toUnits('abc192.31')).toThrow();

    expect(() => FT.toUnits('abcdefg')).toThrow();
});

test('test toDecimal formats units', () => {
    expect(FT.toDecimal('1000000')).toBe('1');
    expect(FT.toDecimal(1_000_000)).toBe('1');
    expect(FT.toDecimal(BigInt(1_000_000))).toBe('1');

    expect(FT.toDecimal('1000001')).toBe('1.000001');
    expect(FT.toDecimal(1_000_001)).toBe('1.000001');
    expect(FT.toDecimal(BigInt(1_000_001))).toBe('1.000001');

    expect(FT.toDecimal('1234567')).toBe('1.234567');
    expect(FT.toDecimal(1_234_567)).toBe('1.234567');
    expect(FT.toDecimal(BigInt(1_234_567))).toBe('1.234567');

    expect(FT.toDecimal('12345678')).toBe('12.345678');
    expect(FT.toDecimal(12_345_678)).toBe('12.345678');
    expect(FT.toDecimal(BigInt(12_345_678))).toBe('12.345678');

    expect(FT.toDecimal('710')).toBe('0.00071');
    expect(FT.toDecimal(710)).toBe('0.00071');
    expect(FT.toDecimal(BigInt(710))).toBe('0.00071');

    expect(FT.toDecimal('1')).toBe('0.000001');
    expect(FT.toDecimal(1)).toBe('0.000001');
    expect(FT.toDecimal(BigInt(1))).toBe('0.000001');

    expect(FT.toDecimal('0')).toBe('0');
    expect(FT.toDecimal(0)).toBe('0');
    expect(FT.toDecimal(BigInt(0))).toBe('0');
});

test('test toDecimal fails on non-integer units', () => {
    expect(() => FT.toDecimal('0.1')).toThrow();
    expect(() => FT.toDecimal(0.1)).toThrow();
});

test('test toDecimal fails on non-numeric symbols', () => {
    expect(() => FT.toDecimal('1.24n')).toThrow();

    expect(() => FT.toDecimal('abc192.31')).toThrow();

    expect(() => FT.toDecimal('abcdefg')).toThrow();
});
