import { describe, expectTypeOf, test } from "bun:test";

import { AbiRoot, Account, TypedContract } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";

import { KeyPair } from "@near-js/crypto";
import { KeyPairSigner } from "@near-js/signers";
import { BlockReference, TxExecutionStatus } from "@near-js/types";
import { abi as guestbookAbi } from "../contracts/guestbook/abi.js";

type AbiFunctionKind = AbiRoot["body"]["functions"][number]["kind"];

const provider = new JsonRpcProvider({ url: "" });
const keypair = KeyPair.fromRandom("ed25519");
const signer = new KeyPairSigner(keypair);
const account = new Account("", provider, signer);
type Extends<A, B> = [A] extends [B] ? true : false;
const expectExtends = <T extends true>() => undefined;

describe("TypedContract can infer Guestbook's ABI", () => {
    const contract = new TypedContract({
        contractId: "guestbook.testnet",
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
        type ExpectedGetMessagesFunction = (
            params?: ExpectedGetMessagesParams | undefined
        ) => Promise<
            {
                premium: boolean;
                sender: string;
                text: string;
            }[]
        >;

        expectExtends<
            Extends<
                typeof contract.view.get_messages,
                ExpectedGetMessagesFunction
            >
        >();
        expectExtends<
            Extends<
                ExpectedGetMessagesFunction,
                typeof contract.view.get_messages
            >
        >();
    });

    test('"total_messages" view function', () => {
        type ExpectedTotalMessagesFunction = (params?: {
            blockQuery?: BlockReference;
        }) => Promise<number>;

        expectExtends<
            Extends<
                typeof contract.view.total_messages,
                ExpectedTotalMessagesFunction
            >
        >();
        expectExtends<
            Extends<
                ExpectedTotalMessagesFunction,
                typeof contract.view.total_messages
            >
        >();
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

        expectExtends<
            Extends<
                typeof contract.call.add_message,
                ExpectedAddMessageFunction
            >
        >();
        expectExtends<
            Extends<
                ExpectedAddMessageFunction,
                typeof contract.call.add_message
            >
        >();
    });
});

describe("TypedContract can infer general interface without ABI", () => {
    const contract = new TypedContract({
        contractId: "guestbook.testnet",
        provider: account.provider,
    });

    test("any view function", () => {
        type ExpectedViewFunction = <Response>(params?: {
            blockQuery?: BlockReference;
            args?: Record<string, unknown>;
        }) => Promise<Response>;

        expectExtends<
            Extends<
                typeof contract.view,
                {
                    [_: string]: ExpectedViewFunction;
                }
            >
        >();
        expectExtends<
            Extends<
                {
                    [_: string]: ExpectedViewFunction;
                },
                typeof contract.view
            >
        >();
        expectExtends<
            Extends<
                typeof contract.view.it_could_be_anything,
                ExpectedViewFunction
            >
        >();
        expectExtends<
            Extends<
                ExpectedViewFunction,
                typeof contract.view.it_could_be_anything
            >
        >();
    });

    test("any call function", () => {
        type ExpectedCallFunction = <Response>(params: {
            deposit?: bigint;
            gas?: bigint;
            account: Account;
            waitUntil?: TxExecutionStatus;
            args?: Record<string, unknown>;
        }) => Promise<Response>;

        expectExtends<
            Extends<
                typeof contract.call,
                {
                    [_: string]: ExpectedCallFunction;
                }
            >
        >();
        expectExtends<
            Extends<
                {
                    [_: string]: ExpectedCallFunction;
                },
                typeof contract.call
            >
        >();
        expectExtends<
            Extends<
                typeof contract.call.it_could_be_anything,
                ExpectedCallFunction
            >
        >();
        expectExtends<
            Extends<
                ExpectedCallFunction,
                typeof contract.call.it_could_be_anything
            >
        >();
    });
});

