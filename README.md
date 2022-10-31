# NEAR JavaScript API

[![Build Status](https://travis-ci.com/near/near-api-js.svg?branch=master)](https://travis-ci.com/near/near-api-js)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/near/near-api-js) 

NEAR JavaScript API is a complete library to interact with the NEAR blockchain. You can use it in the browser, or in Node.js runtime.

## Documentation

- [Learn how to use](https://docs.near.org/tools/near-api-js/quick-reference) the library in your project

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

### Update error schema

Follow next steps:

1. [Change hash for the commit with errors in the nearcore](https://github.com/near/near-api-js/blob/master/fetch_error_schema.js#L8-L9)
2. Fetch new schema: `node fetch_error_schema.js`
3. `pnpm build` to update `lib/**.js` files

## License

This repository is distributed under the terms of both the MIT license and the Apache License (Version 2.0).
See [LICENSE](LICENSE) and [LICENSE-APACHE](LICENSE-APACHE) for details.
