# Near lib

Near lib is a javascript library for development of dapps on near.

## Install dependencies

```
yarn
```

## Development

You can run continues build with next command:
```
yarn build -- -w
```

## Publish

Prepare `dist` version by running:

```
yarn dist
```

## Integration Test

Start the node by following instructions from nearcore/README.md, then
```
yarn test
```
Contract "hello.wasm" source code location: <https://github.com/nearprotocol/nearcore/tree/master/tests/hello>

