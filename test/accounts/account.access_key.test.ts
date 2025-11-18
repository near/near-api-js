import { afterAll, beforeAll, beforeEach, expect, jest, test } from '@jest/globals';


import { createAccount, deployContract, generateUniqueString, setUpTestConnection } from './test-utils';
import { Account, TypedContract, KeyPair, KeyPairSigner } from '../../src';

import { Worker } from 'near-workspaces';

let nearjs: Awaited<ReturnType<typeof setUpTestConnection>>;
let workingAccount: Account;
let contractId: string;
// @ts-expect-error infer type here
let contract = new TypedContract({});

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
        // @ts-expect-error abi is unknown
        contract = await deployContract(nearjs.account, contractId);
    } catch (e) {
        console.error(e);
    }
});

test('make function call using access key', async() => {
    const keyPair = KeyPair.fromRandom('ed25519');
    await workingAccount.addFunctionCallAccessKey({
        publicKey: keyPair.getPublicKey(),
        contractId,
        methodNames: [],
        allowance: 2000000000000000000000000n
    });

    const setCallValue = generateUniqueString('setCallPrefix');
    await contract.call.setValue({
        account: new Account({ accountId: workingAccount.accountId, provider: workingAccount.provider, signer: new KeyPairSigner(keyPair) }),
        args: { value: setCallValue },
    });
    expect(await contract.view.getValue()).toEqual(setCallValue);
});

test('remove access key no longer works', async() => {
    const near = await setUpTestConnection();

    const keyPair = KeyPair.fromRandom('ed25519');
    const publicKey = keyPair.getPublicKey();
    await near.account.addFunctionCallAccessKey({ publicKey, contractId, methodNames: [], allowance: 400000n });
    await near.account.deleteKey({ publicKey });
    // Override account in the Contract to the masterAccount with the given access key.
    near.account.setSigner(new KeyPairSigner(keyPair));

    let failed = true;
    try {
        await contract.call.setValue({ args: { value: 'test' }, account: near.account });
        failed = false;
    } catch (e) {
        expect(e.message).toEqual(`Can't complete the action because access key ${keyPair.getPublicKey().toString()} doesn't exist`);
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
    await workingAccount.addFunctionCallAccessKey({ publicKey: keyPair.getPublicKey(), contractId, methodNames: [], allowance: 1000000000 });

    const contract2 = await deployContract(nearjs.account, generateUniqueString('test_contract2'));
    const keyPair2 = KeyPair.fromRandom('ed25519');
    await workingAccount.addFunctionCallAccessKey({ publicKey: keyPair2.getPublicKey(), contractId: contract2.contractId, methodNames: [], allowance: 2000000000 });

    const response = await workingAccount.getAccessKeyList();

    const key1 = response.keys.find(item => item.public_key === keyPair.getPublicKey().toString());
    expect(key1).toBeDefined();
    expect(key1!.access_key).toMatchObject({
        nonce: expect.any(Number),
        permission: {
            FunctionCall: {
                allowance: '1000000000',
                receiver_id: contractId,
                method_names: [],
            },
        },
    });

    const key2 = response.keys.find(item => item.public_key === keyPair2.getPublicKey().toString());
    expect(key2).toBeDefined();
    expect(key2!.access_key).toMatchObject({
        nonce: expect.any(Number),
        permission: {
            FunctionCall: {
                allowance: '2000000000',
                receiver_id: contract2.contractId,
                method_names: [],
            },
        },
    });
});

test('loading account after adding a full key', async() => {
    const keyPair = KeyPair.fromRandom('ed25519');
    await workingAccount.addFullAccessKey({ publicKey: keyPair.getPublicKey() });

    const accessKeys = await workingAccount.getAccessKeyList();

    expect(accessKeys.keys.length).toBe(2);
    const addedKey = accessKeys.keys.find(item => item.public_key == keyPair.getPublicKey().toString());
    expect(addedKey).toBeTruthy();
    expect(addedKey!.access_key.permission).toEqual('FullAccess');
});
