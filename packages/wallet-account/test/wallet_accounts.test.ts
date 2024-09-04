import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { KeyPair, PublicKey } from '@near-js/crypto';
import { InMemoryKeyStore } from '@near-js/keystores';
import { baseDecode } from '@near-js/utils';
import { InMemorySigner } from '@near-js/signers';
import { actionCreators, createTransaction, SCHEMA } from '@near-js/transactions';
import { deserialize } from 'borsh';
import localStorage from 'localstorage-memory';
import * as url from 'url';
import { WalletConnection } from '../src';


const { functionCall, transfer } = actionCreators;

let lastRedirectUrl;

// @ts-expect-error test input
global.window = {
    localStorage
};
// @ts-expect-error test input
global.document = {
    title: 'documentTitle'
};

let history;
let nearFake;
let walletConnection;
let keyStore = new InMemoryKeyStore();
describe("Wallet account tests", () => {
    beforeEach(() => {
        keyStore.clear();
        nearFake = {
            config: {
                networkId: 'networkId',
                contractName: 'contractId',
                walletUrl: 'http://example.com/wallet',
            },
            connection: {
                networkId: 'networkId',
                signer: new InMemorySigner(keyStore)
            },
            account() {
                return {
                    state() {}
                };
            }
        };
        lastRedirectUrl = null;
        history = [];
        Object.assign(global.window, {
            location: {
                href: 'http://example.com/location',
                assign(url) {
                    lastRedirectUrl = url;
                }
            },
            history: {
                replaceState: (state, title, url) => history.push([state, title, url])
            }
        });
        walletConnection = new WalletConnection(nearFake, '');
    });

    describe("fails gracefully on the server side (without window)", () => {
        const windowValueBefore = global.window;

        beforeEach(() => {
            global.window = undefined;
            keyStore.clear();
        });

        afterEach(() => {
            global.window = windowValueBefore;
        });

        it("does not throw on instantiation", () => {
            expect(() => new WalletConnection(nearFake, "")).not.toThrowError();
        });

        it("throws if non string appKeyPrefix in server context", () => {
            // @ts-expect-error test input
            expect(() => new WalletConnection(nearFake)).toThrow(
                /appKeyPrefix/
            );
            // @ts-expect-error invalid type check
            expect(() => new WalletConnection(nearFake, 1)).toThrow(
                /appKeyPrefix/
            );
            expect(() => new WalletConnection(nearFake, null)).toThrow(
                /appKeyPrefix/
            );
            expect(() => new WalletConnection(nearFake, undefined)).toThrow(
                /appKeyPrefix/
            );
        });

        it("returns an empty string as accountId", () => {
            const serverWalletConnection = new WalletConnection(nearFake, "");
            expect(serverWalletConnection.getAccountId()).toEqual("");
        });

        it("returns false as isSignedIn", () => {
            const serverWalletConnection = new WalletConnection(nearFake, "");
            expect(serverWalletConnection.isSignedIn()).toEqual(false);
        });

        it("throws explicit error when calling other methods on the instance", () => {
            const serverWalletConnection = new WalletConnection(nearFake, "");
            expect(() =>
                serverWalletConnection.requestSignIn(
                    "signInContract",
                    // @ts-expect-error test input
                    "signInTitle",
                    "http://example.com/success",
                    "http://example.com/fail"
                )
            ).toThrow(
                /please ensure you are using WalletConnection on the browser/
            );
            expect(() =>
                serverWalletConnection.requestSignInUrl(
                    "signInContract",
                    // @ts-expect-error test input
                    "signInTitle",
                    "http://example.com/success",
                    "http://example.com/fail"
                )
            ).toThrow(
                /please ensure you are using WalletConnection on the browser/
            );
            expect(() =>
                serverWalletConnection.requestSignTransactions(
                    "signInContract",
                    // @ts-expect-error test input
                    "signInTitle",
                    "http://example.com/success",
                    "http://example.com/fail"
                )
            ).toThrow(
                /please ensure you are using WalletConnection on the browser/
            );
            expect(() =>
                serverWalletConnection.requestSignTransactionsUrl(
                    "signInContract",
                    // @ts-expect-error test input
                    "signInTitle",
                    "http://example.com/success",
                    "http://example.com/fail"
                )
            ).toThrow(
                /please ensure you are using WalletConnection on the browser/
            );
        });

        it("can access other props on the instance", () => {
            const serverWalletConnection = new WalletConnection(nearFake, "");
            expect(serverWalletConnection["randomValue"]).toEqual(undefined);
        });
    });

    describe("can request sign in", () => {
        beforeEach(() => keyStore.clear());

        it("V2", () => {
            return walletConnection.requestSignIn({
                contractId: "signInContract",
                successUrl: "http://example.com/success",
                failureUrl: "http://example.com/fail",
            });
        });

        afterEach(async () => {
            let accounts = await keyStore.getAccounts("networkId");
            expect(accounts).toHaveLength(1);
            expect(accounts[0]).toMatch(/^pending_key.+/);
            expect(url.parse(lastRedirectUrl, true)).toMatchObject({
                protocol: "http:",
                host: "example.com",
                query: {
                    contract_id: "signInContract",
                    success_url: "http://example.com/success",
                    failure_url: "http://example.com/fail",
                    public_key: (
                        await keyStore.getKey("networkId", accounts[0])
                      // @ts-expect-error test input
                    ).publicKey.toString(),
                },
            });
        });
    });

    it("can request sign in with methodNames", async () => {
        await walletConnection.requestSignIn({
            contractId: "signInContract",
            methodNames: ["hello", "goodbye"],
            successUrl: "http://example.com/success",
            failureUrl: "http://example.com/fail",
        });

        let accounts = await keyStore.getAccounts("networkId");
        expect(accounts).toHaveLength(1);
        expect(accounts[0]).toMatch(/^pending_key.+/);
        expect(url.parse(lastRedirectUrl, true)).toMatchObject({
            protocol: "http:",
            host: "example.com",
            query: {
                contract_id: "signInContract",
                methodNames: ["hello", "goodbye"],
                success_url: "http://example.com/success",
                failure_url: "http://example.com/fail",
                public_key: (
                    await keyStore.getKey("networkId", accounts[0])
                  // @ts-expect-error test input
                ).publicKey.toString(),
            },
        });
    });

    it("can complete sign in", async () => {
        const keyPair = KeyPair.fromRandom("ed25519");
        // @ts-expect-error test input
        global.window.location.href = `http://example.com/location?account_id=near.account&public_key=${keyPair.publicKey}`;
        await keyStore.setKey(
            "networkId",
            // @ts-expect-error test input
            "pending_key" + keyPair.publicKey,
            keyPair
        );

        await walletConnection._completeSignInWithAccessKey();

        expect(await keyStore.getKey("networkId", "near.account")).toEqual(
            keyPair
        );
        expect(localStorage.getItem("contractId_wallet_auth_key"));
        expect(history.slice(1)).toEqual([
            [{}, "documentTitle", "http://example.com/location"],
        ]);
    });

    it("Promise until complete sign in", async () => {
        const keyPair = KeyPair.fromRandom("ed25519");
        // @ts-expect-error test input
        global.window.location.href = `http://example.com/location?account_id=near2.account&public_key=${keyPair.publicKey}`;
        await keyStore.setKey(
            "networkId",
            // @ts-expect-error test input
            "pending_key" + keyPair.publicKey,
            keyPair
        );

        const newWalletConn = new WalletConnection(
            nearFake,
            "promise_on_complete_signin"
        );

        expect(newWalletConn.isSignedIn()).toEqual(false);
        expect(await newWalletConn.isSignedInAsync()).toEqual(true);
        expect(await keyStore.getKey("networkId", "near2.account")).toEqual(
            keyPair
        );
        expect(
            localStorage.getItem("promise_on_complete_signin_wallet_auth_key")
        );
        expect(history).toEqual([
            [{}, "documentTitle", "http://example.com/location"],
        ]);
    });

    const BLOCK_HASH = "244ZQ9cgj3CQ6bWBdytfrJMuMQ1jdXLFGnr4HhvtCTnM";
    const blockHash = baseDecode(BLOCK_HASH);
    function createTransferTx() {
        const actions = [transfer(1n)];
        return createTransaction(
            "test.near",
            PublicKey.fromString(
                "Anu7LYDfpLtkP7E16LT9imXF694BdQaa9ufVkQiwTQxC"
            ),
            "whatever.near",
            1,
            actions,
            blockHash
        );
    }

    describe("can request transaction signing", () => {
        it("V1", async () => {
            await walletConnection.requestSignTransactions({
                transactions: [createTransferTx()],
                callbackUrl: "http://example.com/callback",
            });

            expect(url.parse(lastRedirectUrl, true)).toMatchObject({
                protocol: "http:",
                host: "example.com",
                query: {
                    callbackUrl: "http://example.com/callback",
                    transactions:
                        "CQAAAHRlc3QubmVhcgCRez0mjUtY9/7BsVC9aNab4+5dTMOYVeNBU4Rlu3eGDQEAAAAAAAAADQAAAHdoYXRldmVyLm5lYXIPpHP9JpAd8pa+atxMxN800EDvokNSJLaYaRDmMML+9gEAAAADAQAAAAAAAAAAAAAAAAAAAA==",
                },
            });
        });

        it("V2", async () => {
            await walletConnection.requestSignTransactions({
                transactions: [createTransferTx()],
                meta: "something",
                callbackUrl: "http://example.com/after",
            });

            expect(url.parse(lastRedirectUrl, true)).toMatchObject({
                protocol: "http:",
                host: "example.com",
                query: {
                    meta: "something",
                    callbackUrl: "http://example.com/after",
                    transactions:
                        "CQAAAHRlc3QubmVhcgCRez0mjUtY9/7BsVC9aNab4+5dTMOYVeNBU4Rlu3eGDQEAAAAAAAAADQAAAHdoYXRldmVyLm5lYXIPpHP9JpAd8pa+atxMxN800EDvokNSJLaYaRDmMML+9gEAAAADAQAAAAAAAAAAAAAAAAAAAA==",
                },
            });
        });
    });

    function parseTransactionsFromUrl(
        urlToParse,
        callbackUrl = "http://example.com/location"
    ) {
        const parsedUrl = url.parse(urlToParse, true);
        expect(parsedUrl).toMatchObject({
            protocol: "http:",
            host: "example.com",
            query: {
                callbackUrl,
            },
        });
        const transactions = parsedUrl.query.transactions
            // @ts-expect-error test input
            .split(",")
            .map((txBase64) =>
                deserialize(SCHEMA.Transaction, Buffer.from(txBase64, "base64"))
            );
        return transactions;
    }

    function setupWalletConnectionForSigning({ allKeys, accountAccessKeys }) {
        walletConnection._authData = {
            allKeys: allKeys,
            accountId: "signer.near",
        };
        nearFake.connection.provider = {
            query(params) {
                if (
                    params.request_type === "view_account" &&
                    params.account_id === "signer.near"
                ) {
                    return {};
                }
                if (
                    params.request_type === "view_access_key_list" &&
                    params.account_id === "signer.near"
                ) {
                    return { keys: accountAccessKeys };
                }
                if (
                    params.request_type === "view_access_key" &&
                    params.account_id === "signer.near"
                ) {
                    for (let accessKey of accountAccessKeys) {
                        if (accessKey.public_key === params.public_key) {
                            return accessKey;
                        }
                    }
                }
                throw new Error(`Unexpected query: ${JSON.stringify(params)}`);
            },
            sendTransaction() {
                return {
                    transaction_outcome: { outcome: { logs: [] } },
                    receipts_outcome: [],
                };
            },
            block() {
                return {
                    header: {
                        hash: BLOCK_HASH,
                    },
                };
            },
        };
    }

    describe("requests transaction signing automatically when there is no local key", () => {
        const keyPair = KeyPair.fromRandom("ed25519");
        let transactions;
        beforeEach(() => {
            setupWalletConnectionForSigning({
                // @ts-expect-error test input
                allKeys: ["no_such_access_key", keyPair.publicKey.toString()],
                accountAccessKeys: [
                    {
                        access_key: {
                            nonce: 1,
                            permission: "FullAccess",
                        },
                        // @ts-expect-error test input
                        public_key: keyPair.publicKey.toString(),
                    },
                ],
            });
        });

        it("V2", async () => {
            let failed = true;
            try {
                await walletConnection.account().signAndSendTransaction({
                    receiverId: "receiver.near",
                    actions: [transfer(1n)],
                    walletCallbackUrl: "http://callback.com/callback",
                });
                failed = false;
            } catch (e) {
                expect(e.message).toEqual(
                    "Failed to redirect to sign transaction"
                );
            }
            if (!failed) {
                throw new Error("expected to throw");
            }
            transactions = parseTransactionsFromUrl(
                lastRedirectUrl,
                "http://callback.com/callback"
            );
        });

        afterEach(() => {
            expect(transactions).toHaveLength(1);
            expect(transactions[0]).toMatchObject({
                signerId: "signer.near",
                // nonce: new BN(2)
                receiverId: "receiver.near",
                actions: [
                    {
                        transfer: {
                            // deposit: new BN(1)
                        },
                    },
                ],
            });
            expect(transactions[0].nonce.toString()).toEqual("2");
            expect(
                transactions[0].actions[0].transfer.deposit.toString()
            ).toEqual("1");
          const txData = transactions[0].publicKey.ed25519Key.data ? transactions[0].publicKey.ed25519Key.data : transactions[0].publicKey.secp256k1Key.data;
          const publicKey = keyPair.getPublicKey();
          const keyPairData = publicKey.ed25519Key.data ? publicKey.ed25519Key.data : publicKey.secp256k1Key.data;
            expect(Buffer.from(txData)).toEqual(
                Buffer.from(keyPairData)
            );
        });
    });

    describe("requests transaction signing automatically when function call has attached deposit", () => {
        beforeEach(async () => {
            const localKeyPair = KeyPair.fromRandom("ed25519");
            const walletKeyPair = KeyPair.fromRandom("ed25519");
            setupWalletConnectionForSigning({
                // @ts-expect-error test input
                allKeys: [walletKeyPair.publicKey.toString()],
                accountAccessKeys: [
                    {
                        access_key: {
                            nonce: 1,
                            permission: {
                                FunctionCall: {
                                    allowance: "1000000000",
                                    receiver_id: "receiver.near",
                                    method_names: [],
                                },
                            },
                        },
                        // @ts-expect-error test input
                        public_key: localKeyPair.publicKey.toString(),
                    },
                    {
                        access_key: {
                            nonce: 1,
                            permission: "FullAccess",
                        },
                        // @ts-expect-error test input
                        public_key: walletKeyPair.publicKey.toString(),
                    },
                ],
            });
            await keyStore.setKey("networkId", "signer.near", localKeyPair);
        });

        it("V2", async () => {
            let failed = true;
            try {
                await walletConnection.account().signAndSendTransaction({
                    receiverId: "receiver.near",
                    actions: [
                        functionCall(
                            "someMethod",
                            new Uint8Array(),
                            1n,
                            1n
                        ),
                    ],
                    walletCallbackUrl: "http://example.com/after",
                    walletMeta: "someStuff",
                });
                failed = false;
            } catch (e) {
                expect(e.message).toEqual(
                    "Failed to redirect to sign transaction"
                );
            }

            if (!failed) {
                throw new Error("expected to throw");
            }

            const transactions = parseTransactionsFromUrl(
                lastRedirectUrl,
                "http://example.com/after"
            );
            expect(transactions).toHaveLength(1);
        });
    });
});
