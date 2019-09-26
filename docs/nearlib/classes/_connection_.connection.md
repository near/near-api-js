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

*Defined in [connection.ts:25](https://github.com/nearprotocol/nearlib/blob/2fe0e0d/src.ts/connection.ts#L25)*

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

*Defined in [connection.ts:23](https://github.com/nearprotocol/nearlib/blob/2fe0e0d/src.ts/connection.ts#L23)*

___

###  provider

• **provider**: *[Provider](_providers_provider_.provider.md)*

*Defined in [connection.ts:24](https://github.com/nearprotocol/nearlib/blob/2fe0e0d/src.ts/connection.ts#L24)*

___

###  signer

• **signer**: *[Signer](_signer_.signer.md)*

*Defined in [connection.ts:25](https://github.com/nearprotocol/nearlib/blob/2fe0e0d/src.ts/connection.ts#L25)*

## Methods

### `Static` fromConfig

▸ **fromConfig**(`config`: any): *[Connection](_connection_.connection.md)*

*Defined in [connection.ts:33](https://github.com/nearprotocol/nearlib/blob/2fe0e0d/src.ts/connection.ts#L33)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | any |

**Returns:** *[Connection](_connection_.connection.md)*
