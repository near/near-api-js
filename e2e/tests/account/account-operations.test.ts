import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Worker } from 'near-workspaces';
import { Account, JsonRpcProvider, KeyPair, KeyPairSigner, KeyType } from 'near-api-js';

describe('Account Operations E2E', () => {
    let worker: Worker;
    let root: any;
    let provider: JsonRpcProvider;
    let testAccount: Account;

    beforeAll(async () => {
        worker = await Worker.init();
        root = worker.rootAccount;
        provider = new JsonRpcProvider({ url: worker.manager.config.rpcAddr });

        // Create a test account using near-workspaces
        const accountId = `test-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
        const subAccount = await root.createSubAccount(accountId, {
            initialBalance: '50 N',
        });

        const keyPair = KeyPair.fromString(subAccount.getKey().toString());
        const signer = new KeyPairSigner(keyPair);
        testAccount = new Account(subAccount.accountId, provider, signer);
    });

    afterAll(async () => {
        await worker?.tearDown();
    });

    it('should get account state', async () => {
        const state = await testAccount.getState();
        
        expect(state).toBeDefined();
        expect(state.balance).toBeDefined();
        expect(state.balance.total).toBeGreaterThan(0n);
        expect(state.balance.stateStaked).toBeDefined();
        expect(state.balance.staked).toBeDefined();
        expect(state.balance.available).toBeDefined();
    });

    it('should create a new account', async () => {
        const newAccountId = `sub-${Date.now()}-${Math.floor(Math.random() * 1000000)}.${testAccount.accountId}`;
        const newKeyPair = KeyPair.fromRandom(KeyType.ED25519);
        const newPublicKey = newKeyPair.getPublicKey();

        await testAccount.createAccount({
            newAccountId,
            publicKey: newPublicKey,
            nearToTransfer: 5_000_000_000_000_000_000_000_000n,
        });

        const newAccount = new Account(
            newAccountId,
            provider,
            new KeyPairSigner(newKeyPair)
        );
        const newAccountState = await newAccount.getState();

        expect(newAccountState).toBeDefined();
        expect(newAccountState.balance.total).toBeGreaterThan(0n);
    });

    it('should transfer NEAR tokens', async () => {
        // Create receiver account
        const receiverId = `receiver-${Date.now()}-${Math.floor(Math.random() * 1000000)}.${testAccount.accountId}`;
        const receiverKeyPair = KeyPair.fromRandom(KeyType.ED25519);
        
        await testAccount.createAccount({
            newAccountId: receiverId,
            publicKey: receiverKeyPair.getPublicKey(),
            nearToTransfer: 1_000_000_000_000_000_000_000_000n,
        });

        const receiverAccount = new Account(
            receiverId,
            provider,
            new KeyPairSigner(receiverKeyPair)
        );
        
        const initialBalance = (await receiverAccount.getState()).balance.total;
        const transferAmount = 500_000_000_000_000_000_000_000n;

        await testAccount.transfer({
            receiverId,
            amount: transferAmount,
        });

        // Wait a bit for the transaction to process
        await new Promise(resolve => setTimeout(resolve, 1000));

        const finalBalance = (await receiverAccount.getState()).balance.total;
        expect(finalBalance).toBeGreaterThan(initialBalance);
    });

    it('should delete account', async () => {
        // Create an account to delete
        const accountToDeleteId = `delete-${Date.now()}-${Math.floor(Math.random() * 1000000)}.${testAccount.accountId}`;
        const deleteKeyPair = KeyPair.fromRandom(KeyType.ED25519);
        
        await testAccount.createAccount({
            newAccountId: accountToDeleteId,
            publicKey: deleteKeyPair.getPublicKey(),
            nearToTransfer: 2_000_000_000_000_000_000_000_000n,
        });

        const accountToDelete = new Account(
            accountToDeleteId,
            provider,
            new KeyPairSigner(deleteKeyPair)
        );

        // Verify account exists
        const stateBefore = await accountToDelete.getState();
        expect(stateBefore).toBeDefined();

        // Delete the account
        await accountToDelete.deleteAccount(testAccount.accountId);

        // Wait a bit for the deletion to process
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verify account is deleted
        await expect(accountToDelete.getState()).rejects.toThrow();
    });

    it('should get account details', async () => {
        const details = await testAccount.getAccountDetails();
        
        expect(details).toBeDefined();
        expect(details.authorizedApps).toBeDefined();
        expect(Array.isArray(details.authorizedApps)).toBe(true);
    });

    it('should create account with secp256k1 key', async () => {
        const newAccountId = `secp-${Date.now()}-${Math.floor(Math.random() * 1000000)}.${testAccount.accountId}`;
        const newKeyPair = KeyPair.fromRandom(KeyType.SECP256K1);
        const newPublicKey = newKeyPair.getPublicKey();

        await testAccount.createAccount({
            newAccountId,
            publicKey: newPublicKey,
            nearToTransfer: 3_000_000_000_000_000_000_000_000n,
        });

        const newAccount = new Account(
            newAccountId,
            provider,
            new KeyPairSigner(newKeyPair)
        );
        const newAccountState = await newAccount.getState();

        expect(newAccountState).toBeDefined();
        expect(newAccountState.balance.total).toBeGreaterThan(0n);

        // Verify the account can sign transactions with secp256k1
        const receiverId = `recv-${Date.now()}.${testAccount.accountId}`;
        const receiverKeyPair = KeyPair.fromRandom(KeyType.ED25519);
        
        await newAccount.createAccount({
            newAccountId: receiverId,
            publicKey: receiverKeyPair.getPublicKey(),
            nearToTransfer: 1_000_000_000_000_000_000_000_000n,
        });

        const receiverAccount = new Account(receiverId, provider, new KeyPairSigner(receiverKeyPair));
        const receiverState = await receiverAccount.getState();
        expect(receiverState).toBeDefined();
    });
});
