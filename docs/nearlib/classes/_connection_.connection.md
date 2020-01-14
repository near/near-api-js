---
id: "_connection_.connection"
title: "Connection"
sidebar_label: "Connection"
---

## Hierarchy

* **Connection**

## Index

### Constructors

* [constructor](_connection_.connection.md#constructor)

### Properties

* [networkId](_connection_.connection.md#networkid)
* [provider](_connection_.connection.md#provider)
* [signer](_connection_.connection.md#signer)

### Methods

* [fromConfig](_connection_.connection.md#static-fromconfig)

## Constructors

###  constructor

\+ **new Connection**(`networkId`: string, `provider`: [Provider](_providers_provider_.provider.md), `signer`: [Signer](_signer_.signer.md)): *[Connection](_connection_.connection.md)*

*Defined in [src.ts/connection.ts:29](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/connection.ts#L29)*

**Parameters:**

Name | Type |
------ | ------ |
`networkId` | string |
`provider` | [Provider](_providers_provider_.provider.md) |
`signer` | [Signer](_signer_.signer.md) |

**Returns:** *[Connection](_connection_.connection.md)*

## Properties

###  networkId

• **networkId**: *string*

*Defined in [src.ts/connection.ts:27](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/connection.ts#L27)*

___

###  provider

• **provider**: *[Provider](_providers_provider_.provider.md)*

*Defined in [src.ts/connection.ts:28](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/connection.ts#L28)*

___

###  signer

• **signer**: *[Signer](_signer_.signer.md)*

*Defined in [src.ts/connection.ts:29](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/connection.ts#L29)*

## Methods

### `Static` fromConfig

▸ **fromConfig**(`config`: any): *[Connection](_connection_.connection.md)*

*Defined in [src.ts/connection.ts:37](https://github.com/nearprotocol/nearlib/blob/36a8ddc/src.ts/connection.ts#L37)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | any |

**Returns:** *[Connection](_connection_.connection.md)*
