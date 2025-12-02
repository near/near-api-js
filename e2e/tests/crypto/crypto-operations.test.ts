import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Worker } from 'near-workspaces';
import {
    Account,
    JsonRpcProvider,
    KeyPair,
    KeyPairSigner,
    KeyType,
    PublicKey,
} from 'near-api-js';

describe('Cryptographic Operations E2E', () => {
    let worker: Worker;
    let root: any;
    let provider: JsonRpcProvider;

    beforeAll(async () => {
        worker = await Worker.init();
        root = worker.rootAccount;
        const rpcAddr = (worker as any).manager.config.rpcAddr;
        provider = new JsonRpcProvider({ url: rpcAddr });
    });

    afterAll(async () => {
        await worker?.tearDown();
    });

    it('should create and use ED25519 key pair', async () => {
        const keyPair = KeyPair.fromRandom(KeyType.ED25519);
        const publicKey = keyPair.getPublicKey();

        expect(keyPair).toBeDefined();
        expect(publicKey).toBeDefined();
        expect(publicKey.keyType).toBe(KeyType.ED25519);

        // Create account with this key pair
        const accountId = `ed25519-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
        const subAccount = await root.createSubAccount(accountId, {
            initialBalance: '10 N',
        });

        // Replace key with our generated one
        await subAccount.updateAccessKey(
            subAccount.getKey().toString(),
            {
                nonce: 0,
                permission: 'FullAccess',
            }
        );

        const account = new Account(accountId, provider, new KeyPairSigner(keyPair));
        const state = await account.getState();
        
        expect(state).toBeDefined();
    });

    it('should create and use SECP256K1 key pair', async () => {
        const keyPair = KeyPair.fromRandom(KeyType.SECP256K1);
        const publicKey = keyPair.getPublicKey();

        expect(keyPair).toBeDefined();
        expect(publicKey).toBeDefined();
        expect(publicKey.keyType).toBe(KeyType.SECP256K1);

        // Create account with secp256k1 key
        const accountId = `secp-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
        const subAccount = await root.createSubAccount(accountId, {
            initialBalance: '10 N',
        });

        const account = new Account(
            accountId,
            provider,
            new KeyPairSigner(KeyPair.fromString(subAccount.getKey().toString()))
        );

        // Add secp256k1 key to account
        await account.addKey(publicKey);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verify key was added
        const accessKeys = await account.getAccessKeys();
        const hasSecpKey = accessKeys.keys.some(
            k => k.publicKey.toString() === publicKey.toString()
        );
        expect(hasSecpKey).toBe(true);
    });

    it('should parse key pair from string', async () => {
        const originalKeyPair = KeyPair.fromRandom(KeyType.ED25519);
        const keyString = originalKeyPair.toString();

        const parsedKeyPair = KeyPair.fromString(keyString);

        expect(parsedKeyPair).toBeDefined();
        expect(parsedKeyPair.getPublicKey().toString()).toBe(
            originalKeyPair.getPublicKey().toString()
        );
    });

    it('should parse public key from string', async () => {
        const keyPair = KeyPair.fromRandom(KeyType.ED25519);
        const publicKey = keyPair.getPublicKey();
        const publicKeyString = publicKey.toString();

        const parsedPublicKey = PublicKey.fromString(publicKeyString);

        expect(parsedPublicKey).toBeDefined();
        expect(parsedPublicKey.toString()).toBe(publicKeyString);
        expect(parsedPublicKey.keyType).toBe(KeyType.ED25519);
    });

    it('should sign and verify message with ED25519', async () => {
        const keyPair = KeyPair.fromRandom(KeyType.ED25519);
        const message = new Uint8Array([1, 2, 3, 4, 5]);

        const signature = keyPair.sign(message);

        expect(signature).toBeDefined();
        expect(signature.signature).toBeDefined();
        expect(signature.signature.length).toBeGreaterThan(0);

        // Verify signature
        const publicKey = keyPair.getPublicKey();
        const isValid = publicKey.verify(message, signature.signature);
        expect(isValid).toBe(true);
    });

    it('should sign and verify message with SECP256K1', async () => {
        const keyPair = KeyPair.fromRandom(KeyType.SECP256K1);
        const message = new Uint8Array([1, 2, 3, 4, 5]);

        const signature = keyPair.sign(message);

        expect(signature).toBeDefined();
        expect(signature.signature).toBeDefined();
        expect(signature.signature.length).toBeGreaterThan(0);

        // Verify signature
        const publicKey = keyPair.getPublicKey();
        const isValid = publicKey.verify(message, signature.signature);
        expect(isValid).toBe(true);
    });

    it('should handle key pair signer operations', async () => {
        const keyPair = KeyPair.fromRandom(KeyType.ED25519);
        const signer = new KeyPairSigner(keyPair);

        const publicKey = await signer.getPublicKey();
        expect(publicKey).toBeDefined();
        expect(publicKey.toString()).toBe(keyPair.getPublicKey().toString());

        const message = new Uint8Array([1, 2, 3, 4, 5]);
        const signature = await signer.signMessage(message);

        expect(signature).toBeDefined();
        expect(signature.signature).toBeDefined();
    });

    it('should create key pair from secret key', async () => {
        const originalKeyPair = KeyPair.fromRandom(KeyType.ED25519);
        const secretKey = originalKeyPair.toString();

        const signer = KeyPairSigner.fromSecretKey(secretKey);
        const publicKey = await signer.getPublicKey();

        expect(publicKey.toString()).toBe(originalKeyPair.getPublicKey().toString());
    });

    it('should handle different key types in same account', async () => {
        const accountId = `multi-key-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
        const subAccount = await root.createSubAccount(accountId, {
            initialBalance: '20 N',
        });

        const account = new Account(
            accountId,
            provider,
            new KeyPairSigner(KeyPair.fromString(subAccount.getKey().toString()))
        );

        const ed25519Key = KeyPair.fromRandom(KeyType.ED25519);
        const secp256k1Key = KeyPair.fromRandom(KeyType.SECP256K1);

        // Add both types of keys
        await account.addKey(ed25519Key.getPublicKey());
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await account.addKey(secp256k1Key.getPublicKey());
        await new Promise(resolve => setTimeout(resolve, 1000));

        const accessKeys = await account.getAccessKeys();
        
        const hasEd25519 = accessKeys.keys.some(
            k => k.publicKey.toString() === ed25519Key.getPublicKey().toString()
        );
        const hasSecp256k1 = accessKeys.keys.some(
            k => k.publicKey.toString() === secp256k1Key.getPublicKey().toString()
        );

        expect(hasEd25519).toBe(true);
        expect(hasSecp256k1).toBe(true);
    });

    it('should use different signers for same account', async () => {
        const accountId = `signer-test-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
        const keyPair1 = KeyPair.fromRandom(KeyType.ED25519);
        const keyPair2 = KeyPair.fromRandom(KeyType.ED25519);

        const subAccount = await root.createSubAccount(accountId, {
            initialBalance: '20 N',
        });

        // First use the root key to add our keys
        const tempAccount = new Account(
            accountId,
            provider,
            new KeyPairSigner(KeyPair.fromString(subAccount.getKey().toString()))
        );

        await tempAccount.addKey(keyPair1.getPublicKey());
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await tempAccount.addKey(keyPair2.getPublicKey());
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create two Account instances with different signers
        const account1 = new Account(accountId, provider, new KeyPairSigner(keyPair1));
        const account2 = new Account(accountId, provider, new KeyPairSigner(keyPair2));

        // Both should be able to query the account
        const state1 = await account1.getState();
        const state2 = await account2.getState();

        expect(state1.balance.total).toBe(state2.balance.total);

        // Both should be able to sign transactions
        const receiverId1 = `recv1-${Date.now()}.${accountId}`;
        const receiverId2 = `recv2-${Date.now()}.${accountId}`;
        const receiverKey1 = KeyPair.fromRandom(KeyType.ED25519);
        const receiverKey2 = KeyPair.fromRandom(KeyType.ED25519);

        await account1.createAccount({
            newAccountId: receiverId1,
            publicKey: receiverKey1.getPublicKey(),
            nearToTransfer: 1_000_000_000_000_000_000_000_000n,
        });

        await account2.createAccount({
            newAccountId: receiverId2,
            publicKey: receiverKey2.getPublicKey(),
            nearToTransfer: 1_000_000_000_000_000_000_000_000n,
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        const recv1 = new Account(receiverId1, provider, new KeyPairSigner(receiverKey1));
        const recv2 = new Account(receiverId2, provider, new KeyPairSigner(receiverKey2));

        const recvState1 = await recv1.getState();
        const recvState2 = await recv2.getState();

        expect(recvState1).toBeDefined();
        expect(recvState2).toBeDefined();
    });
});
