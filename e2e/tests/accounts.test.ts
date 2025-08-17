import { expect, beforeAll, afterAll, test } from "vitest";

import { Account } from "@near-js/accounts";
import { NEAR } from "@near-js/tokens";
import { JsonRpcProvider } from "@near-js/providers";
import {
    actionCreators,
    GlobalContractDeployMode,
    GlobalContractIdentifier,
} from "@near-js/transactions";

import { Worker } from "near-workspaces";
import { KeyPair, KeyPairString } from "@near-js/crypto";
import { KeyPairSigner } from "@near-js/signers";
import { getRpcUrl, getSecretKey } from "./worker";

let worker: Worker;
let rootAccount: Account;

beforeAll(async () => {
    worker = await Worker.init();

    const provider = new JsonRpcProvider({ url: getRpcUrl(worker) });
    const signer = KeyPairSigner.fromSecretKey(
        getSecretKey(worker) as KeyPairString
    );

    rootAccount = new Account(worker.rootAccount.accountId, provider, signer);
});

afterAll(async () => {
    if (!worker) return;

    await worker.tearDown();
});

test("root account balance is zero", async () => {
    const balance = await rootAccount.getBalance(NEAR);

    expect(balance).toBe(1000000000000000000000000000000000n);
});

test("root account creates sub-account", async () => {
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
});

test("account can send meta transaction with Transfer", async () => {
    const newAccountId = `${Date.now()}.${rootAccount.accountId}`;
    const keypair = KeyPair.fromRandom("ed25519");
    await rootAccount.createAccount(newAccountId, keypair.getPublicKey());
    const childAccount = new Account(
        newAccountId,
        rootAccount.provider,
        new KeyPairSigner(keypair)
    );

    const [, signedDelegate] = await childAccount.createSignedMetaTransaction(
        childAccount.accountId,
        [
            actionCreators.transfer(1_000_000n),
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
});

test("account can send meta transaction with DeployGlobalContract(AccountId)", async () => {
    const newAccountId = `${Date.now()}.${rootAccount.accountId}`;
    const keypair = KeyPair.fromRandom("ed25519");
    await rootAccount.createAccount(newAccountId, keypair.getPublicKey());
    const childAccount = new Account(
        newAccountId,
        rootAccount.provider,
        new KeyPairSigner(keypair)
    );

    const [, signedDelegate] = await childAccount.createSignedMetaTransaction(
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
});

test("account can send meta transaction with DeployGlobalContract(CodeHash)", async () => {
    const newAccountId = `${Date.now()}.${rootAccount.accountId}`;
    const keypair = KeyPair.fromRandom("ed25519");
    await rootAccount.createAccount(newAccountId, keypair.getPublicKey());
    const childAccount = new Account(
        newAccountId,
        rootAccount.provider,
        new KeyPairSigner(keypair)
    );

    const [, signedDelegate] = await childAccount.createSignedMetaTransaction(
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
});

test("account can send meta transaction with UseGlobalContract(AccountId)", async () => {
    const newAccountId = `${Date.now()}.${rootAccount.accountId}`;
    const keypair = KeyPair.fromRandom("ed25519");
    await rootAccount.createAccount(newAccountId, keypair.getPublicKey());
    const childAccount = new Account(
        newAccountId,
        rootAccount.provider,
        new KeyPairSigner(keypair)
    );

    const [, signedDelegate] = await childAccount.createSignedMetaTransaction(
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
});

test("account can send meta transaction with UseGlobalContract(CodeHash)", async () => {
    const newAccountId = `${Date.now()}.${rootAccount.accountId}`;
    const keypair = KeyPair.fromRandom("ed25519");
    await rootAccount.createAccount(newAccountId, keypair.getPublicKey());
    const childAccount = new Account(
        newAccountId,
        rootAccount.provider,
        new KeyPairSigner(keypair)
    );

    const [, signedDelegate] = await childAccount.createSignedMetaTransaction(
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
});
