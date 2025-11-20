import fs from 'fs';

import { Account, JsonRpcProvider, KeyPair, KeyPairSigner, KeyType, TypedContract } from '../../src';
import Config from './config';

export const networkId = 'unittest';

export const HELLO_WASM_PATH = process.env.HELLO_WASM_PATH || 'node_modules/near-hello/dist/main.wasm';
export const HELLO_WASM_BALANCE = BigInt('10000000000000000000000000');
// Length of a random account. Set to 40 because in the protocol minimal allowed top-level account length should be at
// least 32.
export const RANDOM_ACCOUNT_LENGTH = 40;

export async function setUpTestConnection() {
    const config = Object.assign(await Config(process.env.NODE_ENV || 'test'), {
        networkId,
    });

    const secretKey =
        config.secretKey ||
        'ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw';

    const provider = new JsonRpcProvider({ url: config.nodeUrl, headers: config.headers });
    const signer = KeyPairSigner.fromSecretKey(secretKey);

    const account = new Account(config.masterAccount, provider, signer);

    return {
        account,
        provider,
        // return worker, so we can gracefully shut down tests
        worker: config.worker || undefined,
    };
}

// Generate some unique string of length at least RANDOM_ACCOUNT_LENGTH with a given prefix using the alice nonce.
export function generateUniqueString(prefix) {
    let result = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000000)}`;
    const add_symbols = Math.max(RANDOM_ACCOUNT_LENGTH - result.length, 1);
    for (let i = add_symbols; i > 0; --i) result += '0';
    return `${result}.test.near`;
}

export async function createAccount({ account, provider }, keyType = KeyType.ED25519) {
    const newAccountName = generateUniqueString('test');

    const keyPair = KeyPair.fromRandom(Object.values(KeyType)[keyType]);

    const newPublicKey = keyPair.getPublicKey();
    await account.createAccount(newAccountName, newPublicKey, '500000000000000000000000000');

    return new Account(newAccountName, provider, new KeyPairSigner(keyPair));
}

export async function deployContract(workingAccount, contractId) {
    const keyPair = KeyPair.fromRandom('ed25519');
    const newPublicKey = keyPair.getPublicKey();

    const data = fs.readFileSync(HELLO_WASM_PATH);
    await workingAccount.createAccount(contractId, newPublicKey, HELLO_WASM_BALANCE);
    const contractAccount = new Account(contractId, workingAccount.provider, new KeyPairSigner(keyPair));
    await contractAccount.deployContract(data);
    return new TypedContract({
        contractId,
        provider: workingAccount.provider,
    });
}

export function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

export function waitFor(fn) {
    const _waitFor = async (count = 10) => {
        try {
            return await fn();
        } catch (e) {
            if (count > 0) {
                await sleep(500);
                return _waitFor(count - 1);
            } else throw e;
        }
    };

    return _waitFor();
}
