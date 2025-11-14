import type { AbiRoot } from "near-api-js";

export const abi = {
    schema_version: "0.4.0",
    metadata: {
        name: "contract",
        version: "0.1.0",
        build: {
            compiler: "rustc 1.86.0",
            builder: "cargo-near cargo-near-build 0.7.2",
        },
        wasm_hash: "EmTQGUyEmTpd6BigmqBtYqZcX9ps8zJ48UPQHSc16vm9",
    },
    body: {
        functions: [
            {
                name: "add_message",
                kind: "call",
                modifiers: ["payable"],
                params: {
                    serialization_type: "json",
                    args: [
                        {
                            name: "text",
                            type_schema: {
                                type: "string",
                            },
                        },
                    ],
                },
            },
            {
                name: "contract_source_metadata",
                kind: "view",
            },
            {
                name: "get_messages",
                kind: "view",
                params: {
                    serialization_type: "json",
                    args: [
                        {
                            name: "from_index",
                            type_schema: {
                                type: ["string", "null"],
                            },
                        },
                        {
                            name: "limit",
                            type_schema: {
                                type: ["string", "null"],
                            },
                        },
                    ],
                },
                result: {
                    serialization_type: "json",
                    type_schema: {
                        type: "array",
                        items: {
                            $ref: "#/definitions/PostedMessage",
                        },
                    },
                },
            },
            {
                name: "total_messages",
                kind: "view",
                result: {
                    serialization_type: "json",
                    type_schema: {
                        type: "integer",
                        format: "uint32",
                        minimum: 0.0,
                    },
                },
            },
        ],
        root_schema: {
            $schema: "http://json-schema.org/draft-07/schema#",
            title: "String",
            type: "string",
            definitions: {
                AccountId: {
                    description:
                        'NEAR Account Identifier.\n\nThis is a unique, syntactically valid, human-readable account identifier on the NEAR network.\n\n[See the crate-level docs for information about validation.](index.html#account-id-rules)\n\nAlso see [Error kind precedence](AccountId#error-kind-precedence).\n\n## Examples\n\n``` use near_account_id::AccountId;\n\nlet alice: AccountId = "alice.near".parse().unwrap();\n\nassert!("ƒelicia.near".parse::<AccountId>().is_err()); // (ƒ is not f) ```',
                    type: "string",
                },
                PostedMessage: {
                    type: "object",
                    required: ["premium", "sender", "text"],
                    properties: {
                        premium: {
                            type: "boolean",
                        },
                        sender: {
                            $ref: "#/definitions/AccountId",
                        },
                        text: {
                            type: "string",
                        },
                    },
                },
            },
        },
    },
} as const satisfies AbiRoot;
