
# NEAR Web 3 Authentication

  

@near-js/biometric-ed25519 package contains interfaces to assist the implementation of biometric driven web3 authentication. 
  

## Installation and Usage

  

The easiest way to use NEAR Web 3 Authentication is to install the [`biometric-ed25519`](https://www.npmjs.com/package/@near-js/biometric-ed25519) package from the NPM registry.
  

```bash

# Using Yarn

yarn add @near-js/biometric-ed25519 

  

# Using NPM.

npm install @near-js/biometric-ed25519 

```

Then in your dApp:

  

```ts
import { createKey, getKeys } from  "@near-js/biometric-ed25519";

// To register with userName
const key = await createKey(userName);


// To retrieve keys with userName
const keys = await getKeys(userName);

```

As the nature of Elliptic Curve crypto, `getKeys` return with two possible public key pairs. In order to select the correct public key pair out of two pairs, it is essential to implement a logic to preserve the public key pair created from `createKey` and retrieve them after calling `getKeys` and find the right one among the two. 


## Use Case

1. Check if given user name exist against RPC endpoint.
2. User creates an authentication to browser using biometric finger print with desire user name. (by calling `createKey`)
3. Use public key from step 2 to create a near account with given user name. 
4. When user come back to authenticate, use `getKeys` to retrieve two possible public key pairs. 
5. Create near connection with user name
6. Retrieve list of access keys and check if one of public key pairs exist in the list.
7. If exist one is found, it should be used to make the authentication. 

  
## License


This repository is distributed under the terms of both the MIT license and the Apache License (Version 2.0). See [LICENSE-MIT](LICENSE-MIT) and [LICENSE-APACHE](LICENSE-APACHE) for details.
