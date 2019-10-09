# nearlib

[![Build Status](https://gitlab.com/near-protocol/nearlib/badges/master/pipeline.svg)](https://gitlab.com/near-protocol/nearlib/pipelines)

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
