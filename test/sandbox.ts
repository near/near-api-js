import { DEFAULT_ACCOUNT_ID, DEFAULT_PRIVATE_KEY, Sandbox } from 'near-sandbox';

export const ROOT_ACCOUNT_ID = DEFAULT_ACCOUNT_ID;

export async function startSandbox(): Promise<Sandbox> {
    return Sandbox.start({});
}

export function getRpcUrl(sandbox: Sandbox): string {
    return sandbox.rpcUrl;
}

export function getRootSecretKey(): string {
    return DEFAULT_PRIVATE_KEY;
}