describe("TypedContract shape adapts to ABI", () => {
    test("TypedContract infers nothing from empty ABI", () => {
        const emptyAbi = {
            schema_version: "0.4.0",
            metadata: {},
            body: {
                functions: [],
                root_schema: {},
            },
        } as const satisfies AbiRoot;

        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: emptyAbi,
        });

        expectExtends<
            Extends<
                typeof contract,
                {
                    abi: typeof emptyAbi;
                    contractId: "guestbook.testnet";
                }
            >
        >();
        expectExtends<
            Extends<
                {
                    abi: typeof emptyAbi;
                    contractId: "guestbook.testnet";
                },
                typeof contract
            >
        >();
    });

    test("TypedContract includes both kind of methods if ABI defines both view and call functions", () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test_read",
                            kind: "view",
                        },
                        {
                            name: "test_read2",
                            kind: "view",
                        },
                        { name: "test_write", kind: "call" },
                        { name: "test_write2", kind: "call" },
                    ],
                    root_schema: {},
                },
            },
        });

        type ViewFunctionNames = "test_read" | "test_read2";
        expectExtends<
            Extends<keyof typeof contract.view, ViewFunctionNames>
        >();
        expectExtends<
            Extends<ViewFunctionNames, keyof typeof contract.view>
        >();

        type CallFunctionNames = "test_write" | "test_write2";
        expectExtends<
            Extends<keyof typeof contract.call, CallFunctionNames>
        >();
        expectExtends<
            Extends<CallFunctionNames, keyof typeof contract.call>
        >();
    });

    test("TypedContract includes only view methods if ABI defines only view functions", () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test_read",
                            kind: "view",
                        },
                        {
                            name: "test_read2",
                            kind: "view",
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        type ViewFunctionNames = "test_read" | "test_read2";
        expectExtends<
            Extends<keyof typeof contract.view, ViewFunctionNames>
        >();
        expectExtends<
            Extends<ViewFunctionNames, keyof typeof contract.view>
        >();

        expectTypeOf(contract).not.toHaveProperty("call");
    });

    test("TypedContract includes only call if ABI defines only call functions", () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test_write",
                            kind: "call",
                        },
                        {
                            name: "test_write2",
                            kind: "call",
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        expectTypeOf(contract).not.toHaveProperty("view");

        type CallFunctionNames = "test_write" | "test_write2";
        expectExtends<
            Extends<keyof typeof contract.call, CallFunctionNames>
        >();
        expectExtends<
            Extends<CallFunctionNames, keyof typeof contract.call>
        >();
    });
});

describe("TypedContract interface depends on how ABI is declared", () => {
    test('TypedContract provides autocompletion if ABI is passed using "as const" assertion', () => {
        const testAbi = {
            schema_version: "0.4.0",
            metadata: {},
            body: {
                functions: [
                    {
                        name: "test_read",
                        kind: "view",
                    },
                    {
                        name: "test_write",
                        kind: "call",
                    },
                ],
                root_schema: {},
            },
        } as const satisfies AbiRoot;

        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: testAbi,
        });

        type ViewFunctionNames = "test_read";
        expectExtends<
            Extends<keyof typeof contract.view, ViewFunctionNames>
        >();
        expectExtends<
            Extends<ViewFunctionNames, keyof typeof contract.view>
        >();

        type CallFunctionNames = "test_write";
        expectExtends<
            Extends<keyof typeof contract.call, CallFunctionNames>
        >();
        expectExtends<
            Extends<CallFunctionNames, keyof typeof contract.call>
        >();
    });

    test("TypedContract provides autocompletion if ABI is passed inline", () => {
        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: {
                schema_version: "0.4.0",
                metadata: {},
                body: {
                    functions: [
                        {
                            name: "test_read",
                            kind: "view",
                        },
                        {
                            name: "test_write",
                            kind: "call",
                        },
                    ],
                    root_schema: {},
                },
            },
        });

        type ViewFunctionNames = "test_read";
        expectExtends<
            Extends<keyof typeof contract.view, ViewFunctionNames>
        >();
        expectExtends<
            Extends<ViewFunctionNames, keyof typeof contract.view>
        >();

        type CallFunctionNames = "test_write";
        expectExtends<
            Extends<keyof typeof contract.call, CallFunctionNames>
        >();
        expectExtends<
            Extends<CallFunctionNames, keyof typeof contract.call>
        >();
    });

    test('TypedContract returns general interface without autocompletion if ABI is typed "as AbiRoot"', () => {
        const testAbi: AbiRoot = {
            schema_version: "0.4.0",
            metadata: {},
            body: {
                functions: [
                    {
                        name: "test_read",
                        kind: "view",
                    },
                    {
                        name: "test_write",
                        kind: "call",
                    },
                ],
                root_schema: {},
            },
        };

        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: testAbi,
        });

        expectExtends<Extends<keyof typeof contract.view, string>>();
        expectExtends<Extends<string, keyof typeof contract.view>>();

        expectExtends<Extends<keyof typeof contract.call, string>>();
        expectExtends<Extends<string, keyof typeof contract.call>>();
    });

    test('TypedContract returns general interface without autocompletion if ABI is defined without "as const" assertion', () => {
        const testAbi = {
            schema_version: "0.4.0",
            metadata: {},
            body: {
                functions: [
                    {
                        name: "test_read",
                        kind: "view" as AbiFunctionKind,
                    },
                    {
                        name: "test_write",
                        kind: "call" as AbiFunctionKind,
                    },
                ],
                root_schema: {},
            },
        };

        const contract = new TypedContract({
            contractId: "guestbook.testnet",
            provider: account.provider,
            abi: testAbi,
        });

        expectExtends<Extends<keyof typeof contract.view, string>>();
        expectExtends<Extends<string, keyof typeof contract.view>>();

        expectExtends<Extends<keyof typeof contract.call, string>>();
        expectExtends<Extends<string, keyof typeof contract.call>>();
    });
});
