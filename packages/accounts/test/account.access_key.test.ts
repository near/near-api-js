import { beforeAll, beforeEach, expect, test } from '@jest/globals';
import { KeyPair } from '@near-js/crypto';

import { createAccount, deployContract, generateUniqueString, networkId, setUpTestConnection } from './test-utils';

let nearjs;
let workingAccount;
let contractId;
let contract;

beforeAll(async () => {
    nearjs = await setUpTestConnection();
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
    await workingAccount.addKey(keyPair.getPublicKey(), contractId, '', '2000000000000000000000000');

    // Override in the key store the workingAccount key to the given access key.
    await nearjs.connection.signer.keyStore.setKey(networkId, workingAccount.accountId, keyPair);
    const setCallValue = generateUniqueString('setCallPrefix');
    await contract.setValue({ args: { value: setCallValue } });
    expect(await contract.getValue()).toEqual(setCallValue);
});

test('remove access key no longer works', async() => {
    const keyPair = KeyPair.fromRandom('ed25519');
    const publicKey = keyPair.getPublicKey();
    await nearjs.accountCreator.masterAccount.addKey(publicKey, contractId, '', 400000);
    await nearjs.accountCreator.masterAccount.deleteKey(publicKey);
    // Override in the key store the workingAccount key to the given access key.
    await nearjs.connection.signer.keyStore.setKey(networkId, nearjs.accountCreator.masterAccount.accountId, keyPair);
    let failed = true;
    try {
        await contract.setValue({ args: { value: 'test' } });
        failed = false;
    } catch (e) {
        expect(e.message).toEqual(`Can not sign transactions for account ${nearjs.accountCreator.masterAccount.accountId} on network ${networkId}, no matching key pair exists for this account`);
        expect(e.type).toEqual('KeyNotFound');
    }

    if (!failed) {
        throw new Error('should throw an error');
    }

    nearjs = await setUpTestConnection();
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

    details.authorizedApps.sort((a, b) => a.contractId > b.contractId);
    expect(JSON.stringify(details.authorizedApps)).toEqual(JSON.stringify(authorizedApps));
});

test('loading account after adding a full key', async() => {
    const keyPair = KeyPair.fromRandom('ed25519');
    // wallet calls this with an empty string for contract id and method
    await workingAccount.addKey(keyPair.getPublicKey(), '', '');

    const accessKeys = await workingAccount.getAccessKeys();

    expect(accessKeys.length).toBe(2);
    const addedKey = accessKeys.find(item => item.public_key == keyPair.getPublicKey().toString());
    expect(addedKey).toBeTruthy();
    expect(addedKey.access_key.permission).toEqual('FullAccess');
});

test('load invalid key pair', async() => {
    // Override in the key store with invalid key pair
    await nearjs.connection.signer.keyStore.setKey(networkId, nearjs.accountCreator.masterAccount.accountId, '');
    let failed = true;
    try {
        await contract.setValue({ args: { value: 'test' } });
        failed = false;
    } catch (e) {
        expect(e.message).toEqual(`no matching key pair found in ${nearjs.connection.signer}`);
        expect(e.type).toEqual('PublicKeyNotFound');
    }

    if (!failed) {
        throw new Error('should throw an error');
    }
});