import { describe, it, expect, afterAll } from 'vitest';
import { ensureSandbox, stopSandbox, getSandboxInfo, SandboxManager } from '../src/index.js';

describe('Sandbox', () => {
    afterAll(async () => {
        await stopSandbox();
    });

    it('should start sandbox and return connection info', async () => {
        const { server, keyPair } = await ensureSandbox();

        expect(server).toBeDefined();
        expect(server.endpoint).toMatch(/^http:\/\/127\.0\.0\.1:\d+$/);
        expect(keyPair.account_id).toBeDefined();
        expect(keyPair.secret_key).toBeDefined();
        expect(keyPair.secret_key).toMatch(/^ed25519:/);
    });

    it('should return the same instance on multiple calls (singleton)', async () => {
        const first = await ensureSandbox();
        const second = await ensureSandbox();

        expect(first.server).toBe(second.server);
        expect(first.keyPair.account_id).toBe(second.keyPair.account_id);
    });

    it('should provide sandbox info', async () => {
        await ensureSandbox();
        const info = await getSandboxInfo();

        expect(info).toBeDefined();
        expect(info?.rpcUrl).toMatch(/^http:\/\/127\.0\.0\.1:\d+$/);
        expect(info?.rootAccountId).toBeDefined();
        expect(info?.secretKey).toBeDefined();
    });

    it('should have running process', async () => {
        const { server } = await ensureSandbox();

        expect(server.process).toBeDefined();
        expect(server.process?.pid).toBeDefined();
    });

    it('should respond to RPC calls', async () => {
        const { server } = await ensureSandbox();

        const response = await fetch(server.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 'test',
                method: 'status',
                params: []
            })
        });

        expect(response.ok).toBe(true);
        const data = await response.json();
        expect(data.result).toBeDefined();
    });

    it('should cleanup after stop', async () => {
        await ensureSandbox();
        await stopSandbox();

        // Check info is null after stop (singleton cleared)
        const info = await getSandboxInfo();
        expect(info).toBeNull();

        // Note: Process cleanup is tested implicitly - if the process
        // isn't cleaned up, subsequent test runs would fail due to port conflicts
    });
});

describe('SandboxManager', () => {
    it('should create instance with custom options', () => {
        const manager = new SandboxManager({
            port: 9000,
            version: '2.9.0',
            rm: false
        });

        expect(manager.port).toBe(9000);
        expect(manager.version).toBe('2.9.0');
        expect(manager.rm).toBe(false);
    });

    it('should use defaults when no options provided', () => {
        const manager = new SandboxManager();

        expect(manager.port).toBe(3030);
        expect(manager.version).toBe('2.9.0');
        expect(manager.rm).toBe(true);
        expect(manager.homeDir).toMatch(/near-sandbox-/);
    });
});
