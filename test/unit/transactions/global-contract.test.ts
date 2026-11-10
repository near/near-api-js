import { serialize } from 'borsh';
import { expect, test } from 'vitest';
import { actions, baseEncode, SCHEMA } from '../../../src/index.js';

test.each([0, 34, 255])('global contract hash formats encode identical actions (byte %i)', (byte) => {
    const hash = new Uint8Array(32).fill(byte);
    const hex = Buffer.from(hash).toString('hex');
    for (const codeHash of [baseEncode(hash), hex, hex.toUpperCase(), hash]) {
        const action = actions.useGlobalContract({ codeHash });
        // Action::UseGlobalContract = 10; GlobalContractIdentifier::CodeHash = 0.
        expect(serialize(SCHEMA.Action, action)).toEqual(new Uint8Array([10, 0, ...hash]));
    }
});

test('global contract account-ID identifiers retain their encoding', () => {
    const accountId = 'publisher.near';
    expect(serialize(SCHEMA.Action, actions.useGlobalContract({ accountId }))).toEqual(
        new Uint8Array([10, 1, accountId.length, 0, 0, 0, ...new TextEncoder().encode(accountId)])
    );
});
