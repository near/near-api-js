import { afterAll, beforeAll, beforeEach, expect, test } from 'bun:test';
import { KeyPair } from '@near-js/crypto';
import { KeyPairSigner } from '@near-js/signers';
import { Account } from '../src/index.js';
import {
    createAccount,
    deployContract,
    generateUniqueString,
    setUpTestConnection,
} from './test-utils.js';

let nearjs: any;
let workingAccount: Account;
let contractId: string;
let contract: any;

beforeAll(async () => {
    nearjs = await setUpTestConnection();
});

afterAll(async () => {
    const worker = nearjs.worker;

    if (!worker) return;

    await worker.tearDown();
});

beforeEach(
    async () => {
        contractId = generateUniqueString('test');
        workingAccount = await createAccount(nearjs);
        contract = await deployContract(
            nearjs.accountCreator.masterAccount,
            contractId,
        );
    },
    { timeout: 60000 },
);

test('make function call using access key', async () => {
    const keyPair = KeyPair.fromRandom('ed25519');
    await workingAccount.addKey(
        keyPair.getPublicKey(),
        contractId,
        '',
        2000000000000000000000000n,
    );

    const setCallValue = generateUniqueString('setCallPrefix');
    await contract.setValue({
        // Override signer in the workingAccount to the given access key.
        signerAccount: new Account(
            workingAccount.accountId,
            workingAccount.provider,
            new KeyPairSigner(keyPair),
        ),
        args: { value: setCallValue },
    });
    expect(await contract.getValue()).toEqual(setCallValue);
});

test('remove access key no longer works', async () => {
    const near = await setUpTestConnection();

    const keyPair = KeyPair.fromRandom('ed25519');
    const publicKey = keyPair.getPublicKey();
    await near.accountCreator.masterAccount.addKey(
        publicKey,
        contractId,
        '',
        400000n,
    );
    await near.accountCreator.masterAccount.deleteKey(publicKey);
    // Override account in the Contract to the masterAccount with the given access key.
    contract.account = new Account(
        near.accountCreator.masterAccount.accountId,
        near.accountCreator.masterAccount.provider,
        new KeyPairSigner(keyPair),
    );

    let failed = true;
    try {
        await contract.setValue({ args: { value: 'test' } });
        failed = false;
    } catch (e) {
        expect(e.message).toEqual(
            `Can't complete the action because access key ${keyPair
                .getPublicKey()
                .toString()} doesn't exist`,
        );
        expect(e.type).toEqual('AccessKeyDoesNotExist');
    }

    if (!failed) {
        throw new Error('should throw an error');
    }
}, 60000);

test('view account details after adding access keys', async () => {
    const keyPair = KeyPair.fromRandom('ed25519');
    await nearjs.accountCreator.masterAccount.addKey(
        keyPair.getPublicKey(),
        contractId,
        '',
        1000000000,
    );

    const contract2 = await deployContract(
        nearjs.accountCreator.masterAccount,
        generateUniqueString('test_contract2'),
    );
    const keyPair2 = KeyPair.fromRandom('ed25519');
    await nearjs.accountCreator.masterAccount.addKey(
        keyPair2.getPublicKey(),
        contract2.contractId,
        '',
        2000000000,
    );

    const details =
        await nearjs.accountCreator.masterAccount.getAccountDetails();
    const authorizedApps = [
        {
            contractId,
            amount: '1000000000',
            publicKey: keyPair.getPublicKey().toString(),
        },
        {
            contractId: contract2.contractId,
            amount: '2000000000',
            publicKey: keyPair2.getPublicKey().toString(),
        },
    ];

    expect(details.authorizedApps).toEqual(
        expect.arrayContaining(authorizedApps),
    );
    expect(authorizedApps).toEqual(
        expect.arrayContaining(details.authorizedApps),
    );
    expect(details.authorizedApps).toHaveLength(authorizedApps.length);
}, 60000);

test('loading account after adding a full key', async () => {
    const keyPair = KeyPair.fromRandom('ed25519');
    // wallet calls this with an empty string for contract id and method
    await workingAccount.addKey(keyPair.getPublicKey(), '', '');

    const accessKeys = await workingAccount.getAccessKeys();

    expect(accessKeys.length).toBe(2);
    const addedKey = accessKeys.find(
        (item) => item.public_key === keyPair.getPublicKey().toString(),
    );
    expect(addedKey).toBeTruthy();
    expect(addedKey?.access_key.permission).toEqual('FullAccess');
}, 60000);
