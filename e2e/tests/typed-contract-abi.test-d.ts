import { Account, TypedContract } from "@near-js/accounts";
import { describe, expectTypeOf, test } from "vitest";
import { JsonRpcProvider } from "@near-js/providers";
import { KeyPairSigner } from "@near-js/signers";
import { KeyPair } from "@near-js/crypto";

/// These tests have to be in "packages/accounts",
/// but since Jest doesn't support type checking,
/// they temporarily live here

const provider = new JsonRpcProvider({ url: "" });
const keypair = KeyPair.fromRandom("ed25519");
const signer = new KeyPairSigner(keypair);
const account = new Account("", provider, signer);

describe("TypedContract infers function arguments from ABI correctly", () => {
    test('"args" are required if at least one argument is required', () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                            params: {
                                serialization_type: "json",
                                args: [
                                    {
                                        name: "arg1",
                                        type_schema: {
                                            type: "string",
                                        },
                                    },
                                    {
                                        name: "arg2",
                                        type_schema: {
                                            type: ["string", "null"],
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        expectTypeOf(contract.view.test).parameter(0).toExtend<{
            args: any;
        }>();
    });

    test('"args" are optional if none of arguments is required', () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                            params: {
                                serialization_type: "json",
                                args: [
                                    {
                                        name: "arg1",
                                        type_schema: {
                                            type: ["string", "null"],
                                        },
                                    },
                                    {
                                        name: "arg2",
                                        type_schema: {
                                            type: ["string", "null"],
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        type ExpectedArgs = { args?: any };

        expectTypeOf(contract.view.test)
            .parameter(0)
            .toExtend<ExpectedArgs | undefined>();
    });

    test('parses "string" as string', () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                            params: {
                                serialization_type: "json",
                                args: [
                                    {
                                        name: "arg1",
                                        type_schema: {
                                            type: "string",
                                        },
                                    },
                                    {
                                        name: "arg2",
                                        type_schema: {
                                            type: ["string"],
                                        },
                                    },
                                    {
                                        name: "arg3",
                                        type_schema: {
                                            type: ["string", "null"],
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        type ExpectedArgs = {
            arg1: string;
            arg2: string;
            arg3?: string | null | undefined;
        };
        expectTypeOf(contract.view.test)
            .parameter(0)
            .map(({ args }) => args)
            .toEqualTypeOf<ExpectedArgs>();
    });

    test('parses "number" or "integer" as number', () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                            params: {
                                serialization_type: "json",
                                args: [
                                    {
                                        name: "arg1",
                                        type_schema: {
                                            type: "number",
                                        },
                                    },
                                    {
                                        name: "arg2",
                                        type_schema: {
                                            type: ["number"],
                                        },
                                    },
                                    {
                                        name: "arg3",
                                        type_schema: {
                                            type: ["number", "null"],
                                        },
                                    },
                                    {
                                        name: "arg4",
                                        type_schema: {
                                            type: "integer",
                                        },
                                    },
                                    {
                                        name: "arg5",
                                        type_schema: {
                                            type: ["integer"],
                                        },
                                    },
                                    {
                                        name: "arg6",
                                        type_schema: {
                                            type: ["integer", "null"],
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        type ExpectedArgs = {
            arg1: number;
            arg2: number;
            arg3?: number | null | undefined;
            arg4: number;
            arg5: number;
            arg6?: number | null | undefined;
        };
        expectTypeOf(contract.view.test)
            .parameter(0)
            .map(({ args }) => args)
            .toEqualTypeOf<ExpectedArgs>();
    });

    test('parses "boolean" as boolean', () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                            params: {
                                serialization_type: "json",
                                args: [
                                    {
                                        name: "arg1",
                                        type_schema: {
                                            type: "boolean",
                                        },
                                    },
                                    {
                                        name: "arg2",
                                        type_schema: {
                                            type: ["boolean"],
                                        },
                                    },
                                    {
                                        name: "arg3",
                                        type_schema: {
                                            type: ["boolean", "null"],
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        type ExpectedArgs = {
            arg1: boolean;
            arg2: boolean;
            arg3?: boolean | null | undefined;
        };
        expectTypeOf(contract.view.test)
            .parameter(0)
            .map(({ args }) => args)
            .toEqualTypeOf<ExpectedArgs>();
    });

    test('parses "array" as array', () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                            params: {
                                serialization_type: "json",
                                args: [
                                    {
                                        name: "arg1",
                                        type_schema: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                            },
                                        },
                                    },
                                    {
                                        name: "arg2",
                                        type_schema: {
                                            type: "array",
                                            items: {
                                                type: "number",
                                            },
                                        },
                                    },
                                    {
                                        name: "arg3",
                                        type_schema: {
                                            type: "array",
                                            items: {
                                                type: "integer",
                                            },
                                        },
                                    },
                                    {
                                        name: "arg4",
                                        type_schema: {
                                            type: "array",
                                            items: {
                                                type: "boolean",
                                            },
                                        },
                                    },
                                    {
                                        name: "arg5",
                                        type_schema: {
                                            type: "array",
                                            items: {
                                                type: "array",
                                                items: {
                                                    type: "string",
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        type ExpectedArgs = {
            arg1: string[];
            arg2: number[];
            arg3: number[];
            arg4: boolean[];
            arg5: string[][];
        };
        expectTypeOf(contract.view.test)
            .parameter(0)
            .map(({ args }) => args)
            .toEqualTypeOf<ExpectedArgs>();
    });

    test('parses "object" as object', () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                            params: {
                                serialization_type: "json",
                                args: [
                                    {
                                        name: "arg1",
                                        type_schema: {
                                            type: "object",
                                            required: [
                                                "key1",
                                                "key2",
                                                "key3",
                                                "key4",
                                                "key5",
                                                "key7",
                                            ],
                                            properties: {
                                                key1: {
                                                    type: "string",
                                                },
                                                key2: {
                                                    type: "number",
                                                },
                                                key3: {
                                                    type: "integer",
                                                },
                                                key4: {
                                                    type: "boolean",
                                                },
                                                key5: {
                                                    type: ["string", "null"],
                                                },
                                                key6: {
                                                    type: "string",
                                                },
                                                key7: {
                                                    type: "object",
                                                    properties: {
                                                        subkey1: {
                                                            type: "string",
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        type ExpectedArgs = {
            arg1: {
                key1: string;
                key2: number;
                key3: number;
                key4: boolean;
                key5: string | null;
                key6?: string | undefined;
                key7: {
                    subkey1?: string | undefined;
                };
            };
        };
        expectTypeOf(contract.view.test)
            .parameter(0)
            .map(({ args }) => args)
            .toEqualTypeOf<ExpectedArgs>();
    });

    test("parses schema definitions", () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                            params: {
                                serialization_type: "json",
                                args: [
                                    {
                                        name: "arg1",
                                        type_schema: {
                                            $ref: "#/definitions/AccountId",
                                        },
                                    },
                                    {
                                        name: "arg2",
                                        type_schema: {
                                            $ref: "#/definitions/Message",
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    root_schema: {
                        definitions: {
                            AccountId: {
                                type: "string",
                            },
                            Message: {
                                type: "object",
                                required: ["sender", "text"],
                                properties: {
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
            },
        });

        type ExpectedArgs = {
            arg1: string;
            arg2: {
                text: string;
                sender: string;
            };
        };
        expectTypeOf(contract.view.test)
            .parameter(0)
            .map(({ args }) => args)
            .toEqualTypeOf<ExpectedArgs>();
    });

    test('parses "enum" string', () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                            params: {
                                serialization_type: "json",
                                args: [
                                    {
                                        name: "arg1",
                                        type_schema: {
                                            oneOf: [
                                                {
                                                    type: "object",
                                                    required: [
                                                        "version",
                                                        "name",
                                                    ],
                                                    properties: {
                                                        version: {
                                                            type: "string",
                                                            enum: ["V0"],
                                                        },
                                                        name: {
                                                            type: "string",
                                                        },
                                                    },
                                                },
                                                {
                                                    type: "object",
                                                    required: [
                                                        "version",
                                                        "name",
                                                        "age",
                                                    ],
                                                    properties: {
                                                        version: {
                                                            type: "string",
                                                            enum: ["V1"],
                                                        },
                                                        name: {
                                                            type: "string",
                                                        },
                                                        age: {
                                                            type: "number",
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        name: "arg2",
                                        type_schema: {
                                            type: "string",
                                            enum: ["V0", "V1", "V2", "3.0"],
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        type ExpectedArgs = {
            arg1:
                | { version: "V0"; name: string }
                | { version: "V1"; name: string; age: number };
            arg2: "V0" | "V1" | "V2" | "3.0";
        };
        expectTypeOf(contract.view.test)
            .parameter(0)
            .map(({ args }) => args)
            .toEqualTypeOf<ExpectedArgs>();
    });

    test('parses "additionalProperties"', () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                            params: {
                                serialization_type: "json",
                                args: [
                                    {
                                        name: "arg1",
                                        type_schema: {
                                            default: {},
                                            type: "object",
                                            additionalProperties: {
                                                type: "array",
                                                items: {
                                                    type: "string",
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        type ExpectedArgs = {
            arg1: Record<string, string[]>;
        };
        expectTypeOf(contract.view.test)
            .parameter(0)
            .map(({ args }) => args)
            .toEqualTypeOf<ExpectedArgs>();
    });
});

describe("TypedContract infers function returns from ABI correctly", () => {
    test('returns "void" by default', () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        expectTypeOf(contract.view.test).returns.resolves.toBeVoid();
    });

    test('parses ["string", "null"] as optional string', () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                            result: {
                                serialization_type: "json",
                                type_schema: {
                                    type: ["string", "null"],
                                },
                            },
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        expectTypeOf(contract.view.test).returns.resolves.toEqualTypeOf<
            string | null
        >();
    });

    test('parses "string" as string', () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                            result: {
                                serialization_type: "json",
                                type_schema: {
                                    type: "string",
                                },
                            },
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        expectTypeOf(contract.view.test).returns.resolves.toBeString();
    });

    test('parses "number" as number', () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                            result: {
                                serialization_type: "json",
                                type_schema: {
                                    type: "number",
                                },
                            },
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        expectTypeOf(contract.view.test).returns.resolves.toBeNumber();
    });

    test('parses "integer" as number', () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                            result: {
                                serialization_type: "json",
                                type_schema: {
                                    type: "integer",
                                },
                            },
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        expectTypeOf(contract.view.test).returns.resolves.toBeNumber();
    });

    test('parses "boolean" as boolean', () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                            result: {
                                serialization_type: "json",
                                type_schema: {
                                    type: "boolean",
                                },
                            },
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        expectTypeOf(contract.view.test).returns.resolves.toBeBoolean();
    });

    test('parses "array" as array', () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                            result: {
                                serialization_type: "json",
                                type_schema: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        expectTypeOf(contract.view.test).returns.resolves.toBeArray();
        expectTypeOf(contract.view.test).returns.resolves.items.toBeString();
    });

    test('parses "object" as object', () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                            result: {
                                serialization_type: "json",
                                type_schema: {
                                    type: "object",
                                    required: ["res1", "res2", "res3", "res5"],
                                    properties: {
                                        res1: {
                                            type: "string",
                                        },
                                        res2: {
                                            type: "number",
                                        },
                                        res3: {
                                            type: ["string", "null"],
                                        },
                                        res4: {
                                            type: "string",
                                        },
                                        res5: {
                                            type: "object",
                                            required: ["sub1"],
                                            properties: {
                                                sub1: { type: "string" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        type ExpectedReturn = {
            res1: string;
            res2: number;
            res3: string | null;
            res4?: string | undefined;
            res5: {
                sub1: string;
            };
        };
        expectTypeOf(
            contract.view.test
        ).returns.resolves.toEqualTypeOf<ExpectedReturn>();
    });

    test("parses schema definitions", () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                            result: {
                                serialization_type: "json",
                                type_schema: {
                                    type: "object",
                                    required: ["res1", "res2", "res3"],
                                    properties: {
                                        res1: {
                                            $ref: "#/definitions/AccountId",
                                        },
                                        res2: { $ref: "#/definitions/Message" },
                                        res3: { type: "number" },
                                    },
                                },
                            },
                        },
                    ],
                    root_schema: {
                        definitions: {
                            AccountId: {
                                type: "string",
                            },
                            Message: {
                                type: "object",
                                required: ["sender", "text"],
                                properties: {
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
            },
        });

        type ExpectedReturn = {
            res1: string;
            res2: {
                text: string;
                sender: string;
            };
            res3: number;
        };
        expectTypeOf(
            contract.view.test
        ).returns.resolves.toEqualTypeOf<ExpectedReturn>();
    });

    test('parses "enum" string', () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                            result: {
                                serialization_type: "json",
                                type_schema: {
                                    type: "object",
                                    required: ["res1", "res2"],
                                    properties: {
                                        res1: {
                                            oneOf: [
                                                {
                                                    type: "object",
                                                    required: [
                                                        "version",
                                                        "name",
                                                    ],
                                                    properties: {
                                                        version: {
                                                            type: "string",
                                                            enum: ["V0"],
                                                        },
                                                        name: {
                                                            type: "string",
                                                        },
                                                    },
                                                },
                                                {
                                                    type: "object",
                                                    required: [
                                                        "version",
                                                        "name",
                                                        "age",
                                                    ],
                                                    properties: {
                                                        version: {
                                                            type: "string",
                                                            enum: ["V1"],
                                                        },
                                                        name: {
                                                            type: "string",
                                                        },
                                                        age: {
                                                            type: "number",
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                        res2: {
                                            type: "string",
                                            enum: ["V0", "V1", "V2", "3.0"],
                                        },
                                    },
                                },
                            },
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        type ExpectedReturn = {
            res1:
                | { version: "V0"; name: string }
                | { version: "V1"; name: string; age: number };
            res2: "V0" | "V1" | "V2" | "3.0";
        };
        expectTypeOf(
            contract.view.test
        ).returns.resolves.toEqualTypeOf<ExpectedReturn>();
    });

    test('parses "additionalProperties"', () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test",
                            kind: "view",
                            result: {
                                serialization_type: "json",
                                type_schema: {
                                    default: {},
                                    type: "object",
                                    additionalProperties: {
                                        type: "array",
                                        items: {
                                            type: "string",
                                        },
                                    },
                                },
                            },
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        type ExpectedReturn = Record<string, string[]>;

        expectTypeOf(
            contract.view.test
        ).returns.resolves.toEqualTypeOf<ExpectedReturn>();
    });
});
