# near-api-js

[![Build Status](https://travis-ci.com/nearprotocol/nearlib.svg?branch=master)](https://travis-ci.com/nearprotocol/near-api-js)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/nearprotocol/near-api-js) 

nearlib is a JavaScript/TypeScript library for development of DApps on NEAR platform.

## Install dependencies

```
yarn
```

## Development

You can run continuos build with next command:
```
yarn build -- -w
```

## Publish

Prepare `dist` version by running:

```
yarn dist
```

When publishing to npm use [np](https://github.com/sindresorhus/np). 

## Integration Test

Start the node by following instructions from nearcore/README.md, then
```
yarn test
```

Tests use sample contract from `near-hello` npm package, see https://github.com/nearprotocol/near-hello

## Update error messages

Follow next steps:

1. [Change hash for the commit with errors in the nearcore](https://github.com/nearprotocol/nearlib/blob/master/gen_error_types.js#L7-L9)
2. Generate new types for errors: `node gen_error_types.js`
3. `yarn lint --fix` fix any issues with linter.
4. `yarn build` to update `lib/**.js` files

