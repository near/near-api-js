NEAR JavaScript API is a backend-focused library to interact with the NEAR blockchain.

## Educational Resources

- Read the [NEAR API docs](https://docs.near.org/tools/near-api)

- See our [API Examples](https://github.com/near-examples/near-api-examples) with common use cases

## Relevant Classes

- [`Account`](https://near.github.io/near-api-js/classes/accounts_account.Account.html): Inspect account data and execute on-chain actions
- [`Signer`s](https://near.github.io/near-api-js/modules/signers.html): Sign transactions and messages
- [`Provider`s](https://near.github.io/near-api-js/modules/providers.html): Connect to NEAR nodes via JSON-RPC
- [`KeyPair`s](https://near.github.io/near-api-js/classes/crypto_key_pair.KeyPair.html): Create and manage public/private key pairs


## Useful Helpers
- `near-api-js` exports functions to convert between:
    - `nearToYocto` / `yoctoToNear`
    - `teraToGas` / `gigaToGas`
- Easily handle FT / NFT with [`near-api-js/tokens`](https://near.github.io/near-api-js/modules/tokens.html)
- Sign and verify NEP-413 messages with [`near-api-js/nep413`](https://near.github.io/near-api-js/modules/nep413.html)