import { describe, test, expect } from '@jest/globals';
import base58 from '../src/b58';

const fixtures = {
  valid: [
    { hex: '', string: '' },
    { hex: '61', string: '2g' },
    { hex: '626262', string: 'a3gV' },
    { hex: '636363', string: 'aPEr' },
    {
      hex: '73696d706c792061206c6f6e6720737472696e67',
      string: '2cFupjhnEsSn59qHXstmK2ffpLv2',
    },
    {
      hex: '00eb15231dfceb60925886b67d065299925915aeb172c06647',
      string: '1NS17iag9jJgTHD1VXjvLCEnZuQ3rJDE9L',
    },
    { hex: '516b6fcd0f', string: 'ABnLTmg' },
    { hex: 'bf4f89001e670274dd', string: '3SEo3LWLoPntC' },
    { hex: '572e4794', string: '3EFU7m' },
    { hex: 'ecac89cad93923c02321', string: 'EJDM8drfXA6uyA' },
    { hex: '10c8511e', string: 'Rt5zm' },
    { hex: '00000000000000000000', string: '1111111111' },
    {
      hex: '801184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd206ec97e',
      string: '5Hx15HFGyep2CfPxsJKe2fXJsCVn5DEiyoeGGF6JZjGbTRnqfiD',
    },
    {
      hex: '003c176e659bea0f29a3e9bf7880c112b1b31b4dc826268187',
      string: '16UjcYNBG9GTK4uq2f7yYEbuifqCzoLMGS',
    },
  ],
  invalid: [
    { description: 'non-base58 string', string: 'invalid' },
    { description: 'non-base58 alphabet', string: 'c2F0b3NoaQo=' },
    { description: 'leading whitespace', string: ' 1111111111' },
    { description: 'trailing whitespace', string: '1111111111 ' },
    {
      description: 'unexpected character after whitespace',
      string: ' \t\n\u000b\f\r skip \r\f\u000b\n\t a',
    },
  ],
};

const { encode, decode } = base58;
const { valid, invalid } = fixtures;

describe('base58', () => {
  describe('encode', () => {
    valid.forEach((f) => {
      test(`can encode ${f.hex}`, () => {
        const actual = encode(Buffer.from(f.hex, 'hex'));
        expect(actual).toBe(f.string);
      });
    });
  });

  describe('decode', () => {
    valid.forEach((f) => {
      test(`can decode ${f.string}`, () => {
        const actual = Buffer.from(decode(f.string)).toString('hex');
        expect(actual).toBe(f.hex);
      });
    });

    invalid.forEach((f) => {
      test(`throws on ${f.description}`, () => {
        expect(() => decode(f.string)).toThrow("Non-base58 character");
      });
    });
  });
});