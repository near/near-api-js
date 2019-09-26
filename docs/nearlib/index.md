---
id: "index"
title: "nearlib"
sidebar_label: "README"
---

# nearlib

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
Contract "hello.wasm" source code location: <https://github.com/nearprotocol/nearcore/tree/master/tests/hello>
