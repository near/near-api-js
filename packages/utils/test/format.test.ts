import { expect, test } from 'bun:test';
import { formatNearAmount, NEAR_NOMINATION, parseNearAmount } from '../src/index.js';

type FormatCase = { balance: string; fracDigits?: number; expected: string };
type ParseCase = { amt: string | null; expected: string | null };

const formatCases: FormatCase[] = [
    { balance: '8999999999837087887', fracDigits: undefined, expected: '0.000008999999999837087887' },
    { balance: '8099099999837087887', fracDigits: undefined, expected: '0.000008099099999837087887' },
    { balance: '999998999999999837087887000', fracDigits: undefined, expected: '999.998999999999837087887' },
    { balance: '1' + '0'.repeat(13), fracDigits: undefined, expected: '0.00000000001' },
    { balance: '9999989999999998370878870000000', fracDigits: undefined, expected: '9,999,989.99999999837087887' },
    { balance: '000000000000000000000000', fracDigits: undefined, expected: '0' },
    { balance: '1000000000000000000000000', fracDigits: undefined, expected: '1' },
    { balance: '999999999999999999000000', fracDigits: undefined, expected: '0.999999999999999999' },
    { balance: '999999999999999999000000', fracDigits: 10, expected: '1' },
    { balance: '1003000000000000000000000', fracDigits: 3, expected: '1.003' },
    { balance: '3000000000000000000000', fracDigits: 3, expected: '0.003' },
    { balance: '3000000000000000000000', fracDigits: 4, expected: '0.003' },
    { balance: '3500000000000000000000', fracDigits: 3, expected: '0.004' },
    { balance: '03500000000000000000000', fracDigits: 3, expected: '0.004' },
    { balance: '10000000999999997410000000', fracDigits: undefined, expected: '10.00000099999999741' },
    { balance: '10100000999999997410000000', fracDigits: undefined, expected: '10.10000099999999741' },
    { balance: '10040000999999997410000000', fracDigits: 2, expected: '10.04' },
    { balance: '10999000999999997410000000', fracDigits: 2, expected: '11' },
    { balance: '1000000100000000000000000000000', fracDigits: undefined, expected: '1,000,000.1' },
    { balance: '1000100000000000000000000000000', fracDigits: undefined, expected: '1,000,100' },
    { balance: '910000000000000000000000', fracDigits: 0, expected: '1' },
];

for (const { balance, fracDigits, expected } of formatCases) {
    const labelFrac = fracDigits === undefined ? 'undefined' : fracDigits;
    test(`formatNearAmount(${balance}, ${labelFrac}) returns ${expected}`, () => {
        expect(formatNearAmount(balance, fracDigits)).toEqual(expected);
    });
}

const parseCases: ParseCase[] = [
    { amt: null, expected: null },
    { amt: '5.3', expected: '5300000000000000000000000' },
    { amt: '5', expected: '5000000000000000000000000' },
    { amt: '1', expected: '1000000000000000000000000' },
    { amt: '10', expected: '10000000000000000000000000' },
    { amt: '0.000008999999999837087887', expected: '8999999999837087887' },
    { amt: '0.000008099099999837087887', expected: '8099099999837087887' },
    { amt: '999.998999999999837087887000', expected: '999998999999999837087887000' },
    { amt: '0.000000000000001', expected: '1000000000' },
    { amt: '0', expected: '0' },
    { amt: '0.000', expected: '0' },
    { amt: '0.000001', expected: '1000000000000000000' },
    { amt: '.000001', expected: '1000000000000000000' },
    { amt: '000000.000001', expected: '1000000000000000000' },
    { amt: '1,000,000.1', expected: '1000000100000000000000000000000' },
];

for (const { amt, expected } of parseCases) {
    test(`parseNearAmount(${amt}) returns ${expected}`, () => {
        expect(parseNearAmount(amt as any)).toStrictEqual(expected);
    });
}

test('parseNearAmount fails when parsing values with ≥25 decimal places', () => {
    expect(() => {
        parseNearAmount('0.0000080990999998370878871');
    }).toThrowError(
        'Cannot parse \'0.0000080990999998370878871\' as NEAR amount'
    );
});

test('NEAR_NOMINATION value', () => {
    expect(NEAR_NOMINATION).toEqual(1000000000000000000000000n);
});
