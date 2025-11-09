import { afterAll, beforeAll, expect, test } from "bun:test";

import { Account } from "@near-js/accounts";
import { JsonRpcProvider } from "@near-js/providers";
import { NEAR } from "@near-js/tokens";
import {
    actionCreators,
    GlobalContractDeployMode,
    GlobalContractIdentifier,
} from "@near-js/transactions";

import { KeyPair, KeyPairString } from "@near-js/crypto";
import { KeyPairSigner } from "@near-js/signers";
import { initSandbox, shutdownSandbox } from "./sandbox.js";

let workerInfo;
let rootAccount: Account;

beforeAll(async () => {
    workerInfo = await initSandbox();

    const provider = new JsonRpcProvider({ url: workerInfo.rpcUrl });
    const signer = KeyPairSigner.fromSecretKey(
        workerInfo.secretKey as KeyPairString
    );

    rootAccount = new Account(workerInfo.rootAccountId, provider, signer);
}, 60000);

afterAll(async () => {
    await shutdownSandbox();
});

test("root account balance is zero", async () => {
    const balance = await rootAccount.getBalance(NEAR);

    expect(balance).toBe(1000000000000000000000000000000000n);
});

test(
    "root account creates sub-account",
    async () => {
        const key = KeyPair.fromRandom("ed25519");

        const newAccountId = `sub.${rootAccount.accountId}`;
        const { transaction } = await rootAccount.createAccount(
            newAccountId,
            key.getPublicKey(),
            0n
        );

        await rootAccount.provider.viewTransactionStatus(
            transaction.hash,
            rootAccount.accountId,
            "FINAL"
        );

        const { amount } = await rootAccount.provider.viewAccount(newAccountId);

        expect(amount).toBe(0n);
    },
    { timeout: 60000 }
);

test(
    "account can send meta transaction with Transfer",
    async () => {
        const newAccountId = `${Date.now()}.${rootAccount.accountId}`;
        const keypair = KeyPair.fromRandom("ed25519");
        await rootAccount.createAccount(newAccountId, keypair.getPublicKey());
        const childAccount = new Account(
            newAccountId,
            rootAccount.provider,
            new KeyPairSigner(keypair)
        );

        const [, signedDelegate] =
            await childAccount.createSignedMetaTransaction(
                childAccount.accountId,
                [actionCreators.transfer(1_000_000n)]
            );

        const outcome = await rootAccount.signAndSendTransaction({
            receiverId: signedDelegate.delegateAction.senderId,
            actions: [actionCreators.signedDelegate(signedDelegate)],
            waitUntil: "FINAL",
        });

        expect(outcome.status).toHaveProperty("SuccessValue");
        // @ts-expect-error we checked the existance previously
        expect(outcome.status.SuccessValue).toBe("");
    },
    { timeout: 60000 }
);

test(
    "account can send meta transaction with DeployGlobalContract(AccountId)",
    async () => {
        const newAccountId = `${Date.now()}.${rootAccount.accountId}`;
        const keypair = KeyPair.fromRandom("ed25519");
        await rootAccount.createAccount(newAccountId, keypair.getPublicKey());
        const childAccount = new Account(
            newAccountId,
            rootAccount.provider,
            new KeyPairSigner(keypair)
        );

        const [, signedDelegate] =
            await childAccount.createSignedMetaTransaction(
                childAccount.accountId,
                [
                    actionCreators.deployGlobalContract(
                        new Uint8Array(128),
                        new GlobalContractDeployMode({ AccountId: null })
                    ),
                ]
            );

        const outcome = await rootAccount.signAndSendTransaction({
            receiverId: signedDelegate.delegateAction.senderId,
            actions: [actionCreators.signedDelegate(signedDelegate)],
            waitUntil: "FINAL",
        });

        expect(outcome.status).toHaveProperty("SuccessValue");
        // @ts-expect-error we checked the existance previously
        expect(outcome.status.SuccessValue).toBe("");
    },
    { timeout: 60000 }
);

