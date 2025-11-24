import assert from 'assert';
import { readFileSync } from 'fs';
import type { Worker } from 'near-workspaces';

export function getRpcUrl(worker: Worker): string {
    // @ts-expect-error config is protected field
    return worker.config.rpcAddr;
}

export function getSecretKey(worker: Worker): string {
    // @ts-expect-error config is protected field
    const path = `${worker.config.homeDir}/validator_key.json`;
    const keyFile = readFileSync(path);
    const keyPair = JSON.parse(keyFile.toString());
    const secretKey = keyPair.secret_key || keyPair.private_key;

    assert(!!secretKey, 'Secret key must exist');
    assert(typeof secretKey === 'string', 'Secret key must be a string');

    return secretKey;
}
