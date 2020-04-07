---
id: "_connection_.connection"
title: "Connection"
sidebar_label: "Connection"
---

Connects an account to a given network via a given provider

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

___

###  provider

• **provider**: *[Provider](_providers_provider_.provider.md)*

___

###  signer

• **signer**: *[Signer](_signer_.signer.md)*

## Methods

### `Static` fromConfig

▸ **fromConfig**(`config`: any): *[Connection](_connection_.connection.md)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`config` | any | Contains connection info details  |

**Returns:** *[Connection](_connection_.connection.md)*
