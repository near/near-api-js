const { Account, KeyPair, Near, InMemoryKeyStore } = require('../');
const  { aliceAccountName, newAccountCodeHash, storageAccountIdKey, createFakeStorage, sleep } = require('./test-utils');
const dev = require('../dev');
const fs = require('fs');
let nearjs;
let account;
let keyStore;
let networkId;

const HELLO_WASM_PATH = process.env.HELLO_WASM_PATH || '../nearcore/tests/hello.wasm';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

beforeAll(async () => {
    // To avoid nonce collisions with promise test on alice
    await sleep(3000);

    networkId = 'somenetwork';
    keyStore = new InMemoryKeyStore(networkId);
    const storage = createFakeStorage();
    const config = Object.assign(require('./config')(process.env.NODE_ENV || 'test'), {
        networkId: networkId,
        deps: { keyStore, storage },
    });
    nearjs = await dev.connect(config);
    account = new Account(nearjs.nearClient);
});

test('test creating default config', async () => {
    // Make sure createDefaultConfig doesn't crash.
    Near.createDefaultConfig();
});

// TODO: Make 'dev connect' tests run on nearlib CI (i.e. with shared testnet)
const devConnectDescribe = process.env.SKIP_DEV_CONNECT_TESTS ? xdescribe : describe;
devConnectDescribe('dev connect', () => {
    let deps;
    let options;
    beforeEach(async () => {
        const keyStore = new InMemoryKeyStore(networkId);
        const storage = createFakeStorage();
        deps = {
            keyStore,
            storage,
            createAccount: dev.createAccountWithLocalNodeConnection
        };
        options = {
            deps,
        };
    });

    test('test dev connect like template', async () => {
        window.localStorage = createFakeStorage();
        // Mocking some
        let tmpCreate = dev.createAccountWithContractHelper;
        let devConfig = dev.getConfig;
        dev.getConfig = async () => 'THE_CONFIG';
        dev.createAccountWithContractHelper = async (nearConfig, newAccountId, publicKey) => {
            expect(nearConfig).toEqual('THE_CONFIG');
            return await dev.createAccountWithLocalNodeConnection(newAccountId, publicKey);
        };
        // Calling
        let near = await dev.connect();
        // Restoring mocked functions
        dev.getConfig = devConfig;
        dev.createAccountWithContractHelper = tmpCreate;
        let accId = dev.myAccountId;
        let accjs = new Account(near.nearClient);
        const viewAccountResponse = await accjs.viewAccount(accId);
        expect(viewAccountResponse.account_id).toEqual(accId);
    });

    test('test dev connect with git no account creates a new account', async () => {
        await dev.connect(options);
        expect(Object.keys(deps.keyStore.keys).length).toEqual(2); // one key for dev account and one key for the new account.
        const newAccountId = deps.storage.getItem(storageAccountIdKey);
        const viewAccountResponse = await account.viewAccount(newAccountId);
        const newAccountKeyPair = await deps.keyStore.getKey(newAccountId);
        expect(newAccountKeyPair).toBeTruthy();
        const expectedAccount = {
            nonce: 0,
            account_id: newAccountId,
            amount: 1000000000000,
            code_hash: newAccountCodeHash,
            public_keys: viewAccountResponse.public_keys,
            stake: 0,
        };
        expect(viewAccountResponse).toEqual(expectedAccount);
        expect(deps.storage.getItem(storageAccountIdKey)).toEqual(newAccountId);
    });

    test('test dev connect with invalid account in storage creates a new account', async () => {
        // set up invalid account id in local storage
        deps.storage.setItem(storageAccountIdKey, await generateUniqueString('invalid'));
        await dev.connect(options);
        expect(Object.keys(deps.keyStore.keys).length).toEqual(2);
        const newAccountId = deps.storage.getItem(storageAccountIdKey);
        const viewAccountResponse = await account.viewAccount(newAccountId);
        const newAccountKeyPair = await deps.keyStore.getKey(newAccountId);
        expect(newAccountKeyPair).toBeTruthy();
        const expectedAccount = {
            nonce: 0,
            account_id: newAccountId,
            amount: 1000000000000,
            code_hash: newAccountCodeHash,
            public_keys: viewAccountResponse.public_keys,
            stake: 0,
        };
        expect(viewAccountResponse).toEqual(expectedAccount);
        expect(deps.storage.getItem(storageAccountIdKey)).toEqual(newAccountId);
    });

    test('test dev connect with valid account but no keys', async () => {
        // setup: connect with dev, but rmemove keys afterwards!
        deps.storage.setItem(storageAccountIdKey, await generateUniqueString('invalid'));
        await dev.connect(options);
        expect(Object.keys(deps.keyStore.keys).length).toEqual(2);
        const newAccountId = deps.storage.getItem(storageAccountIdKey);
        expect(deps.storage.getItem(storageAccountIdKey)).toEqual(newAccountId);
        await deps.keyStore.clear();
        await dev.connect(options);
        // we are expecting account to be recreated!
        expect(deps.storage.getItem(storageAccountIdKey)).not.toEqual(newAccountId);
    });
});

