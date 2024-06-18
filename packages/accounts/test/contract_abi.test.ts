import { describe, expect, test } from '@jest/globals';
import { Account, Contract, ArgumentSchemaError, UnknownArgumentError, UnsupportedSerializationError } from '../src';

const rawAbi = `{
  "schema_version": "0.3.0",
  "body": {
    "functions": [
      {
        "name": "add",
        "doc": " Adds two pairs point-wise.",
        "kind": "view",
        "params": {
          "serialization_type": "json",
          "args": [
            {
              "name": "a",
              "type_schema": {
                "$ref": "#/definitions/Pair"
              }
            },
            {
              "name": "b",
              "type_schema": {
                "$ref": "#/definitions/Pair"
              }
            }
          ]
        },
        "result": {
          "serialization_type": "json",
          "type_schema": {
            "$ref": "#/definitions/Pair"
          }
        }
      },
      {
        "name": "add_call",
        "doc": " Adds two pairs point-wise.",
        "kind": "call",
        "params": {
          "serialization_type": "json",
          "args": [
            {
              "name": "a",
              "type_schema": {
                "$ref": "#/definitions/Pair"
              }
            },
            {
              "name": "b",
              "type_schema": {
                "$ref": "#/definitions/Pair"
              }
            }
          ]
        },
        "result": {
          "serialization_type": "json",
          "type_schema": {
            "$ref": "#/definitions/Pair"
          }
        }
      },
      {
        "name": "empty_call",
        "kind": "call"
      }
    ],
    "root_schema": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "String",
      "type": "string",
      "definitions": {
        "Pair": {
          "type": "array",
          "items": [
            {
              "type": "integer",
              "format": "uint32",
              "minimum": 0.0
            },
            {
              "type": "integer",
              "format": "uint32",
              "minimum": 0.0
            }
          ],
          "maxItems": 2,
          "minItems": 2
        }
      }
    }
  }
}`;

const account = Object.setPrototypeOf({
    getConnection() {
        return {};
    },
    viewFunction({ contractId, methodName, args, parse, stringify, jsContract, blockQuery }) {
        return { this: this, contractId, methodName, args, parse, stringify, jsContract, blockQuery };
    },
    functionCall() {
        return this;
    }
}, Account.prototype);

const abi = JSON.parse(rawAbi);

// @ts-expect-error test input
const contract: any = new Contract(account, 'contractId', { abi });

describe('add', () => {
    test('can be called successfully', async () => {
        await contract.add({ a: [1, 2], b: [3, 4] });
    });

    test('throws ArgumentSchemaError if required argument was not supplied', async () => {
        await expect(contract.add({})).rejects.toBeInstanceOf(ArgumentSchemaError);
    });

    test('throws ArgumentSchemaError if argument has unexpected type', async () => {
        await expect(contract.add({ a: 1, b: [3, 4] })).rejects.toBeInstanceOf(ArgumentSchemaError);
    });

    test('throws UnknownArgumentError if unknown argument was supplied', async () => {
        await expect(contract.add({ a: [1, 2], b: [3, 4], c: 5 })).rejects.toBeInstanceOf(UnknownArgumentError);
    });
});


describe('add_call', () => {
    test('can be called successfully', async () => {
        await contract.add_call({ args: { a: [1, 2], b: [3, 4] } });
    });

    test('throws ArgumentSchemaError if required argument was not supplied', async () => {
        await expect(contract.add_call({ args: {} })).rejects.toBeInstanceOf(ArgumentSchemaError);
    });

    test('throws ArgumentSchemaError if argument has unexpected type', async () => {
        await expect(contract.add_call({ args: { a: 1, b: [3, 4] } })).rejects.toBeInstanceOf(ArgumentSchemaError);
    });

    test('throws UnknownArgumentError if unknown argument was supplied', async () => {
        await expect(contract.add_call({ args: { a: [1, 2], b: [3, 4], c: 5 } })).rejects.toBeInstanceOf(UnknownArgumentError);
    });
});

describe('empty_call', () => {
    test('can be called successfully', async () => {
        await contract.empty_call({});
    });
});

describe('Contract constructor', () => {
    test('throws UnsupportedSerializationError when ABI has borsh serialization', async () => {
        const rawAbi = `{
                "schema_version": "0.3.0",
                "body": {
                  "functions": [
                    {
                      "name": "add",
                      "kind": "view",
                      "params": {
                        "serialization_type": "borsh",
                        "args": [
                          {
                            "name": "b",
                            "type_schema": {
                              "type": "integer"
                            }
                          }
                        ]
                      }
                    }
                  ],
                  "root_schema": {
                    "$schema": "http://json-schema.org/draft-07/schema#",
                    "title": "String",
                    "type": "string"
                  }
                }
              }`;
        // @ts-expect-error test input
        const contract: any = new Contract(account, 'contractId', { abi: JSON.parse(rawAbi) });
        await expect(contract.add({ a: 1 })).rejects.toBeInstanceOf(UnsupportedSerializationError);
    });
});
