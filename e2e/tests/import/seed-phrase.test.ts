import * as seedPhrase from 'near-api-js/seed-phrase';
import { expect, test } from 'vitest';

test('import from "near-api-js/seed-phrase" exposes only certain objects', () => {
    expect(seedPhrase).toMatchInlineSnapshot(`
      {
        "parseSeedPhrase": [Function],
      }
    `);
});