test('view pre-defined account works and returns correct name', async () => {
    // We do not want to check the other properties of this account since we create other accounts
    // using this account as the originator
    const viewAccountResponse = await account.viewAccount(aliceAccountName);
    expect(viewAccountResponse.account_id).toEqual(aliceAccountName);
});

test('create account and then view account returns the created account', async () => {
    const newAccountName = await generateUniqueString('create.account.test');
    const newAccountPublicKey = '9AhWenZ3JddamBoyMqnTbp7yVbRuvqAv3zwfrWgfVRJE';
    const createAccountResponse = await account.createAccount(newAccountName, newAccountPublicKey, 0, aliceAccountName);
    await nearjs.waitForTransactionResult(createAccountResponse);
    const result = await account.viewAccount(newAccountName);
    const expectedAccount = {
        nonce: 0,
        account_id: newAccountName,
        amount: 0,
        code_hash: newAccountCodeHash,
        public_keys: result.public_keys,
        stake: 0,
    };
    expect(result).toEqual(expectedAccount);
});

test('create account with a new key and then view account returns the created account', async () => {
    const newAccountName = await generateUniqueString('create.randomkey.test');
    const amount = 1000000;
    const aliceAccountBeforeCreation = await account.viewAccount(aliceAccountName);
    const createAccountResponse = await account.createAccountWithRandomKey(
        newAccountName,
        amount,
        aliceAccountName);
    await nearjs.waitForTransactionResult(createAccountResponse);
    expect(createAccountResponse['key']).not.toBeFalsy();
    const result = await account.viewAccount(newAccountName);
    const expectedAccount = {
        nonce: 0,
        account_id: newAccountName,
        amount: amount,
        code_hash: newAccountCodeHash,
        public_keys: result.public_keys,
        stake: 0,
    };
    expect(result).toEqual(expectedAccount);
    const aliceAccountAfterCreation = await account.viewAccount(aliceAccountName);
    expect(aliceAccountAfterCreation.amount).toBe(aliceAccountBeforeCreation.amount - amount);
});

async function createAccount({ amount }) {
    const accountId = await generateUniqueString('create.account');
    const keyPair = KeyPair.fromRandomSeed();
    keyStore.setKey(accountId, keyPair);
    await nearjs.waitForTransactionResult(
        await account.createAccount(accountId, keyPair.publicKey, amount, aliceAccountName));
    return accountId;
}

test('send tokens', async () => {
    const sender = await createAccount({ amount: 1000 });
    const receiver = await createAccount({ amount: 0 });

    await nearjs.sendTokens(100, sender, receiver);

    expect(await account.viewAccount(sender)).toMatchObject({ amount: 900 });
    expect(await account.viewAccount(receiver)).toMatchObject({ amount: 100 });
});

