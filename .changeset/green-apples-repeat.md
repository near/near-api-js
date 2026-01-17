---
"near-api-js": minor
---

Add `parseSeedPhrase` method, exported via the `seed-phrase` sub-path, which converts a string seed phrase into a `KeyPair`.

For example:

```ts
import { parseSeedPhrase } from 'near-api-js/seed-phrase';

const keyPair = parseSeedPhrase('tag interest match ...');

keyPair.getPublicKey().toString(); // ed25519:9uMmkWHW...
keyPair.toString(); // ed25519:3N6TYZVRrkQxh...
```