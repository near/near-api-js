import { readFileSync } from 'node:fs';
import { sha256 } from '@noble/hashes/sha2.js';
import type { Sandbox } from 'near-sandbox';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { Account, baseEncode, JsonRpcProvider, type KeyPairString } from '../../src/index.js';
import { GlobalContractCodeDoesNotExistError } from '../../src/rpc-errors/index.js';
import { getRootSecretKey, getRpcUrl, ROOT_ACCOUNT_ID, startSandbox } from '../sandbox.js';

let sandbox: Sandbox;
let account: Account;

beforeAll(async () => {
    sandbox = await startSandbox();
    account = new Account(
        ROOT_ACCOUNT_ID,
        new JsonRpcProvider({ url: getRpcUrl(sandbox) }),
        getRootSecretKey() as KeyPairString
    );
});

afterAll(async () => {
    await sandbox?.tearDown();
});

test('deploy, query and attach a global contract using its RPC hash', async () => {
    const code = readFileSync(new URL('../contracts/guestbook/contract.wasm', import.meta.url));
    const deployed = await account.deployGlobalContract(code, 'codeHash');
    await account.provider.viewTransactionStatus({
        txHash: deployed.transaction.hash,
        accountId: account.accountId,
        waitUntil: 'FINAL',
    });
    const hash = sha256(code);
    await expect
        .poll(
            async () => {
                try {
                    return (await account.provider.viewGlobalContractCode({ identifier: { codeHash: hash } })).hash;
                } catch (error) {
                    if (error instanceof GlobalContractCodeDoesNotExistError) return undefined;
                    throw error;
                }
            },
            { timeout: 10000, interval: 200 }
        )
        .toBe(baseEncode(hash));

    const result = await account.provider.viewGlobalContractCode({ identifier: { codeHash: baseEncode(hash) } });
    expect(result.code).toEqual(new Uint8Array(code));
    const attached = await account.useGlobalContract({ codeHash: result.hash });
    await account.provider.viewTransactionStatus({
        txHash: attached.transaction.hash,
        accountId: account.accountId,
        waitUntil: 'FINAL',
    });
    expect(
        await account.provider.callFunction({ contractId: account.accountId, method: 'get_messages', args: {} })
    ).toEqual([]);
});
