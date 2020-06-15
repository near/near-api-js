# near-api-js

[![Build Status](https://travis-ci.com/near/near-api-js.svg?branch=master)](https://travis-ci.com/near/near-api-js)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/near/near-api-js) 

A JavaScript/TypeScript library for development of DApps on the NEAR platform


# Contribute to this library

1. Install dependencies

       yarn

2. Run continuous build with:

       yarn build -- -w

# Publish

If you are a maintainer of `near-api-js` and you want to publish a new version to npmjs.com, there are some **prerequisites**:

1. Get write-access to [the GitHub repository](https://github.com/near/near-api-js)
2. Get publish-access to [the NPM package](https://www.npmjs.com/package/near-api-js)

Then run one script:

    yarn release

Since we use `commitlint` to ensure that all commits follow [the Conventional Commit spec](https://www.conventionalcommits.org/), our `release` script is able to automatically bump version numbers and update the CHANGELOG based on commit history.

# Integration Test

Start the node by following instructions from [nearcore](https://github.com/nearprotocol/nearcore), then

    yarn test

Tests use sample contract from `near-hello` npm package, see https://github.com/nearprotocol/near-hello

# Update error messages

Follow next steps:

1. [Change hash for the commit with errors in the nearcore](https://github.com/near/near-api-js/blob/master/gen_error_types.js#L7-L9)
2. Generate new types for errors: `node gen_error_types.js`
3. `yarn fix` fix any issues with linter.
4. `yarn build` to update `lib/**.js` files

# License

This repository is distributed under the terms of both the MIT license and the Apache License (Version 2.0).
See [LICENSE](LICENSE) and [LICENSE-APACHE](LICENSE-APACHE) for details.
