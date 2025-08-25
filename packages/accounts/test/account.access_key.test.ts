import { afterAll, beforeAll, beforeEach, expect, jest, test } from '@jest/globals';
import { KeyPair } from '@near-js/crypto';

import { createAccount, deployContract, generateUniqueString, setUpTestConnection } from './test-utils';
import { Account } from '../src';
import { KeyPairSigner } from '@near-js/signers';

import { Worker } from 'near-workspaces';

let nearjs;
let workingAccount: Account;
let contractId;
let contract;

jest.setTimeout(50000);

beforeAll(async () => {
    nearjs = await setUpTestConnection();
});

afterAll(async () => {
    const worker = nearjs.worker as Worker;

    if (!worker) return;

    await worker.tearDown();
});

beforeEach(async () => {
    try {
        contractId = generateUniqueString('test');
        workingAccount = await createAccount(nearjs);
        contract = await deployContract(nearjs.accountCreator.masterAccount, contractId);
    } catch (e) {
        console.error(e);
    }
});

test('make function call using access key', async() => {
    const keyPair = KeyPair.fromRandom('ed25519');
    await workingAccount.addKey(keyPair.getPublicKey(), contractId, '', 2000000000000000000000000n);

    const setCallValue = generateUniqueString('setCallPrefix');
    await contract.call.setValue({
        // Override signer in the workingAccount to the given access key.
        account: new Account(workingAccount.accountId, workingAccount.provider, new KeyPairSigner(keyPair)),
        args: { value: setCallValue },
        waitUntil: 'FINAL'
    });
    expect(await contract.view.getValue()).toEqual(setCallValue);
});

test('remove access key no longer works', async() => {
    const near = await setUpTestConnection();

    const keyPair = KeyPair.fromRandom('ed25519');
    const publicKey = keyPair.getPublicKey();
    await near.accountCreator.masterAccount.addKey(publicKey, contractId, '', 400000n);
    await near.accountCreator.masterAccount.deleteKey(publicKey);
    
    let failed = true;
    try {
        // Override account in the Contract to the masterAccount with the given access key.
        await contract.call.setValue({
            args: { value: 'test' },
            account: new Account(
                near.accountCreator.masterAccount.accountId,
                near.accountCreator.masterAccount.provider,
                new KeyPairSigner(keyPair)
            ),
        });
        failed = false;
    } catch (e) {
        expect(e.message).toEqual(
            `Can't complete the action because access key ${keyPair
                .getPublicKey()
                .toString()} doesn't exist`
        );
        expect(e.type).toEqual('AccessKeyDoesNotExist');
    }

    if (!failed) {
        throw new Error('should throw an error');
    }

    const worker = near.worker as Worker;
    await worker.tearDown();
});

test('view account details after adding access keys', async() => {
    const keyPair = KeyPair.fromRandom('ed25519');
    await nearjs.accountCreator.masterAccount.addKey(keyPair.getPublicKey(), contractId, '', 1000000000);

    const contract2 = await deployContract(nearjs.accountCreator.masterAccount, generateUniqueString('test_contract2'));
    const keyPair2 = KeyPair.fromRandom('ed25519');
    await nearjs.accountCreator.masterAccount.addKey(keyPair2.getPublicKey(), contract2.contractId, '', 2000000000);

    const details = await nearjs.accountCreator.masterAccount.getAccountDetails();
    const authorizedApps = [{
        contractId,
        amount: '1000000000',
        publicKey: keyPair.getPublicKey().toString(),
    },
    {
        contractId: contract2.contractId,
        amount: '2000000000',
        publicKey: keyPair2.getPublicKey().toString(),
    }];

    expect(details.authorizedApps).toEqual(expect.arrayContaining(authorizedApps));
    expect(authorizedApps).toEqual(expect.arrayContaining(details.authorizedApps));
    expect(details.authorizedApps).toHaveLength(authorizedApps.length);
});

test('loading account after adding a full key', async() => {
    const keyPair = KeyPair.fromRandom('ed25519');
    // wallet calls this with an empty string for contract id and method
    await workingAccount.addKey(keyPair.getPublicKey(), '', '');

    const accessKeys = await workingAccount.getAccessKeys();

    expect(accessKeys.length).toBe(2);
    const addedKey = accessKeys.find(item => item.public_key == keyPair.getPublicKey().toString());
    expect(addedKey).toBeTruthy();
    expect(addedKey!.access_key.permission).toEqual('FullAccess');
});
