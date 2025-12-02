import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Worker } from 'near-workspaces';
import { Account, JsonRpcProvider, KeyPair, KeyPairSigner, KeyType, TypedContract } from 'near-api-js';
import fs from 'fs';
import path from 'path';
import { abi } from '../../contracts/guestbook/abi';

describe('Contract Deployment and Interaction E2E', () => {
    let worker: Worker;
    let root: any;
    let provider: JsonRpcProvider;
    let testAccount: Account;
    let contractAccount: Account;
    const contractPath = path.join(__dirname, '../../contracts/guestbook/contract.wasm');

    beforeAll(async () => {
        worker = await Worker.init();
        root = worker.rootAccount;
        const rpcAddr = (worker as any).manager.config.rpcAddr;
        provider = new JsonRpcProvider({ url: rpcAddr });

        const accountId = `deployer-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
        const subAccount = await root.createSubAccount(accountId, {
            initialBalance: '100 N',
        });

        const keyPair = KeyPair.fromString(subAccount.getKey().toString());
        const signer = new KeyPairSigner(keyPair);
        testAccount = new Account(subAccount.accountId, provider, signer);
    });

    afterAll(async () => {
        await worker?.tearDown();
    });

    it('should deploy a contract', async () => {
        const contractId = `contract-${Date.now()}.${testAccount.accountId}`;
        const contractKeyPair = KeyPair.fromRandom(KeyType.ED25519);

        // Create contract account
        await testAccount.createAccount({
            newAccountId: contractId,
            publicKey: contractKeyPair.getPublicKey(),
            nearToTransfer: 30_000_000_000_000_000_000_000_000n,
        });

        contractAccount = new Account(
            contractId,
            provider,
            new KeyPairSigner(contractKeyPair)
        );

        // Deploy contract
        const wasmCode = fs.readFileSync(contractPath);
        await contractAccount.deployContract(wasmCode);

        // Wait for deployment
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verify contract is deployed by checking code hash
        const state = await contractAccount.getState();
        expect(state.codeHash).not.toBe('11111111111111111111111111111111');
    });

    it('should call contract view method', async () => {
        // Use the contract deployed in previous test
        if (!contractAccount) {
            const contractId = `view-contract-${Date.now()}.${testAccount.accountId}`;
            const contractKeyPair = KeyPair.fromRandom(KeyType.ED25519);

            await testAccount.createAccount({
                newAccountId: contractId,
                publicKey: contractKeyPair.getPublicKey(),
                nearToTransfer: 30_000_000_000_000_000_000_000_000n,
            });

            contractAccount = new Account(
                contractId,
                provider,
                new KeyPairSigner(contractKeyPair)
            );

            const wasmCode = fs.readFileSync(contractPath);
            await contractAccount.deployContract(wasmCode);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const result = await contractAccount.viewFunction({
            contractId: contractAccount.accountId,
            methodName: 'total_messages',
            args: {},
        });

        expect(result).toBeDefined();
        expect(typeof result).toBe('number');
    });

    it('should call contract change method', async () => {
        const contractId = `change-contract-${Date.now()}.${testAccount.accountId}`;
        const contractKeyPair = KeyPair.fromRandom(KeyType.ED25519);

        await testAccount.createAccount({
            newAccountId: contractId,
            publicKey: contractKeyPair.getPublicKey(),
            nearToTransfer: 30_000_000_000_000_000_000_000_000n,
        });

        const contract = new Account(
            contractId,
            provider,
            new KeyPairSigner(contractKeyPair)
        );

        const wasmCode = fs.readFileSync(contractPath);
        await contract.deployContract(wasmCode);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Call change method
        const result = await contract.functionCall({
            contractId: contract.accountId,
            methodName: 'add_message',
            args: { text: 'Hello from e2e test!' },
            gas: 30_000_000_000_000n,
            attachedDeposit: 0n,
        });

        expect(result).toBeDefined();
        expect(result.status).toBeDefined();

        // Wait for transaction to process
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verify the message was added
        const totalMessages = await contract.viewFunction({
            contractId: contract.accountId,
            methodName: 'total_messages',
            args: {},
        });

        expect(totalMessages).toBeGreaterThan(0);
    });

    it('should use TypedContract for contract interaction', async () => {
        const contractId = `typed-contract-${Date.now()}.${testAccount.accountId}`;
        const contractKeyPair = KeyPair.fromRandom(KeyType.ED25519);

        await testAccount.createAccount({
            newAccountId: contractId,
            publicKey: contractKeyPair.getPublicKey(),
            nearToTransfer: 30_000_000_000_000_000_000_000_000n,
        });

        const contract = new Account(
            contractId,
            provider,
            new KeyPairSigner(contractKeyPair)
        );

        const wasmCode = fs.readFileSync(contractPath);
        await contract.deployContract(wasmCode);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create TypedContract
        const typedContract = new TypedContract({
            contractId,
            provider,
            abi,
        });

        // Call view method through TypedContract
        const totalMessages = await typedContract.view('total_messages', {});
        expect(typeof totalMessages).toBe('number');
    });

    it('should handle contract with payable methods', async () => {
        const contractId = `payable-contract-${Date.now()}.${testAccount.accountId}`;
        const contractKeyPair = KeyPair.fromRandom(KeyType.ED25519);

        await testAccount.createAccount({
            newAccountId: contractId,
            publicKey: contractKeyPair.getPublicKey(),
            nearToTransfer: 30_000_000_000_000_000_000_000_000n,
        });

        const contract = new Account(
            contractId,
            provider,
            new KeyPairSigner(contractKeyPair)
        );

        const wasmCode = fs.readFileSync(contractPath);
        await contract.deployContract(wasmCode);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Call payable method with deposit
        const result = await contract.functionCall({
            contractId: contract.accountId,
            methodName: 'add_message',
            args: { text: 'Premium message!' },
            gas: 30_000_000_000_000n,
            attachedDeposit: 10_000_000_000_000_000_000_000_000n, // 0.01 NEAR
        });

        expect(result).toBeDefined();
        expect(result.status).toBeDefined();

        // Wait and verify
        await new Promise(resolve => setTimeout(resolve, 1000));

        const messages = await contract.viewFunction({
            contractId: contract.accountId,
            methodName: 'get_messages',
            args: { from_index: null, limit: null },
        });

        expect(Array.isArray(messages)).toBe(true);
        expect(messages.length).toBeGreaterThan(0);
    });

    it('should call batch contract operations', async () => {
        const contractId = `batch-contract-${Date.now()}.${testAccount.accountId}`;
        const contractKeyPair = KeyPair.fromRandom(KeyType.ED25519);

        await testAccount.createAccount({
            newAccountId: contractId,
            publicKey: contractKeyPair.getPublicKey(),
            nearToTransfer: 30_000_000_000_000_000_000_000_000n,
        });

        const contract = new Account(
            contractId,
            provider,
            new KeyPairSigner(contractKeyPair)
        );

        const wasmCode = fs.readFileSync(contractPath);
        await contract.deployContract(wasmCode);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Add multiple messages in sequence
        await contract.functionCall({
            contractId: contract.accountId,
            methodName: 'add_message',
            args: { text: 'Message 1' },
            gas: 30_000_000_000_000n,
            attachedDeposit: 0n,
        });

        await new Promise(resolve => setTimeout(resolve, 500));

        await contract.functionCall({
            contractId: contract.accountId,
            methodName: 'add_message',
            args: { text: 'Message 2' },
            gas: 30_000_000_000_000n,
            attachedDeposit: 0n,
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        const totalMessages = await contract.viewFunction({
            contractId: contract.accountId,
            methodName: 'total_messages',
            args: {},
        });

        expect(totalMessages).toBeGreaterThanOrEqual(2);
    });
});
