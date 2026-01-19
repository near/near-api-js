import { describe, expectTypeOf, test } from 'vitest';
import {
    type AbiRoot,
    Account,
    type BlockReference,
    Contract,
    JsonRpcProvider,
    KeyPair,
    KeyPairSigner,
    type TxExecutionStatus,
} from '../../src';
import { abi as guestbookAbi } from '../contracts/guestbook/abi.js';

type AbiFunctionKind = AbiRoot['body']['functions'][number]['kind'];

const provider = new JsonRpcProvider({ url: '' });
const keypair = KeyPair.fromRandom('ed25519');
const signer = new KeyPairSigner(keypair);
const account = new Account('', provider, signer);

describe("Contract can infer Guestbook's ABI", () => {
    const contract = new Contract({
        contractId: 'guestbook.testnet',
        provider: account.provider,
        abi: guestbookAbi,
    });

    test('"get_messages" view function', () => {
        type ExpectedGetMessagesArgs = {
            from_index?: string | undefined | null;
            limit?: string | undefined | null;
        };
        type ExpectedGetMessagesParams = {
            blockQuery?: BlockReference;
            args?: ExpectedGetMessagesArgs | undefined;
        };
        type ExpectedGetMessagesFunction = (params?: ExpectedGetMessagesParams | undefined) => Promise<
            {
                premium: boolean;
                sender: string;
                text: string;
            }[]
        >;

        expectTypeOf(contract.view.get_messages).toEqualTypeOf<ExpectedGetMessagesFunction>();
    });

    test('"total_messages" view function', () => {
        type ExpectedTotalMessagesFunction = (params?: { blockQuery?: BlockReference }) => Promise<number>;

        expectTypeOf(contract.view.total_messages).toEqualTypeOf<ExpectedTotalMessagesFunction>();
    });

    test('"add_message" call function', () => {
        type ExpectedAddMessageFunction = (params: {
            deposit?: bigint;
            gas?: bigint;
            account: Account;
            waitUntil?: TxExecutionStatus;
            args: {
                text: string;
            };
        }) => Promise<void>;

        expectTypeOf(contract.call.add_message).toEqualTypeOf<ExpectedAddMessageFunction>();
    });
});

describe('Contract can infer general interface without ABI', () => {
    const contract = new Contract({
        contractId: 'guestbook.testnet',
        provider: account.provider,
    });

    test('any view function', () => {
        type ExpectedViewFunction = <Response>(params?: {
            blockQuery?: BlockReference;
            args?: Record<string, unknown>;
        }) => Promise<Response>;

        expectTypeOf(contract.view).toEqualTypeOf<{
            [_: string]: ExpectedViewFunction;
        }>();
        expectTypeOf(contract.view.it_could_be_anything).toEqualTypeOf<ExpectedViewFunction>();
    });

    test('any call function', () => {
        type ExpectedCallFunction = <Response>(params: {
            deposit?: bigint;
            gas?: bigint;
            account: Account;
            waitUntil?: TxExecutionStatus;
            args?: Record<string, unknown>;
        }) => Promise<Response>;

        expectTypeOf(contract.call).toEqualTypeOf<{
            [_: string]: ExpectedCallFunction;
        }>();
        expectTypeOf(contract.call.it_could_be_anything).toEqualTypeOf<ExpectedCallFunction>();
    });
});

