
# IFrame RPC

The `@near-js/iframe-rpc` package facilitates async RPC calls between cross-domain frames using the `postMessage` API. 
  

## Installation and Usage

Install [`@near-js/iframe-rpc`](https://www.npmjs.com/package/@near-js/iframe-rpc) package from the NPM registry. 

```bash
# Using Yarn
yarn add @near-js/iframe-rpc 

# Using NPM.
npm install @near-js/iframe-rpc 
```

In your app:
```ts
import { IFrameRPC } from  "@near-js/iframe-rpc";
const rpc = new IFrameRPC({...})
await rpc.isReady
// Call away!
```

## License
This repository is distributed under the terms of both the MIT license and the Apache License (Version 2.0). See [LICENSE-MIT](LICENSE-MIT) and [LICENSE-APACHE](LICENSE-APACHE) for details.
