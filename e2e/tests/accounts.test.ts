import { expect, beforeAll, afterAll, test } from "vitest";

import { Account } from "@near-js/accounts";
import { NEAR } from "@near-js/tokens";
import { JsonRpcProvider } from "@near-js/providers";

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
