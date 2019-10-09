---
id: "_utils_key_pair_.keypaired25519"
title: "KeyPairEd25519"
sidebar_label: "KeyPairEd25519"
---

This class provides key pair functionality for Ed25519 curve:
generating key pairs, encoding key pairs, signing and verifying.

## Hierarchy

* [KeyPair](_utils_key_pair_.keypair.md)

  ↳ **KeyPairEd25519**

## Index

### Constructors

* [constructor](_utils_key_pair_.keypaired25519.md#constructor)

### Properties

* [publicKey](_utils_key_pair_.keypaired25519.md#publickey)
* [secretKey](_utils_key_pair_.keypaired25519.md#secretkey)

### Methods

* [getPublicKey](_utils_key_pair_.keypaired25519.md#getpublickey)
* [sign](_utils_key_pair_.keypaired25519.md#sign)
* [toString](_utils_key_pair_.keypaired25519.md#tostring)
* [verify](_utils_key_pair_.keypaired25519.md#verify)
* [fromRandom](_utils_key_pair_.keypaired25519.md#static-fromrandom)
* [fromString](_utils_key_pair_.keypaired25519.md#static-fromstring)

## Constructors

###  constructor

\+ **new KeyPairEd25519**(`secretKey`: string): *[KeyPairEd25519](_utils_key_pair_.keypaired25519.md)*

*Defined in [utils/key_pair.ts:101](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/utils/key_pair.ts#L101)*

Construct an instance of key pair given a secret key.
It's generally assumed that these are encoded in base58.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`secretKey` | string |   |

**Returns:** *[KeyPairEd25519](_utils_key_pair_.keypaired25519.md)*

## Properties

###  publicKey

• **publicKey**: *[PublicKey](_utils_key_pair_.publickey.md)*

*Defined in [utils/key_pair.ts:100](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/utils/key_pair.ts#L100)*

___

###  secretKey

• **secretKey**: *string*

*Defined in [utils/key_pair.ts:101](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/utils/key_pair.ts#L101)*

## Methods

###  getPublicKey

▸ **getPublicKey**(): *[PublicKey](_utils_key_pair_.publickey.md)*

*Overrides [KeyPair](_utils_key_pair_.keypair.md).[getPublicKey](_utils_key_pair_.keypair.md#abstract-getpublickey)*

*Defined in [utils/key_pair.ts:143](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/utils/key_pair.ts#L143)*

**Returns:** *[PublicKey](_utils_key_pair_.publickey.md)*

___

###  sign

▸ **sign**(`message`: Uint8Array): *[Signature](../interfaces/_utils_key_pair_.signature.md)*

*Overrides [KeyPair](_utils_key_pair_.keypair.md).[sign](_utils_key_pair_.keypair.md#abstract-sign)*

*Defined in [utils/key_pair.ts:130](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/utils/key_pair.ts#L130)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | Uint8Array |

**Returns:** *[Signature](../interfaces/_utils_key_pair_.signature.md)*

___

###  toString

▸ **toString**(): *string*

*Overrides [KeyPair](_utils_key_pair_.keypair.md).[toString](_utils_key_pair_.keypair.md#abstract-tostring)*

*Defined in [utils/key_pair.ts:139](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/utils/key_pair.ts#L139)*

**Returns:** *string*

___

###  verify

▸ **verify**(`message`: Uint8Array, `signature`: Uint8Array): *boolean*

*Overrides [KeyPair](_utils_key_pair_.keypair.md).[verify](_utils_key_pair_.keypair.md#abstract-verify)*

*Defined in [utils/key_pair.ts:135](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/utils/key_pair.ts#L135)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | Uint8Array |
`signature` | Uint8Array |

**Returns:** *boolean*

___

### `Static` fromRandom

▸ **fromRandom**(): *[KeyPairEd25519](_utils_key_pair_.keypaired25519.md)*

*Overrides [KeyPair](_utils_key_pair_.keypair.md).[fromRandom](_utils_key_pair_.keypair.md#static-fromrandom)*

*Defined in [utils/key_pair.ts:125](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/utils/key_pair.ts#L125)*

Generate a new random keypair.

**`example`** 
const keyRandom = KeyPair.fromRandom();
keyRandom.publicKey
// returns [PUBLIC_KEY]

keyRandom.secretKey
// returns [SECRET_KEY]

**Returns:** *[KeyPairEd25519](_utils_key_pair_.keypaired25519.md)*

___

### `Static` fromString

▸ **fromString**(`encodedKey`: string): *[KeyPair](_utils_key_pair_.keypair.md)*

*Inherited from [KeyPair](_utils_key_pair_.keypair.md).[fromString](_utils_key_pair_.keypair.md#static-fromstring)*

*Defined in [utils/key_pair.ts:80](https://github.com/nearprotocol/nearlib/blob/a0bd9b2/src.ts/utils/key_pair.ts#L80)*

**Parameters:**

Name | Type |
------ | ------ |
`encodedKey` | string |

**Returns:** *[KeyPair](_utils_key_pair_.keypair.md)*
