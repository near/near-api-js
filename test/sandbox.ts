import { DEFAULT_ACCOUNT_ID, DEFAULT_PRIVATE_KEY, Sandbox } from 'near-sandbox';

export const ROOT_ACCOUNT_ID = DEFAULT_ACCOUNT_ID;

export async function startSandbox(): Promise<Sandbox> {
    return Sandbox.start({});
}

export async function fastForwardSandbox(sandbox: Sandbox, deltaHeight = 1): Promise<void> {
    const response = await fetch(sandbox.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'fast-forward',
            method: 'sandbox_fast_forward',
            params: { delta_height: deltaHeight },
        }),
    });
    const result = (await response.json()) as { error?: { message?: string } };

    if (!response.ok || result.error) {
        throw new Error(result.error?.message ?? `Failed to fast-forward sandbox: ${response.status}`);
    }
}

export function getRpcUrl(sandbox: Sandbox): string {
    return sandbox.rpcUrl;
}

export function getRootSecretKey(): string {
    return DEFAULT_PRIVATE_KEY;
}
