# NEAR JavaScript API

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fnear%2Fnear-api-js%2Fbadge&style=flat&label=Build)](https://actions-badge.atrox.dev/near/near-api-js/goto)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/near/near-api-js) 

NEAR JavaScript API is a complete library to interact with the NEAR blockchain. You can use it in the browser, or in Node.js runtime.

## Documentation

- [Learn how to use](https://docs.near.org/tools/near-api) the library in your project

- Read the [TypeDoc API](https://near.github.io/near-api-js/) documentation

- [Cookbook](./packages/cookbook) with common use cases

- To quickly get started with integrating NEAR in a _web browser_, read our [Web Frontend integration](https://docs.near.org/develop/integrate/frontend) article.

## Contribute to this library

1. Install dependencies

       pnpm install

2. Run continuous build with:

       pnpm -r compile -w

### Publish

Prepare `dist` version by running:

    pnpm dist

### Integration Test

Start the node by following instructions from [nearcore](https://github.com/nearprotocol/nearcore), then

    pnpm test

Tests use sample contract from `near-hello` npm package, see https://github.com/nearprotocol/near-hello

### E2E Test

From the root directory, run the following commands:

```
cd e2e
pnpm install --ignore-workspace
pnpm test
```

The `--ignore-workspace` flag is required because the `e2e` project is intentionally excluded from the workspace.
This setup ensures that packages are installed just like a real application would — as standalone builds. Workspace linking would not allow this, as it forces symlinks instead of proper package installations.

### Update error schema

Follow next steps:

1. [Optionally, set a specific hash for the commit with errors in the nearcore](https://github.com/near/near-api-js/blob/master/packages/utils/fetch_error_schema.js#L4-L5)
2. Fetch new schema: `node fetch_error_schema.js`
3. `pnpm build` and `pnpm test` to check tests still work
4. `pnpm changeset` to generate a changeset with a minor bump for the @near-js/utils package
5. commit all changes and submit a PR on GitHub

## Packages

![Package Architecture in Onion Diagram](./docs/package-architecture.png)
<!-- https://www.figma.com/file/TzAPceViAbYW6A6KAuEMCe/NAJ-packages?t=N9nlkGBoAx9FYxoN-1 -->

- [accounts](https://github.com/near/near-api-js/tree/master/packages/accounts) account creation & management
- [crypto](https://github.com/near/near-api-js/tree/master/packages/crypto) cryptographic key pairs & signing
- [keystores](https://github.com/near/near-api-js/tree/master/packages/keystores) general-purpose key persistence & management
- [keystores-browser](https://github.com/near/near-api-js/tree/master/packages/keystores-browser) browser keystores
- [keystores-node](https://github.com/near/near-api-js/tree/master/packages/keystores-node) NodeJS keystores
- [providers](https://github.com/near/near-api-js/tree/master/packages/providers) RPC interaction
- [transactions](https://github.com/near/near-api-js/tree/master/packages/transactions) transaction composition & signing
- [types](https://github.com/near/near-api-js/tree/master/packages/types) common types
- [utils](https://github.com/near/near-api-js/tree/master/packages/utils) common methods
- [wallet-account](https://github.com/near/near-api-js/tree/master/packages/wallet-account) accounts in browser-based wallets

## Example Templates

To help you get started quickly, we have prepared example templates for popular frameworks:

- [React Template](https://github.com/LimeChain/nearjs-react-app)
- [Nuxt.js Template](https://github.com/near/near-api-js-template-nuxt)
- [Angular Template](https://github.com/near/near-api-js-template-angular)

## License

This repository is distributed under the terms of both the MIT license and the Apache License (Version 2.0).
See [LICENSE](LICENSE) and [LICENSE-APACHE](LICENSE-APACHE) for details.
