# @near-js/providers

A collection of classes, functions, and types for communicating with the NEAR blockchain directly. For use with both client- and server-side JavaScript execution contexts.

## Modules

- [Provider](https://github.com/near/near-api-js/blob/master/packages/providers/src/provider.ts) abstract class for interacting with NEAR RPC
- [JsonRpcProvider](https://github.com/near/near-api-js/blob/master/packages/providers/src/json-rpc-provider.ts) implementation of `Provider` for [JSON-RPC](https://www.jsonrpc.org/)
- [fetch](https://github.com/near/near-api-js/blob/master/packages/providers/src/fetch.ts) NodeJS `fetch` implementation
- [fetchJson](https://github.com/near/near-api-js/blob/master/packages/providers/src/fetch_json.ts) low-level function for fetching and parsing RPC data

# License

This repository is distributed under the terms of both the MIT license and the Apache License (Version 2.0).
See [LICENSE](https://github.com/near/near-api-js/blob/master/LICENSE) and [LICENSE-APACHE](https://github.com/near/near-api-js/blob/master/LICENSE-APACHE) for details.
