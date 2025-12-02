import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Worker } from 'near-workspaces';
import {
    Account,
    JsonRpcProvider,
    KeyPair,
    KeyPairSigner,
    KeyType,
    actionCreators,
    createTransaction,
    signTransaction,
    getTransactionLastResult,
} from 'near-api-js';

describe('Transactions E2E', () => {
    let worker: Worker;
    let root: any;
    let provider: JsonRpcProvider;
    let testAccount: Account;

    beforeAll(async () => {
        worker = await Worker.init();
        root = worker.rootAccount;
        provider = new JsonRpcProvider({ url: worker.manager.config.rpcAddr });

        const accountId = `txn-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
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

    it('should execute a simple transfer transaction', async () => {
        const receiverId = `recv-${Date.now()}.${testAccount.accountId}`;
        const receiverKeyPair = KeyPair.fromRandom(KeyType.ED25519);

        await testAccount.createAccount({
            newAccountId: receiverId,
            publicKey: receiverKeyPair.getPublicKey(),
            nearToTransfer: 5_000_000_000_000_000_000_000_000n,
        });

        const receiver = new Account(receiverId, provider, new KeyPairSigner(receiverKeyPair));
        const initialBalance = (await receiver.getState()).balance.total;

        const transferAmount = 1_000_000_000_000_000_000_000_000n;
        const result = await testAccount.transfer({
            receiverId,
            amount: transferAmount,
        });

        expect(result).toBeDefined();
        expect(result.status).toBeDefined();

        await new Promise(resolve => setTimeout(resolve, 1000));

        const finalBalance = (await receiver.getState()).balance.total;
        expect(finalBalance).toBeGreaterThan(initialBalance);
    });

    it('should create and sign transaction manually', async () => {
        const receiverId = `manual-recv-${Date.now()}.${testAccount.accountId}`;
        const receiverKeyPair = KeyPair.fromRandom(KeyType.ED25519);

        await testAccount.createAccount({
            newAccountId: receiverId,
            publicKey: receiverKeyPair.getPublicKey(),
            nearToTransfer: 3_000_000_000_000_000_000_000_000n,
        });

        const signer = testAccount.getSigner()!;
        const publicKey = await signer.getPublicKey();
        const accessKey = await testAccount.provider.query({
            request_type: 'view_access_key',
            finality: 'final',
            account_id: testAccount.accountId,
            public_key: publicKey.toString(),
        });

        const block = await provider.getBlock({ finality: 'final' });
        const blockHash = block.header.hash;

        const actions = [actionCreators.transfer(500_000_000_000_000_000_000_000n)];

        const transaction = createTransaction(
            testAccount.accountId,
            publicKey,
            receiverId,
            (accessKey as any).nonce + 1n,
            actions,
            blockHash
        );

        const [, signedTxn] = await signTransaction(transaction, signer);

        expect(signedTxn).toBeDefined();
        expect(signedTxn.signature).toBeDefined();
    });

    it('should execute batch transaction with multiple actions', async () => {
        const receiverId = `batch-recv-${Date.now()}.${testAccount.accountId}`;
        const receiverKeyPair = KeyPair.fromRandom(KeyType.ED25519);

        const result = await testAccount.signAndSendTransaction({
            receiverId,
            actions: [
                actionCreators.createAccount(),
                actionCreators.transfer(5_000_000_000_000_000_000_000_000n),
                actionCreators.addKey(receiverKeyPair.getPublicKey(), actionCreators.functionCallAccessKey('', [], 0n)),
            ],
        });

        expect(result).toBeDefined();
        expect(result.status).toBeDefined();

        await new Promise(resolve => setTimeout(resolve, 1000));

        const receiver = new Account(receiverId, provider, new KeyPairSigner(receiverKeyPair));
        const state = await receiver.getState();
        expect(state).toBeDefined();
        expect(state.balance.total).toBeGreaterThan(0n);
    });

    it('should get transaction result', async () => {
        const receiverId = `result-recv-${Date.now()}.${testAccount.accountId}`;
        const receiverKeyPair = KeyPair.fromRandom(KeyType.ED25519);

        const result = await testAccount.createAccount({
            newAccountId: receiverId,
            publicKey: receiverKeyPair.getPublicKey(),
            nearToTransfer: 2_000_000_000_000_000_000_000_000n,
        });

        expect(result).toBeDefined();
        expect(result.status).toBeDefined();
        expect(result.receipts_outcome).toBeDefined();
        expect(Array.isArray(result.receipts_outcome)).toBe(true);

        const lastResult = getTransactionLastResult(result);
        expect(lastResult).toBeDefined();
    });

    it('should handle transaction with different key types', async () => {
        // Create account with secp256k1 key
        const secp256k1KeyPair = KeyPair.fromRandom(KeyType.SECP256K1);
        const secpAccountId = `secp-txn-${Date.now()}.${testAccount.accountId}`;

        await testAccount.createAccount({
            newAccountId: secpAccountId,
            publicKey: secp256k1KeyPair.getPublicKey(),
            nearToTransfer: 10_000_000_000_000_000_000_000_000n,
        });

        const secpAccount = new Account(
            secpAccountId,
            provider,
            new KeyPairSigner(secp256k1KeyPair)
        );

        // Execute transaction using secp256k1 key
        const receiverId = `secp-recv-${Date.now()}.${testAccount.accountId}`;
        const receiverKeyPair = KeyPair.fromRandom(KeyType.ED25519);

        const result = await secpAccount.createAccount({
            newAccountId: receiverId,
            publicKey: receiverKeyPair.getPublicKey(),
            nearToTransfer: 2_000_000_000_000_000_000_000_000n,
        });

        expect(result).toBeDefined();
        expect(result.status).toBeDefined();

        await new Promise(resolve => setTimeout(resolve, 1000));

        const receiver = new Account(receiverId, provider, new KeyPairSigner(receiverKeyPair));
        const state = await receiver.getState();
        expect(state).toBeDefined();
    });

    it('should handle multiple sequential transactions', async () => {
        const account1Id = `seq1-${Date.now()}.${testAccount.accountId}`;
        const account2Id = `seq2-${Date.now()}.${testAccount.accountId}`;
        const account3Id = `seq3-${Date.now()}.${testAccount.accountId}`;

        const keyPair1 = KeyPair.fromRandom(KeyType.ED25519);
        const keyPair2 = KeyPair.fromRandom(KeyType.ED25519);
        const keyPair3 = KeyPair.fromRandom(KeyType.ED25519);

        // Execute multiple transactions sequentially
        await testAccount.createAccount({
            newAccountId: account1Id,
            publicKey: keyPair1.getPublicKey(),
            nearToTransfer: 3_000_000_000_000_000_000_000_000n,
        });

        await testAccount.createAccount({
            newAccountId: account2Id,
            publicKey: keyPair2.getPublicKey(),
            nearToTransfer: 3_000_000_000_000_000_000_000_000n,
        });

        await testAccount.createAccount({
            newAccountId: account3Id,
            publicKey: keyPair3.getPublicKey(),
            nearToTransfer: 3_000_000_000_000_000_000_000_000n,
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verify all accounts were created
        const acc1 = new Account(account1Id, provider, new KeyPairSigner(keyPair1));
        const acc2 = new Account(account2Id, provider, new KeyPairSigner(keyPair2));
        const acc3 = new Account(account3Id, provider, new KeyPairSigner(keyPair3));

        const [state1, state2, state3] = await Promise.all([
            acc1.getState(),
            acc2.getState(),
            acc3.getState(),
        ]);

        expect(state1.balance.total).toBeGreaterThan(0n);
        expect(state2.balance.total).toBeGreaterThan(0n);
        expect(state3.balance.total).toBeGreaterThan(0n);
    });

    it('should handle transaction failures gracefully', async () => {
        const nonExistentAccount = `nonexistent-${Date.now()}.test.near`;

        // Try to transfer to non-existent account without creating it
        await expect(
            testAccount.transfer({
                receiverId: nonExistentAccount,
                amount: 1_000_000_000_000_000_000_000_000n,
            })
        ).rejects.toThrow();
    });
});
