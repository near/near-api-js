
Near lib
========

Near lib is a javascript library for development of dapps on near.

Install dependencies
--------------------

```
npm install
```

Development
-----------

You can run continues build with next command:

```
npm run build -- -w
```

Publish
-------

Prepare `dist` version by running:

```
npm run dist
```

Integration Test
----------------

Start the node by following instructions from nearcore/README.md, then

```
npm test
```

Contract "hello.wasm" source code location: [https://github.com/nearprotocol/nearcore/tree/master/tests/hello](https://github.com/nearprotocol/nearcore/tree/master/tests/hello)

