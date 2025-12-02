import { Worker } from 'near-workspaces';
import type { Account, JsonRpcProvider, KeyPair } from 'near-api-js';
import { KeyPairSigner } from 'near-api-js';
import fs from 'fs';

export async function setupTestEnvironment() {
    const worker = await Worker.init();
    const root = worker.rootAccount;

    return {
        worker,
        root,
        networkId: worker.config.network,
        rpcUrl: worker.manager.config.rpcAddr,
    };
}

export async function createTestAccount(
    root: any,
    prefix: string = 'test'
): Promise<{ accountId: string; keyPair: any }> {
    const uniqueId = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    const subAccount = await root.createSubAccount(uniqueId, {
        initialBalance: '10 N',
    });

    return {
        accountId: subAccount.accountId,
        keyPair: subAccount.getKey(),
    };
}

export function generateUniqueString(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitFor<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 10,
    delayMs: number = 500
): Promise<T> {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            return await fn();
        } catch (e) {
            if (i === maxAttempts - 1) throw e;
            await sleep(delayMs);
        }
    }
    throw new Error('waitFor exceeded max attempts');
}
