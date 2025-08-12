import { expect, beforeAll, afterAll, test } from "vitest";

import { Account, Contract } from "@near-js/accounts";
import { NEAR } from "@near-js/tokens";
import { JsonRpcProvider } from "@near-js/providers";

import { Worker } from "near-workspaces";
import { KeyPair, KeyPairString } from "@near-js/crypto";
import { KeyPairSigner } from "@near-js/signers";
import { getRpcUrl, getSecretKey } from "./worker";
import { abi } from "../contracts/guestbook/abi";
import { readFile } from "fs/promises";

let worker: Worker;
let rootAccount: Account;
let guestbookAccount: Account;

beforeAll(async () => {
    worker = await Worker.init();

    const provider = new JsonRpcProvider({ url: getRpcUrl(worker) });
    const signer = KeyPairSigner.fromSecretKey(
        getSecretKey(worker) as KeyPairString
    );

    // @ts-expect-error it's fixed
    rootAccount = new Account(worker.rootAccount.accountId, provider, signer);

    await rootAccount.createAccount(
        `guestbook.${rootAccount.accountId}`,
        await signer.getPublicKey(),
        NEAR.toUnits("10")
    );
    guestbookAccount = new Account(
        `guestbook.${rootAccount.accountId}`,
        // @ts-expect-error it's fixed
        provider,
        signer
    );

    const wasm = await readFile("./contracts/guestbook/contract.wasm");
    const tx = await guestbookAccount.deployContract(wasm);
    await rootAccount.provider.viewTransactionStatus(
        tx.transaction.hash,
        guestbookAccount.accountId,
        "FINAL"
    );
});

afterAll(async () => {
    if (!worker) return;

    await worker.tearDown();
});

test("contract has abi", async () => {
    const contract = new Contract({
        contractId: guestbookAccount.accountId,
        provider: rootAccount.provider,
        abi: abi,
    });

    expect(contract.abi).toBe(abi);
});

test("contract has contractId", async () => {
    const contract = new Contract({
        contractId: guestbookAccount.accountId,
        provider: rootAccount.provider,
        abi: abi,
    });

    expect(contract.contractId).toBe(guestbookAccount.accountId);
});

test("contract has view & call properties even if ABI isn't provided", async () => {
    const contract = new Contract({
        contractId: guestbookAccount.accountId,
        provider: rootAccount.provider,
    });

    expect(contract).toHaveProperty('view');
    expect(contract).toHaveProperty('call');
});

test("contract doesn't have abi if ABI isn't provided", async () => {
    const contract = new Contract({
        contractId: guestbookAccount.accountId,
        provider: rootAccount.provider,
    });

    expect(contract).not.toHaveProperty('abi');
});

test("contract doesn't have view & call properties if ABI is empty", async () => {
    const contract = new Contract({
        contractId: guestbookAccount.accountId,
        provider: rootAccount.provider,
        abi: {
            schema_version: '0.4.0',
            metadata: {},
            body: {
                functions: [],
                root_schema: {}
            }
        }
    });

    expect(contract.contractId).not.toHaveProperty('view');
    expect(contract.contractId).not.toHaveProperty('call');
});

test("contract can invoke a view function", async () => {
    // TODO: use fixtures for account creation and contract deploy
    const contractId = `${Date.now()}.${rootAccount.accountId}`;
    const keypair = KeyPair.fromRandom("ed25519");

    await rootAccount.createAccount(
        contractId,
        keypair.getPublicKey(),
        NEAR.toUnits("10")
    );
    const guestbookAccount = new Account(
        contractId,
        rootAccount.provider,
        new KeyPairSigner(keypair)
    );

    const wasm = await readFile("./contracts/guestbook/contract.wasm");
    const tx = await guestbookAccount.deployContract(wasm);
    await rootAccount.provider.viewTransactionStatus(
        tx.transaction.hash,
        guestbookAccount.accountId,
        "FINAL"
    );

    const contract = new Contract({
        contractId: guestbookAccount.accountId,
        provider: rootAccount.provider,
        abi: abi,
    });

    const totalMessages = await contract.view.total_messages();

    expect(totalMessages).toBe(0);
});

test("contract can invoke a call function", async () => {
    // TODO: use fixtures for account creation and contract deploy
    const contractId = `${Date.now()}.${rootAccount.accountId}`;
    const keypair = KeyPair.fromRandom("ed25519");

    await rootAccount.createAccount(
        contractId,
        keypair.getPublicKey(),
        NEAR.toUnits("10")
    );
    const guestbookAccount = new Account(
        contractId,
        rootAccount.provider,
        new KeyPairSigner(keypair)
    );

    const wasm = await readFile("./contracts/guestbook/contract.wasm");
    const tx = await guestbookAccount.deployContract(wasm);
    await rootAccount.provider.viewTransactionStatus(
        tx.transaction.hash,
        guestbookAccount.accountId,
        "FINAL"
    );

    const contract = new Contract({
        contractId: guestbookAccount.accountId,
        provider: rootAccount.provider,
        abi: abi,
    });

    await contract.call.add_message({
        args: {
            text: "Hello, world!",
        },
        deposit: 1n,
        gas: 30_000_000_000_000n,
        waitUntil: "FINAL",
        account: rootAccount
    });

    const messages = await contract.view.get_messages({ args: {} });
    expect(messages.length).toBe(1);
    expect(messages.at(0)!).toMatchObject({
        sender: rootAccount.accountId,
        text: "Hello, world!",
        premium: false,
    });
});