describe('with access key', function () {
    let oldLog;
    let logs;
    let contractId = 'test_contract_' + Date.now();
    let newAccountId;
    let newAccountKeyPair;
    let keyForAccessKey = KeyPair.fromRandomSeed();

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;

    beforeAll(async () => {
        const keyWithRandomSeed = KeyPair.fromRandomSeed();
        const createAccountResponse = await account.createAccount(
            contractId,
            keyWithRandomSeed.getPublicKey(),
            10,
            aliceAccountName);
        await nearjs.waitForTransactionResult(createAccountResponse);
        await keyStore.setKey(contractId, keyWithRandomSeed);

        const data = [...fs.readFileSync(HELLO_WASM_PATH)];
        await nearjs.waitForTransactionResult(
            await nearjs.deployContract(contractId, data));
    });

    beforeEach(async () => {
        oldLog = console.log;
        logs = [];
        console.log = function() {
            logs.push(Array.from(arguments).join(' '));
        };

        newAccountId = await generateUniqueString('create.account.test');
        newAccountKeyPair = KeyPair.fromRandomSeed();
        const createAccountResponse = await account.createAccount(
            newAccountId,
            newAccountKeyPair.getPublicKey(),
            5000000000,
            aliceAccountName);
        await nearjs.waitForTransactionResult(createAccountResponse);
        await keyStore.setKey(newAccountId, newAccountKeyPair);

        const addAccessKeyResponse = await account.addAccessKey(
            newAccountId,
            keyForAccessKey.getPublicKey(),
            contractId,
            '',  // methodName
            '',  // fundingOwner
            1000000000,  // fundingAmount
        );
        await nearjs.waitForTransactionResult(addAccessKeyResponse);
    });

    afterEach(async () => {
        console.log = oldLog;
    });

    test('make function calls using access key', async () => {
        // Replacing public key for the account with the access key
        await keyStore.setKey(newAccountId, keyForAccessKey);
        // test that load contract works and we can make calls afterwards
        const contract = await nearjs.loadContract(contractId, {
            viewMethods: ['getValue'],
            changeMethods: ['setValue'],
            sender: newAccountId,
        });
        const setCallValue2 = await generateUniqueString('setCallPrefix');
        const setValueResult = await contract.setValue({ value: setCallValue2 });
        expect(setValueResult.status).toBe('Completed');
        const getValueResult2 = await contract.getValue();
        expect(getValueResult2).toEqual(setCallValue2);
    });

    test('removed access key no longer works', async () => {
        if (process.env.SKIP_NEW_RPC_TESTS) return;
        // remove the access key like UI: call get account details, then remove using data from account details
        const details = await account.getAccountDetails(newAccountId);
        const expectedResult = {
            authorizedApps:[ {
                contractId: contractId,
                amount: 1000000000,
                publicKey: keyForAccessKey.getPublicKey() } ],
            transactions: [] };
        expect(details.authorizedApps).toEqual(jasmine.arrayContaining(expectedResult.authorizedApps));
        const removeResponse = await account.removeAccessKey(
            newAccountId,
            expectedResult.authorizedApps[0].publicKey
        );
        await nearjs.waitForTransactionResult(removeResponse);

        // Replacing public key for the account with the access key
        await keyStore.setKey(newAccountId, keyForAccessKey);

        // test that we can't make calls with deleted key
        const contract = await nearjs.loadContract(contractId, {
            viewMethods: ['getValue'],
            changeMethods: ['setValue'],
            sender: newAccountId,
        });
        const setCallValue2 = await generateUniqueString('setCallPrefix');
        await expect(contract.setValue({ value: setCallValue2 })).rejects.toThrow(/Internal error: Tx.+ not found/);
    });


    test('view account details after adding access keys', async () => {
        if (process.env.SKIP_NEW_RPC_TESTS) return;
        const keyWithRandomSeed = KeyPair.fromRandomSeed();
        const contractId2 = 'test_contract2_' + Date.now();
        const createAccountResponse = await account.createAccount(
            contractId2,
            keyWithRandomSeed.getPublicKey(),
            10,
            aliceAccountName);
        await nearjs.waitForTransactionResult(createAccountResponse);
        await keyStore.setKey(contractId2, keyWithRandomSeed);
        const data = [...fs.readFileSync(HELLO_WASM_PATH)];
        await nearjs.waitForTransactionResult(
            await nearjs.deployContract(contractId2, data));

        const keyForAccessKey2 = KeyPair.fromRandomSeed();
        const addAccessKeyResponse2 = await account.addAccessKey(
            newAccountId,
            keyForAccessKey2.getPublicKey(),
            contractId2,
            '',  // methodName
            '',  // fundingOwner
            2000000000,  // fundingAmount
        );
        await nearjs.waitForTransactionResult(addAccessKeyResponse2);
       
        const details = await account.getAccountDetails(newAccountId);
        const expectedResult = {
            authorizedApps:[ {
                contractId: contractId,
                amount: 1000000000,
                publicKey: keyForAccessKey.getPublicKey() },
            { contractId: contractId2,
                amount: 2000000000,
                publicKey: keyForAccessKey2.getPublicKey() } ],
            transactions: [] };
        expect(details.authorizedApps).toEqual(jasmine.arrayContaining(expectedResult.authorizedApps));
    });
});

function loadContract({ contractName, sender }) {
    return nearjs.loadContract(contractName, {
        sender,
        viewMethods: ['getAllKeys', 'returnHiWithLogs', 'hello', 'getValue'],
        changeMethods: ['generateLogs', 'triggerAssert', 'testSetRemove', 'setValue']
    });
}

function getPublicKeys({ public_keys: publicKeys }) {
    return publicKeys.map(arr => KeyPair.encodeBufferInBs58(Buffer.from(arr)));
}