describe('Contract shape adapts to ABI', () => {
    test('Contract infers nothing from empty ABI', () => {
        const emptyAbi = {
            schema_version: '0.4.0',
            metadata: {},
            body: {
                functions: [],
                root_schema: {},
            },
        } as const satisfies AbiRoot;

        const contract = new Contract({
            contractId: 'guestbook.testnet',
            provider: account.provider,
            abi: emptyAbi,
        });

        expectTypeOf(contract).toEqualTypeOf<{
            abi: typeof emptyAbi;
            contractId: 'guestbook.testnet';
        }>();
    });

    test('Contract includes both kind of methods if ABI defines both view and call functions', () => {
        const contract = new Contract({
            contractId: 'guestbook.testnet',
            provider: account.provider,
            abi: {
                schema_version: '0.4.0',
                metadata: {},
                body: {
                    functions: [
                        {
                            name: 'test_read',
                            kind: 'view',
                        },
                        {
                            name: 'test_read2',
                            kind: 'view',
                        },
                        { name: 'test_write', kind: 'call' },
                        { name: 'test_write2', kind: 'call' },
                    ],
                    root_schema: {},
                },
            },
        });

        type ViewFunctionNames = 'test_read' | 'test_read2';
        expectTypeOf<keyof typeof contract.view>().toEqualTypeOf<ViewFunctionNames>();

        type CallFunctionNames = 'test_write' | 'test_write2';
        expectTypeOf<keyof typeof contract.call>().toEqualTypeOf<CallFunctionNames>();
    });

    test('Contract includes only view methods if ABI defines only view functions', () => {
        const contract = new Contract({
            contractId: 'guestbook.testnet',
            provider: account.provider,
            abi: {
                schema_version: '0.4.0',
                metadata: {},
                body: {
                    functions: [
                        {
                            name: 'test_read',
                            kind: 'view',
                        },
                        {
                            name: 'test_read2',
                            kind: 'view',
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        type ViewFunctionNames = 'test_read' | 'test_read2';
        expectTypeOf<keyof typeof contract.view>().toEqualTypeOf<ViewFunctionNames>();

        expectTypeOf(contract).not.toHaveProperty('call');
    });

    test('Contract includes only call if ABI defines only call functions', () => {
        const contract = new Contract({
            contractId: 'guestbook.testnet',
            provider: account.provider,
            abi: {
                schema_version: '0.4.0',
                metadata: {},
                body: {
                    functions: [
                        {
                            name: 'test_write',
                            kind: 'call',
                        },
                        {
                            name: 'test_write2',
                            kind: 'call',
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        expectTypeOf(contract).not.toHaveProperty('view');

        type CallFunctionNames = 'test_write' | 'test_write2';
        expectTypeOf<keyof typeof contract.call>().toEqualTypeOf<CallFunctionNames>();
    });
});

describe('Contract interface depends on how ABI is declared', () => {
    test('Contract provides autocompletion if ABI is passed using "as const" assertion', () => {
        const testAbi = {
            schema_version: '0.4.0',
            metadata: {},
            body: {
                functions: [
                    {
                        name: 'test_read',
                        kind: 'view',
                    },
                    {
                        name: 'test_write',
                        kind: 'call',
                    },
                ],
                root_schema: {},
            },
        } as const satisfies AbiRoot;

        const contract = new Contract({
            contractId: 'guestbook.testnet',
            provider: account.provider,
            abi: testAbi,
        });

        type ViewFunctionNames = 'test_read';
        expectTypeOf<keyof typeof contract.view>().toEqualTypeOf<ViewFunctionNames>();

        type CallFunctionNames = 'test_write';
        expectTypeOf<keyof typeof contract.call>().toEqualTypeOf<CallFunctionNames>();
    });

    test('Contract provides autocompletion if ABI is passed inline', () => {
        const contract = new Contract({
            contractId: 'guestbook.testnet',
            provider: account.provider,
            abi: {
                schema_version: '0.4.0',
                metadata: {},
                body: {
                    functions: [
                        {
                            name: 'test_read',
                            kind: 'view',
                        },
                        {
                            name: 'test_write',
                            kind: 'call',
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        type ViewFunctionNames = 'test_read';
        expectTypeOf<keyof typeof contract.view>().toEqualTypeOf<ViewFunctionNames>();

        type CallFunctionNames = 'test_write';
        expectTypeOf<keyof typeof contract.call>().toEqualTypeOf<CallFunctionNames>();
    });

    test('Contract returns general interface without autocompletion if ABI is typed "as AbiRoot"', () => {
        const testAbi: AbiRoot = {
            schema_version: '0.4.0',
            metadata: {},
            body: {
                functions: [
                    {
                        name: 'test_read',
                        kind: 'view',
                    },
                    {
                        name: 'test_write',
                        kind: 'call',
                    },
                ],
                root_schema: {},
            },
        };

        const contract = new Contract({
            contractId: 'guestbook.testnet',
            provider: account.provider,
            abi: testAbi,
        });

        expectTypeOf<keyof typeof contract.view>().toEqualTypeOf<string>();

        expectTypeOf<keyof typeof contract.call>().toEqualTypeOf<string>();
    });

    test('Contract returns general interface without autocompletion if ABI is defined without "as const" assertion', () => {
        const testAbi = {
            schema_version: '0.4.0',
            metadata: {},
            body: {
                functions: [
                    {
                        name: 'test_read',
                        kind: 'view' as AbiFunctionKind,
                    },
                    {
                        name: 'test_write',
                        kind: 'call' as AbiFunctionKind,
                    },
                ],
                root_schema: {},
            },
        };

        const contract = new Contract({
            contractId: 'guestbook.testnet',
            provider: account.provider,
            abi: testAbi,
        });

        expectTypeOf<keyof typeof contract.view>().toEqualTypeOf<string>();

        expectTypeOf<keyof typeof contract.call>().toEqualTypeOf<string>();
    });
});
