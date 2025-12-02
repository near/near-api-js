import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Worker } from 'near-workspaces';
import { Account, JsonRpcProvider, KeyPair, KeyPairSigner, KeyType } from 'near-api-js';

describe('Access Keys E2E', () => {
    let worker: Worker;
    let root: any;
    let provider: JsonRpcProvider;
    let testAccount: Account;

    beforeAll(async () => {
        worker = await Worker.init();
        root = worker.rootAccount;
        const rpcAddr = (worker as any).manager.config.rpcAddr;
        provider = new JsonRpcProvider({ url: rpcAddr });

        const accountId = `keys-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
        const subAccount = await root.createSubAccount(accountId, {
            initialBalance: '10000000000000000000000000',
        });

        const keyPair = KeyPair.fromString((await subAccount.getKey()).toString());
        const signer = new KeyPairSigner(keyPair);
        testAccount = new Account(subAccount.accountId, provider, signer);
    });

    afterAll(async () => {
        await worker?.tearDown();
    });

    it('should add full access key', async () => {
        const newKeyPair = KeyPair.fromRandom('ed25519');
        const newPublicKey = newKeyPair.getPublicKey();

        await testAccount.addKey(newPublicKey);

        // Wait for key to be added
        await new Promise(resolve => setTimeout(resolve, 1000));

        const accessKey = await testAccount.getAccessKeys();
        const hasNewKey = accessKey.keys.some(
            (key) => key.publicKey.toString() === newPublicKey.toString()
        );

        expect(hasNewKey).toBe(true);
    });

    it('should add function call access key', async () => {
        const newKeyPair = KeyPair.fromRandom('ed25519');
        const newPublicKey = newKeyPair.getPublicKey();

        // Create a contract account for the function call key
        const contractId = `contract-${Date.now()}.${testAccount.accountId}`;
        const contractKeyPair = KeyPair.fromRandom('ed25519');
        
        await testAccount.createAccount({
            newAccountId: contractId,
            publicKey: contractKeyPair.getPublicKey(),
            nearToTransfer: 3_000_000_000_000_000_000_000_000n,
        });

        await testAccount.addKey(newPublicKey, contractId, ['method1', 'method2'], 1_000_000_000_000_000_000_000_000n);

        // Wait for key to be added
        await new Promise(resolve => setTimeout(resolve, 1000));

        const accessKey = await testAccount.getAccessKeys();
        const newKey = accessKey.keys.find(
            (key) => key.publicKey.toString() === newPublicKey.toString()
        );

        expect(newKey).toBeDefined();
        expect(newKey!.accessKey.permission).not.toBe('FullAccess');
    });

    it('should delete access key', async () => {
        const keyPairToDelete = KeyPair.fromRandom('ed25519');
        const publicKeyToDelete = keyPairToDelete.getPublicKey();

        // Add the key first
        await testAccount.addKey(publicKeyToDelete);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verify key exists
        let accessKeys = await testAccount.getAccessKeys();
        let hasKey = accessKeys.keys.some(
            (key) => key.publicKey.toString() === publicKeyToDelete.toString()
        );
        expect(hasKey).toBe(true);

        // Delete the key
        await testAccount.deleteKey(publicKeyToDelete);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verify key is deleted
        accessKeys = await testAccount.getAccessKeys();
        hasKey = accessKeys.keys.some(
            (key) => key.publicKey.toString() === publicKeyToDelete.toString()
        );
        expect(hasKey).toBe(false);
    });

    it('should get all access keys', async () => {
        const accessKeys = await testAccount.getAccessKeys();

        expect(accessKeys).toBeDefined();
        expect(accessKeys.keys).toBeDefined();
        expect(Array.isArray(accessKeys.keys)).toBe(true);
        expect(accessKeys.keys.length).toBeGreaterThan(0);

        // Verify structure of access key
        const firstKey = accessKeys.keys[0];
        expect(firstKey.publicKey).toBeDefined();
        expect(firstKey.accessKey).toBeDefined();
    });

    it('should add secp256k1 access key', async () => {
        const newKeyPair = KeyPair.fromRandom('secp256k1');
        const newPublicKey = newKeyPair.getPublicKey();

        await testAccount.addKey(newPublicKey);

        // Wait for key to be added
        await new Promise(resolve => setTimeout(resolve, 1000));

        const accessKey = await testAccount.getAccessKeys();
        const hasNewKey = accessKey.keys.some(
            (key) => key.publicKey.toString() === newPublicKey.toString()
        );

        expect(hasNewKey).toBe(true);
    });

    it('should handle multiple key operations in sequence', async () => {
        const key1 = KeyPair.fromRandom('ed25519');
        const key2 = KeyPair.fromRandom('ed25519');
        const key3 = KeyPair.fromRandom('ed25519');

        // Add multiple keys
        await testAccount.addKey(key1.getPublicKey());
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await testAccount.addKey(key2.getPublicKey());
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await testAccount.addKey(key3.getPublicKey());
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verify all keys exist
        let accessKeys = await testAccount.getAccessKeys();
        expect(
            accessKeys.keys.some(k => k.publicKey.toString() === key1.getPublicKey().toString())
        ).toBe(true);
        expect(
            accessKeys.keys.some(k => k.publicKey.toString() === key2.getPublicKey().toString())
        ).toBe(true);
        expect(
            accessKeys.keys.some(k => k.publicKey.toString() === key3.getPublicKey().toString())
        ).toBe(true);

        // Delete one key
        await testAccount.deleteKey(key2.getPublicKey());
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verify key2 is deleted but others remain
        accessKeys = await testAccount.getAccessKeys();
        expect(
            accessKeys.keys.some(k => k.publicKey.toString() === key1.getPublicKey().toString())
        ).toBe(true);
        expect(
            accessKeys.keys.some(k => k.publicKey.toString() === key2.getPublicKey().toString())
        ).toBe(false);
        expect(
            accessKeys.keys.some(k => k.publicKey.toString() === key3.getPublicKey().toString())
        ).toBe(true);
    });
});
