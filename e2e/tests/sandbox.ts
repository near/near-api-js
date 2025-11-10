import { startSandbox, stopSandbox, getSandboxInfo } from '@near-js/sandbox';

let initialized = false;

export async function initSandbox() {
    if (!initialized) {
        await startSandbox();
        initialized = true;
    }
    const info = await getSandboxInfo();
    if (!info?.rpcUrl || !info.rootAccountId || !info.secretKey) {
        throw new Error('Sandbox info unavailable');
    }
    return info;
}

export async function shutdownSandbox() {
    if (!initialized) return;
    await stopSandbox();
    initialized = false;
}
