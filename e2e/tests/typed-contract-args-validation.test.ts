import { Account, ArgumentSchemaError, JsonRpcProvider, TypedContract, UnknownArgumentError } from 'near-api-js';
import { describe, expect, test, vi } from 'vitest';

const provider = new JsonRpcProvider({ url: '' });

const account = new Account('', provider);

vi.spyOn(JsonRpcProvider.prototype, 'callFunction').mockResolvedValue({});
vi.spyOn(Account.prototype, 'callFunction').mockResolvedValue({});

describe('TypedContract validates "view" function arguments based on ABI', () => {
    const contract = new TypedContract({
        contractId: '',
        provider: provider,
        abi: {
            schema_version: '0.4.0',
            metadata: {},
            body: {
                functions: [
                    {
                        name: 'test_string',
                        kind: 'view',
                        params: {
                            serialization_type: 'json',
                            args: [
                                {
                                    name: 'arg',
                                    type_schema: { type: 'string' },
                                },
                            ],
                        },
                    },
                    {
                        name: 'test_integer',
                        kind: 'view',
                        params: {
                            serialization_type: 'json',
                            args: [
                                {
                                    name: 'arg',
                                    type_schema: { type: 'integer' },
                                },
                            ],
                        },
                    },
                    {
                        name: 'test_number',
                        kind: 'view',
                        params: {
                            serialization_type: 'json',
                            args: [
                                {
                                    name: 'arg',
                                    type_schema: { type: 'number' },
                                },
                            ],
                        },
                    },
                    {
                        name: 'test_bool',
                        kind: 'view',
                        params: {
                            serialization_type: 'json',
                            args: [
                                {
                                    name: 'arg',
                                    type_schema: { type: 'boolean' },
                                },
                            ],
                        },
                    },
                    {
                        name: 'test_extra_args',
                        kind: 'view',
                        params: {
                            serialization_type: 'json',
                            args: [],
                        },
                    },
                    {
                        name: 'test_definitions',
                        kind: 'view',
                        params: {
                            serialization_type: 'json',
                            args: [
                                {
                                    name: 'arg',
                                    type_schema: {
                                        $ref: '#/definitions/Pagination',
                                    },
                                },
                            ],
                        },
                    },
                ],
                root_schema: {
                    definitions: {
                        Pagination: {
                            type: 'object',
                            required: ['page', 'perPage'],
                            properties: {
                                page: { type: 'number' },
                                perPage: { type: 'number' },
                            },
                        },
                    },
                },
            },
        },
    });

    test('TypedContract validates "string" correctly', async () => {
        await expect(
            contract.view.test_string({
                args: {
                    arg: 'hello',
                },
            })
        ).resolves.toStrictEqual({});

        await expect(
            contract.view.test_string({
                args: {
                    // @ts-expect-error intentionally
                    arg: 1_000,
                },
            })
        ).rejects.toThrow(ArgumentSchemaError);

        await expect(
            contract.view.test_string({
                args: {
                    // @ts-expect-error intentionally
                    arg: true,
                },
            })
        ).rejects.toThrow(ArgumentSchemaError);
    });

    test('TypedContract validates "number" correctly', async () => {
        await expect(
            contract.view.test_number({
                args: {
                    arg: 1_000,
                },
            })
        ).resolves.toStrictEqual({});

        await expect(
            contract.view.test_number({
                args: {
                    arg: 1.2345,
                },
            })
        ).resolves.toStrictEqual({});

        await expect(
            contract.view.test_number({
                args: {
                    // @ts-expect-error intentionally
                    arg: '12345',
                },
            })
        ).rejects.toThrow(ArgumentSchemaError);

        await expect(
            contract.view.test_number({
                args: {
                    // @ts-expect-error intentionally
                    arg: 'text',
                },
            })
        ).rejects.toThrow(ArgumentSchemaError);

        await expect(
            contract.view.test_number({
                args: {
                    // @ts-expect-error intentionally
                    arg: true,
                },
            })
        ).rejects.toThrow(ArgumentSchemaError);
    });

    test('TypedContract validates "integer" correctly', async () => {
        await expect(
            contract.view.test_integer({
                args: {
                    arg: 1_000,
                },
            })
        ).resolves.toStrictEqual({});

        await expect(
            contract.view.test_integer({
                args: {
                    arg: 1.2345,
                },
            })
        ).rejects.toThrow(ArgumentSchemaError);

        await expect(
            contract.view.test_integer({
                args: {
                    // @ts-expect-error intentionally
                    arg: '12345',
                },
            })
        ).rejects.toThrow(ArgumentSchemaError);

        await expect(
            contract.view.test_integer({
                args: {
                    // @ts-expect-error intentionally
                    arg: 'text',
                },
            })
        ).rejects.toThrow(ArgumentSchemaError);

        await expect(
            contract.view.test_integer({
                args: {
                    // @ts-expect-error intentionally
                    arg: true,
                },
            })
        ).rejects.toThrow(ArgumentSchemaError);
    });

    test('TypedContract validates "boolean" correctly', async () => {
        await expect(
            contract.view.test_bool({
                args: {
                    arg: true,
                },
            })
        ).resolves.toStrictEqual({});

        await expect(
            contract.view.test_bool({
                args: {
                    arg: false,
                },
            })
        ).resolves.toStrictEqual({});

        await expect(
            contract.view.test_bool({
                args: {
                    // @ts-expect-error intentionally
                    arg: 12345,
                },
            })
        ).rejects.toThrow(ArgumentSchemaError);

        await expect(
            contract.view.test_bool({
                args: {
                    // @ts-expect-error intentionally
                    arg: 'text',
                },
            })
        ).rejects.toThrow(ArgumentSchemaError);
    });

    test('TypedContract throws on extra arguments', async () => {
        await expect(
            contract.view.test_extra_args({
                args: {},
            })
        ).resolves.toStrictEqual({});

        await expect(
            contract.view.test_extra_args({
                args: {
                    arg: 'text',
                },
            })
        ).rejects.toThrow(UnknownArgumentError);

        await expect(
            contract.view.test_extra_args({
                args: {
                    arg: 123,
                },
            })
        ).rejects.toThrow(UnknownArgumentError);

        await expect(
            contract.view.test_extra_args({
                args: {
                    arg: true,
                },
            })
        ).rejects.toThrow(UnknownArgumentError);
    });

    test('TypedContract validates types from definitions correctly', async () => {
        await expect(
            contract.view.test_definitions({
                args: {
                    arg: {
                        page: 1,
                        perPage: 10,
                    },
                },
            })
        ).resolves.toStrictEqual({});

        await expect(
            contract.view.test_definitions({
                args: {
                    // @ts-expect-error intentionally
                    arg: 12345,
                },
            })
        ).rejects.toThrow(ArgumentSchemaError);

        await expect(
            contract.view.test_definitions({
                args: {
                    // @ts-expect-error intentionally
                    arg: {},
                },
            })
        ).rejects.toThrow(ArgumentSchemaError);

        await expect(
            contract.view.test_definitions({
                args: {
                    arg: {
                        // @ts-expect-error intentionally
                        page: 'text',
                        perPage: 10,
                    },
                },
            })
        ).rejects.toThrow(ArgumentSchemaError);

        await expect(
            contract.view.test_definitions({
                args: {
                    arg: {
                        page: 4,
                        // @ts-expect-error intentionally
                        perPage: 'text',
                    },
                },
            })
        ).rejects.toThrow(ArgumentSchemaError);
    });

    // Various argument types can be passed to the function without causing failures
    test('TypedContract skips validation if no ABI provided', async () => {
        const contractWithoutAbi = new TypedContract({
            contractId: '',
            provider: provider,
        });

        await expect(
            contractWithoutAbi.view.test_skip_validation({
                args: {
                    arg: 'text',
                },
            })
        ).resolves.toStrictEqual({});

        await expect(
            contractWithoutAbi.view.test_skip_validation({
                args: {
                    arg: 12345,
                },
            })
        ).resolves.toStrictEqual({});

        await expect(
            contractWithoutAbi.view.test_skip_validation({
                args: {
                    arg: true,
                },
            })
        ).resolves.toStrictEqual({});

        await expect(
            contractWithoutAbi.view.test_skip_validation({
                args: {
                    arg: {
                        text: 'Hello, world',
                    },
                },
            })
        ).resolves.toStrictEqual({});
    });
});