describe('with deployed contract', () => {
    let contract;
    let oldLog;
    let logs;
    let contractName = 'test_contract_' + Date.now();
    let networkId = 'somenetwork';

    beforeAll(async () => {
        // See README.md for details about this contract source code location.
        const keyWithRandomSeed = KeyPair.fromRandomSeed();
        const createAccountResponse = await account.createAccount(
            contractName,
            keyWithRandomSeed.getPublicKey(),
            5000000000,
            aliceAccountName);
        await nearjs.waitForTransactionResult(createAccountResponse);
        keyStore.setKey(contractName, keyWithRandomSeed, networkId);
        const data = [...fs.readFileSync(HELLO_WASM_PATH)];
        await nearjs.waitForTransactionResult(
            await nearjs.deployContract(contractName, data));
        contract = await loadContract({ contractName, sender: aliceAccountName });
    });

    beforeEach(async () => {
        oldLog = console.log;
        logs = [];
        console.log = function() {
            logs.push(Array.from(arguments).join(' '));
        };
    });

    afterEach(async () => {
        console.log = oldLog;
    });

    test('make view function calls raw', async () => {
        const viewFunctionResult = await nearjs.callViewFunction(
            contractName,
            'hello', // this is the function defined in hello.wasm file that we are calling
            { name: 'trex' });
        expect(viewFunctionResult).toEqual('hello trex');
    });

    test('make state change function calls raw', async () => {
        const setCallValue = await generateUniqueString('setCallPrefix');
        const scheduleResult = await nearjs.scheduleFunctionCall(
            1000000000,
            aliceAccountName,
            contractName,
            'setValue', // this is the function defined in hello.wasm file that we are calling
            { value: setCallValue });
        expect(scheduleResult.hash).not.toBeFalsy();
        const result = await nearjs.waitForTransactionResult(scheduleResult);
        expect(result.lastResult).toEqual(setCallValue);
        const getValueResult = await nearjs.callViewFunction(
            contractName,
            'getValue', // this is the function defined in hello.wasm file that we are calling
            {});
        expect(getValueResult).toEqual(setCallValue);
    });

    test('make view calls wrapped', async () => {
        const helloResult = await contract.hello({ name: 'trex' });
        expect(helloResult).toEqual('hello trex');
    });

    test('make state change `calls wrapped', async () => {
        const setCallValue2 = await generateUniqueString('setCallPrefix');
        const setValueResult = await contract.setValue({ value: setCallValue2 });
        expect(setValueResult.status).toBe('Completed');
        const getValueResult2 = await contract.getValue();
        expect(getValueResult2).toEqual(setCallValue2);
    });

    test('can get logs from method result', async () => {
        await contract.generateLogs();
        expect(logs).toEqual([`[${contractName}]: LOG: log1`, `[${contractName}]: LOG: log2`]);
    });

    test('can get logs from view call', async () => {
        let result = await contract.returnHiWithLogs();
        expect(result).toEqual('Hi');
        expect(logs).toEqual([`[${contractName}]: LOG: loooog1`, `[${contractName}]: LOG: loooog2`]);
    });

    const failedAssertTest = process.env.SKIP_FAILED_ASSERT_TEST ? xtest : test;
    failedAssertTest('can get assert message from method result', async () => {
        await expect(contract.triggerAssert()).rejects.toThrow(/Transaction .+ failed.+expected to fail/);
        expect(logs.length).toBe(3);
        expect(logs[0]).toEqual(`[${contractName}]: LOG: log before assert`);
        expect(logs[1]).toMatch(new RegExp(`^\\[${contractName}\\]: ABORT: "expected to fail" filename: "../out/main.ts" line: \\d+ col: \\d+$`));
        expect(logs[2]).toEqual(`[${contractName}]: Runtime error: wasm async call execution failed with error: Runtime(AssertFailed)`);
    });

    test('test set/remove', async () => {
        const result = await contract.testSetRemove({value: '123'});
        expect(result.status).toBe('Completed');
    });

    describe('with new account', () => {
        let accountId;

        beforeEach(async () => {
            accountId = await createAccount({ amount: 100000000 });
        });

        describe('add account key', () => {
            let keyPair;

            beforeEach(async () => {
                keyPair = KeyPair.fromRandomSeed();
                await nearjs.waitForTransactionResult(
                    await account.addAccountKey(accountId, keyPair.publicKey));
                await keyStore.setKey(accountId, keyPair);
            });

            test('account contains key', async () => {
                const publicKeys = getPublicKeys(await account.viewAccount(accountId));
                expect(publicKeys).toContainEqual(keyPair.publicKey);
            });

            test('remove account key', async () => {
                await nearjs.waitForTransactionResult(
                    await account.removeAccountKey(accountId, keyPair.publicKey));

                const publicKeys = getPublicKeys(await account.viewAccount(accountId));
                expect(publicKeys).not.toContainEqual(keyPair.publicKey);
            });
        });
    });
});

// Generate some unique string with a given prefix using the alice nonce.
const generateUniqueString = async (prefix) => {
    const viewAccountResponse = await account.viewAccount(aliceAccountName);
    return prefix + viewAccountResponse.nonce;
};
