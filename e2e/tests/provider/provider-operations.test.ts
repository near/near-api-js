import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Worker } from 'near-workspaces';
import { Account, JsonRpcProvider, KeyPair, KeyPairSigner, KeyType } from 'near-api-js';

describe('Provider Operations E2E', () => {
    let worker: Worker;
    let root: any;
    let provider: JsonRpcProvider;
    let testAccount: Account;

    beforeAll(async () => {
        worker = await Worker.init();
        root = worker.rootAccount;
        const rpcAddr = (worker as any).manager.config.rpcAddr;
        provider = new JsonRpcProvider({ url: rpcAddr });

        const accountId = `provider-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
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

    it('should get network status', async () => {
        const status = await provider.getStatus();

        expect(status).toBeDefined();
        expect(status.chain_id).toBeDefined();
        expect(status.sync_info).toBeDefined();
        expect(status.sync_info.latest_block_height).toBeGreaterThan(0);
    });

    it('should get block by finality', async () => {
        const block = await provider.getBlock({ finality: 'final' });

        expect(block).toBeDefined();
        expect(block.header).toBeDefined();
        expect(block.header.height).toBeGreaterThan(0);
        expect(block.header.hash).toBeDefined();
        expect(block.chunks).toBeDefined();
        expect(Array.isArray(block.chunks)).toBe(true);
    });

    it('should get block by block ID', async () => {
        const latestBlock = await provider.getBlock({ finality: 'final' });
        const blockId = latestBlock.header.height;

        const block = await provider.getBlock({ blockId });

        expect(block).toBeDefined();
        expect(block.header.height).toBe(blockId);
    });

    it('should get chunk details', async () => {
        const block = await provider.getBlock({ finality: 'final' });
        const chunkHash = block.chunks[0].chunk_hash;

        const chunk = await provider.getChunk(chunkHash);

        expect(chunk).toBeDefined();
        expect(chunk.header).toBeDefined();
        expect(chunk.header.chunk_hash).toBe(chunkHash);
    });

    it('should query account view', async () => {
        const result = await provider.query({
            request_type: 'view_account',
            finality: 'final',
            account_id: testAccount.accountId,
        });

        expect(result).toBeDefined();
        expect((result as any).amount).toBeDefined();
        expect((result as any).code_hash).toBeDefined();
    });

    it('should query access key', async () => {
        const publicKey = await testAccount.getSigner()!.getPublicKey();
        
        const result = await provider.query({
            request_type: 'view_access_key',
            finality: 'final',
            account_id: testAccount.accountId,
            public_key: publicKey.toString(),
        });

        expect(result).toBeDefined();
        expect((result as any).nonce).toBeDefined();
        expect((result as any).permission).toBeDefined();
    });

    it('should query access key list', async () => {
        const result = await provider.query({
            request_type: 'view_access_key_list',
            finality: 'final',
            account_id: testAccount.accountId,
        });

        expect(result).toBeDefined();
        expect((result as any).keys).toBeDefined();
        expect(Array.isArray((result as any).keys)).toBe(true);
        expect((result as any).keys.length).toBeGreaterThan(0);
    });

    it('should get transaction status', async () => {
        // Create a transaction
        const receiverId = `tx-status-${Date.now()}.${testAccount.accountId}`;
        const keyPair = KeyPair.fromRandom(KeyType.ED25519);

        const txResult = await testAccount.createAccount({
            newAccountId: receiverId,
            publicKey: keyPair.getPublicKey(),
            nearToTransfer: 2_000_000_000_000_000_000_000_000n,
        });

        expect(txResult).toBeDefined();
        expect(txResult.transaction).toBeDefined();
        expect(txResult.transaction.hash).toBeDefined();

        // Query transaction status
        const txStatus = await provider.getTransaction(txResult.transaction.hash);

        expect(txStatus).toBeDefined();
        expect(txStatus.transaction).toBeDefined();
        expect(txStatus.receipts).toBeDefined();
    });

    it('should get gas price', async () => {
        const gasPrice = await provider.getGasPrice(null);

        expect(gasPrice).toBeDefined();
        expect(gasPrice.gas_price).toBeDefined();
        expect(BigInt(gasPrice.gas_price)).toBeGreaterThan(0n);
    });

    it('should send transaction', async () => {
        const receiverId = `send-tx-${Date.now()}.${testAccount.accountId}`;
        const keyPair = KeyPair.fromRandom(KeyType.ED25519);

        const result = await testAccount.createAccount({
            newAccountId: receiverId,
            publicKey: keyPair.getPublicKey(),
            nearToTransfer: 3_000_000_000_000_000_000_000_000n,
        });

        expect(result).toBeDefined();
        expect(result.status).toBeDefined();
        expect(result.transaction).toBeDefined();
    });

    it('should get validators', async () => {
        const validators = await provider.getValidators(null);

        expect(validators).toBeDefined();
        expect(validators.current_validators).toBeDefined();
        expect(Array.isArray(validators.current_validators)).toBe(true);
    });

    it('should get network info', async () => {
        const networkInfo = await provider.getNetworkInfo();

        expect(networkInfo).toBeDefined();
        expect(networkInfo.peer_max_count).toBeDefined();
        expect(networkInfo.active_peers).toBeDefined();
        expect(Array.isArray(networkInfo.active_peers)).toBe(true);
    });

    it('should handle multiple concurrent queries', async () => {
        const promises = [
            provider.getStatus(),
            provider.getBlock({ finality: 'final' }),
            provider.getGasPrice(null),
            provider.query({
                request_type: 'view_account',
                finality: 'final',
                account_id: testAccount.accountId,
            }),
        ];

        const results = await Promise.all(promises);

        expect(results).toHaveLength(4);
        results.forEach(result => {
            expect(result).toBeDefined();
        });
    });

    it('should get experimental protocol config', async () => {
        const block = await provider.getBlock({ finality: 'final' });
        
        const protocolConfig = await provider.getProtocolConfig({
            blockReference: {
                blockId: block.header.height,
            },
        });

        expect(protocolConfig).toBeDefined();
        expect(protocolConfig.runtime_config).toBeDefined();
    });

    it('should query contract state', async () => {
        // Query state of test account (even if it has no contract)
        const result = await provider.query({
            request_type: 'view_state',
            finality: 'final',
            account_id: testAccount.accountId,
            prefix_base64: '',
        });

        expect(result).toBeDefined();
        expect((result as any).values).toBeDefined();
        expect(Array.isArray((result as any).values)).toBe(true);
    });
});