describe('TypedContract validates "call" function arguments based on ABI', () => {
    const contract = new TypedContract({
        contractId: '',
        provider: provider,
        abi: {
            schema_version: '0.4.0',
            metadata: {},
            body: {
                functions: [
                    {
                        name: 'test_string',
                        kind: 'call',
                        params: {
                            serialization_type: 'json',
                            args: [
                                {
                                    name: 'arg',
                                    type_schema: { type: 'string' },
                                },
                            ],
                        },
                    },
                    {
                        name: 'test_integer',
                        kind: 'call',
                        params: {
                            serialization_type: 'json',
                            args: [
                                {
                                    name: 'arg',
                                    type_schema: { type: 'integer' },
                                },
                            ],
                        },
                    },
                    {
                        name: 'test_number',
                        kind: 'call',
                        params: {
                            serialization_type: 'json',
                            args: [
                                {
                                    name: 'arg',
                                    type_schema: { type: 'number' },
                                },
                            ],
                        },
                    },
                    {
                        name: 'test_bool',
                        kind: 'call',
                        params: {
                            serialization_type: 'json',
                            args: [
                                {
                                    name: 'arg',
                                    type_schema: { type: 'boolean' },
                                },
                            ],
                        },
                    },
                    {
                        name: 'test_extra_args',
                        kind: 'call',
                        params: {
                            serialization_type: 'json',
                            args: [],
                        },
                    },
                    {
                        name: 'test_definitions',
                        kind: 'call',
                        params: {
                            serialization_type: 'json',
                            args: [
                                {
                                    name: 'arg',
                                    type_schema: {
                                        $ref: '#/definitions/Pagination',
                                    },
                                },
                            ],
                        },
                    },
                ],
                root_schema: {
                    definitions: {
                        Pagination: {
                            type: 'object',
                            required: ['page', 'perPage'],
                            properties: {
                                page: { type: 'number' },
                                perPage: { type: 'number' },
                            },
                        },
                    },
                },
            },
        },
    });

    test('TypedContract validates "string" correctly', async () => {
        await expect(
            contract.call.test_string({
                args: {
                    arg: 'hello',
                },
                account: account,
            })
        ).resolves.toStrictEqual({});

        await expect(
            contract.call.test_string({
                args: {
                    // @ts-expect-error intentionally
                    arg: 1_000,
                },
                account: account,
            })
        ).rejects.toThrow(ArgumentSchemaError);

        await expect(
            contract.call.test_string({
                args: {
                    // @ts-expect-error intentionally
                    arg: true,
                },
                account: account,
            })
        ).rejects.toThrow(ArgumentSchemaError);
    });

    test('TypedContract validates "number" correctly', async () => {
        await expect(
            contract.call.test_number({
                args: {
                    arg: 1_000,
                },
                account: account,
            })
        ).resolves.toStrictEqual({});

        await expect(
            contract.call.test_number({
                args: {
                    arg: 1.2345,
                },
                account: account,
            })
        ).resolves.toStrictEqual({});

        await expect(
            contract.call.test_number({
                args: {
                    // @ts-expect-error intentionally
                    arg: '12345',
                },
                account: account,
            })
        ).rejects.toThrow(ArgumentSchemaError);

        await expect(
            contract.call.test_number({
                args: {
                    // @ts-expect-error intentionally
                    arg: 'text',
                },
                account: account,
            })
        ).rejects.toThrow(ArgumentSchemaError);

        await expect(
            contract.call.test_number({
                args: {
                    // @ts-expect-error intentionally
                    arg: true,
                },
                account: account,
            })
        ).rejects.toThrow(ArgumentSchemaError);
    });

    test('TypedContract validates "integer" correctly', async () => {
        await expect(
            contract.call.test_integer({
                args: {
                    arg: 1_000,
                },
                account: account,
            })
        ).resolves.toStrictEqual({});

        await expect(
            contract.call.test_integer({
                args: {
                    arg: 1.2345,
                },
                account: account,
            })
        ).rejects.toThrow(ArgumentSchemaError);

        await expect(
            contract.call.test_integer({
                args: {
                    // @ts-expect-error intentionally
                    arg: '12345',
                },
                account: account,
            })
        ).rejects.toThrow(ArgumentSchemaError);

        await expect(
            contract.call.test_integer({
                args: {
                    // @ts-expect-error intentionally
                    arg: 'text',
                },
                account: account,
            })
        ).rejects.toThrow(ArgumentSchemaError);

        await expect(
            contract.call.test_integer({
                args: {
                    // @ts-expect-error intentionally
                    arg: true,
                },
                account: account,
            })
        ).rejects.toThrow(ArgumentSchemaError);
    });

    test('TypedContract validates "boolean" correctly', async () => {
        await expect(
            contract.call.test_bool({
                args: {
                    arg: true,
                },
                account: account,
            })
        ).resolves.toStrictEqual({});

        await expect(
            contract.call.test_bool({
                args: {
                    arg: false,
                },
                account: account,
            })
        ).resolves.toStrictEqual({});

        await expect(
            contract.call.test_bool({
                args: {
                    // @ts-expect-error intentionally
                    arg: 12345,
                },
                account: account,
            })
        ).rejects.toThrow(ArgumentSchemaError);

        await expect(
            contract.call.test_bool({
                args: {
                    // @ts-expect-error intentionally
                    arg: 'text',
                },
                account: account,
            })
        ).rejects.toThrow(ArgumentSchemaError);
    });

    test('TypedContract throws on extra arguments', async () => {
        await expect(
            contract.call.test_extra_args({
                args: {},
                account: account,
            })
        ).resolves.toStrictEqual({});

        await expect(
            contract.call.test_extra_args({
                args: {
                    arg: 'text',
                },
                account: account,
            })
        ).rejects.toThrow(UnknownArgumentError);

        await expect(
            contract.call.test_extra_args({
                args: {
                    arg: 123,
                },
                account: account,
            })
        ).rejects.toThrow(UnknownArgumentError);

        await expect(
            contract.call.test_extra_args({
                args: {
                    arg: true,
                },
                account: account,
            })
        ).rejects.toThrow(UnknownArgumentError);
    });

    test('TypedContract validates types from definitions correctly', async () => {
        await expect(
            contract.call.test_definitions({
                args: {
                    arg: {
                        page: 1,
                        perPage: 10,
                    },
                },
                account: account,
            })
        ).resolves.toStrictEqual({});

        await expect(
            contract.call.test_definitions({
                args: {
                    // @ts-expect-error intentionally
                    arg: 12345,
                },
                account: account,
            })
        ).rejects.toThrow(ArgumentSchemaError);
        await expect(
            contract.call.test_definitions({
                args: {
                    // @ts-expect-error intentionally
                    arg: {},
                },
                account: account,
            })
        ).rejects.toThrow(ArgumentSchemaError);
        await expect(
            contract.call.test_definitions({
                args: {
                    arg: {
                        // @ts-expect-error intentionally
                        page: 'text',
                        perPage: 10,
                    },
                },
                account: account,
            })
        ).rejects.toThrow(ArgumentSchemaError);
        await expect(
            contract.call.test_definitions({
                args: {
                    arg: {
                        page: 4,
                        // @ts-expect-error intentionally
                        perPage: 'text',
                    },
                },
                account: account,
            })
        ).rejects.toThrow(ArgumentSchemaError);
    });

    // Various argument types can be passed to the function without causing failures
    test('TypedContract skips validation if no ABI provided', async () => {
        const contractWithoutAbi = new TypedContract({
            contractId: '',
            provider: provider,
        });

        await expect(
            contractWithoutAbi.call.test_skip_validation({
                args: {
                    arg: 'text',
                },
                account: account,
            })
        ).resolves.toStrictEqual({});

        await expect(
            contractWithoutAbi.call.test_skip_validation({
                args: {
                    arg: 12345,
                },
                account: account,
            })
        ).resolves.toStrictEqual({});

        await expect(
            contractWithoutAbi.call.test_skip_validation({
                args: {
                    arg: true,
                },
                account: account,
            })
        ).resolves.toStrictEqual({});

        await expect(
            contractWithoutAbi.call.test_skip_validation({
                args: {
                    arg: {
                        text: 'Hello, world',
                    },
                },
                account: account,
            })
        ).resolves.toStrictEqual({});
    });
});