test(
    "account can send meta transaction with DeployGlobalContract(CodeHash)",
    async () => {
        const newAccountId = `${Date.now()}.${rootAccount.accountId}`;
        const keypair = KeyPair.fromRandom("ed25519");
        await rootAccount.createAccount(newAccountId, keypair.getPublicKey());
        const childAccount = new Account(
            newAccountId,
            rootAccount.provider,
            new KeyPairSigner(keypair)
        );

        const [, signedDelegate] =
            await childAccount.createSignedMetaTransaction(
                childAccount.accountId,
                [
                    actionCreators.deployGlobalContract(
                        new Uint8Array(128),
                        new GlobalContractDeployMode({ CodeHash: null })
                    ),
                ]
            );

        const outcome = await rootAccount.signAndSendTransaction({
            receiverId: signedDelegate.delegateAction.senderId,
            actions: [actionCreators.signedDelegate(signedDelegate)],
            waitUntil: "FINAL",
        });

        expect(outcome.status).toHaveProperty("SuccessValue");
        // @ts-expect-error we checked the existance previously
        expect(outcome.status.SuccessValue).toBe("");
    },
    { timeout: 60000 }
);

test(
    "account can send meta transaction with UseGlobalContract(AccountId)",
    async () => {
        const newAccountId = `${Date.now()}.${rootAccount.accountId}`;
        const keypair = KeyPair.fromRandom("ed25519");
        await rootAccount.createAccount(newAccountId, keypair.getPublicKey());
        const childAccount = new Account(
            newAccountId,
            rootAccount.provider,
            new KeyPairSigner(keypair)
        );

        const [, signedDelegate] =
            await childAccount.createSignedMetaTransaction(
                childAccount.accountId,
                [
                    actionCreators.useGlobalContract(
                        new GlobalContractIdentifier({
                            AccountId: "global.testnet",
                        })
                    ),
                ]
            );

        const outcome = await rootAccount.signAndSendTransaction({
            receiverId: signedDelegate.delegateAction.senderId,
            actions: [actionCreators.signedDelegate(signedDelegate)],
            waitUntil: "FINAL",
        });

        expect(outcome.status).toHaveProperty("SuccessValue");
        // @ts-expect-error we checked the existance previously
        expect(outcome.status.SuccessValue).toBe("");
    },
    { timeout: 60000 }
);

test(
    "account can send meta transaction with UseGlobalContract(CodeHash)",
    async () => {
        const newAccountId = `${Date.now()}.${rootAccount.accountId}`;
        const keypair = KeyPair.fromRandom("ed25519");
        await rootAccount.createAccount(newAccountId, keypair.getPublicKey());
        const childAccount = new Account(
            newAccountId,
            rootAccount.provider,
            new KeyPairSigner(keypair)
        );

        const [, signedDelegate] =
            await childAccount.createSignedMetaTransaction(
                childAccount.accountId,
                [
                    actionCreators.useGlobalContract(
                        new GlobalContractIdentifier({
                            CodeHash: new Uint8Array(32),
                        })
                    ),
                ]
            );

        const outcome = await rootAccount.signAndSendTransaction({
            receiverId: signedDelegate.delegateAction.senderId,
            actions: [actionCreators.signedDelegate(signedDelegate)],
            waitUntil: "FINAL",
        });

        expect(outcome.status).toHaveProperty("SuccessValue");
        // @ts-expect-error we checked the existance previously
        expect(outcome.status.SuccessValue).toBe("");
    },
    { timeout: 60000 }
);

test(
    "account can send multiple consecutive transfers without nonce collisions",
    async () => {
        const newAccountId = `${Date.now()}.${rootAccount.accountId}`;
        const keypair = KeyPair.fromRandom("ed25519");
        await rootAccount.createAccount(
            newAccountId,
            keypair.getPublicKey(),
            NEAR.toUnits("1")
        );

        const account = new Account(
            newAccountId,
            rootAccount.provider,
            new KeyPairSigner(keypair)
        );

        // First transfer
        await account.transfer({
            receiverId: account.accountId,
            amount: NEAR.toUnits("0.001"),
        });

        // Second transfer
        await account.transfer({
            receiverId: account.accountId,
            amount: NEAR.toUnits("0.001"),
        });
    },
    { repeats: 2, timeout: 60000 } // run 3 times in total no matter what, to prevent flaky passes
);
