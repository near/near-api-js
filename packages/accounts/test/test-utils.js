import { KeyPair, KeyType } from '@near-js/crypto';
import { InMemoryKeyStore } from '@near-js/keystores';
import { ConsoleLogger, Logger } from '@near-js/utils';
import fs from 'fs';
import path from 'path';

import { Account, AccountMultisig, Contract, Connection, LocalAccountCreator } from '../src';
import Config from './config';

Logger.overrideLogger(new ConsoleLogger(['error', 'fatal']))

export const networkId = 'unittest';

export const HELLO_WASM_PATH = process.env.HELLO_WASM_PATH || 'node_modules/near-hello/dist/main.wasm';
export const HELLO_WASM_BALANCE = BigInt('10000000000000000000000000');
export const HELLO_WASM_METHODS = {
    viewMethods: ['getValue', 'getLastResult'],
    changeMethods: ['setValue', 'callPromise']
};
export const MULTISIG_WASM_PATH = process.env.MULTISIG_WASM_PATH || './test/wasm/multisig.wasm';
// Length of a random account. Set to 40 because in the protocol minimal allowed top-level account length should be at
// least 32.
export const RANDOM_ACCOUNT_LENGTH = 40;

export const GUESTBOOK_CONTRACT_ID = 'guestbook-1690363526419-7138950000000000';
export const GUESTBOOK_WASM_PATH = path.resolve(__dirname, './wasm/guestbook.wasm');
export const GUESTBOOK_CONTRACT_STATE = [
    {
        key: Buffer.from('U1RBVEU=', 'base64'),
        value: Buffer.from(
            'eyJtZXNzYWdlcyI6eyJwcmVmaXgiOiJ2LXVpZCIsImxlbmd0aCI6Mn19',
            'base64'
        ),
    },
    {
        key: Buffer.from('di11aWQAAAAA', 'base64'),
        value: Buffer.from(
            'eyJwcmVtaXVtIjp0cnVlLCJzZW5kZXIiOiJkZXYtMTY4ODk4NzM5ODM2MC00NzExMjI2NjI3NTg2NyIsInRleHQiOiJhIG1lc3NhZ2UifQ==',
            'base64'
        ),
    },
    {
        key: Buffer.from('di11aWQBAAAA', 'base64'),
        value: Buffer.from(
            'eyJwcmVtaXVtIjp0cnVlLCJzZW5kZXIiOiJkZXYtMTY4ODk4NzM5ODM2MC00NzExMjI2NjI3NTg2NyIsInRleHQiOiJzZWNvbmQgbWVzc2FnZSJ9',
            'base64'
        ),
    },
];

export async function loadGuestBookContractCode() {
    const contractCode = await fs.readFileSync(GUESTBOOK_WASM_PATH);
    return contractCode.toString('base64');
}
export async function setUpTestConnection() {
    const keyStore = new InMemoryKeyStore();
    const config = Object.assign(await Config(process.env.NODE_ENV || 'test'), {
        networkId,
        keyStore
    });

    if (config.masterAccount) {
        // full accessKey on ci-testnet, dedicated rpc for tests.
        const secretKey = config.secretKey || 'ed25519:2wyRcSwSuHtRVmkMCGjPwnzZmQLeXLzLLyED1NDMt4BjnKgQL6tF85yBx6Jr26D2dUNeC716RBoTxntVHsegogYw';
        await keyStore.setKey(networkId, config.masterAccount, KeyPair.fromString(secretKey));
    }

    const connection = Connection.fromConfig({
        networkId: config.networkId,
        provider: { type: 'JsonRpcProvider', args: { url: config.nodeUrl, headers: config.headers } },
        signer: { type: 'InMemorySigner', keyStore: config.keyStore },
    });

    return {
        accountCreator: new LocalAccountCreator(new Account(connection, config.masterAccount), BigInt('500000000000000000000000000')),
        connection,
    };
}

// Generate some unique string of length at least RANDOM_ACCOUNT_LENGTH with a given prefix using the alice nonce.
export function generateUniqueString(prefix) {
    let result = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000000)}`;
    let add_symbols = Math.max(RANDOM_ACCOUNT_LENGTH - result.length, 1);
    for (let i = add_symbols; i > 0; --i) result += '0';
    return result + '.test.near';
}

export async function createAccount({ accountCreator, connection }, keyType = KeyType.ED25519) {
    const newAccountName = generateUniqueString('test');
    const newPublicKey = await connection.signer.createKey(newAccountName, networkId, keyType);
    await accountCreator.createAccount(newAccountName, newPublicKey);
    return new Account(connection, newAccountName);
}

export async function createAccountMultisig({ accountCreator, connection }, options) {
    const newAccountName = generateUniqueString('test');
    const newPublicKey = await connection.signer.createKey(newAccountName, networkId);
    await accountCreator.createAccount(newAccountName, newPublicKey);
    // add a confirm key for multisig (contract helper sim)

    try {
        const confirmKeyPair = KeyPair.fromRandom('ed25519');
        const { publicKey } = confirmKeyPair;
        const accountMultisig = new AccountMultisig(connection, newAccountName, options);
        accountMultisig.useConfirmKey = async () => {
            await connection.signer.setKey(networkId, options.masterAccount, confirmKeyPair);
        };
        accountMultisig.getRecoveryMethods = () => ({ data: [] });
        accountMultisig.postSignedJson = async (path) => {
            switch (path) {
                case '/2fa/getAccessKey': return { publicKey };
            }
        };
        await accountMultisig.deployMultisig(fs.readFileSync(MULTISIG_WASM_PATH));
        return accountMultisig;
    } catch (e) {
        console.log(e);
    }
}

export async function deployContract(workingAccount, contractId) {
    const newPublicKey = await workingAccount.connection.signer.createKey(contractId, networkId);
    const data = fs.readFileSync(HELLO_WASM_PATH);
    await workingAccount.createAndDeployContract(contractId, newPublicKey, data, HELLO_WASM_BALANCE);
    return new Contract(workingAccount, contractId, HELLO_WASM_METHODS);
}

export async function deployContractGuestBook(workingAccount, contractId) {
    const newPublicKey = await workingAccount.connection.signer.createKey(contractId, networkId);
    const data = fs.readFileSync(GUESTBOOK_WASM_PATH);
    const account = await workingAccount.createAndDeployContract(contractId, newPublicKey, data, HELLO_WASM_BALANCE);
    return new Contract(account, contractId, { viewMethods: ['total_messages', 'get_messages'],  changeMethods: ['add_message'], useLocalViewExecution: true });
}

export function sleep(time) {
    return new Promise(function (resolve) {
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
            }
            else throw e;
        }
    };

    return _waitFor();
}
