/* global BigInt */
const nearApi = require('../src/index');
const fs = require('fs');
const BN = require('bn.js');
const testUtils  = require('./test-utils');
const semver = require('semver');
const { transfer } = require('../src/transaction');

let nearjs;
let startFromVersion;

const {
    KeyPair,
    transactions: { functionCall },
    InMemorySigner,
    multisig: { Account2FA, MULTISIG_CHANGE_METHODS, MULTISIG_GAS, MULTISIG_DEPOSIT },
    utils: { format: { parseNearAmount } }
} = nearApi;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

const getAccount2FA = async (
    account,
    keyMapping = ({ public_key: publicKey }) => ({ publicKey, kind: 'phone' }),
    deployContract = true
) => {
    // modifiers to functions replaces contract helper (CH)
    const { accountId } = account;
    const keys = await account.getAccessKeys();
    const account2fa = new Account2FA(nearjs.connection, accountId, {
        // skip this (not using CH)
        getCode: () => {},
        sendCode: () => {},
        // auto accept "code"
        verifyCode: () => ({  }), // TODO: Is there any content needed in result?
        onAddRequestResult: async () => {
            const { requestId } = account2fa.getRequest();
            // set confirmKey as signer
            const originalSigner = nearjs.connection.signer;
            nearjs.connection.signer = await InMemorySigner.fromKeyPair(nearjs.connection.networkId, accountId, account2fa.confirmKey);
            // 2nd confirmation signing with confirmKey from Account instance
            await account.signAndSendTransaction({
                receiverId: accountId,
                actions: [
                    functionCall('confirm', { request_id: requestId }, MULTISIG_GAS, MULTISIG_DEPOSIT)
                ]
            });
            nearjs.connection.signer = originalSigner;
        }
    });
    account2fa.confirmKey = KeyPair.fromRandom('ed25519');
    account2fa.postSignedJson = () => ({ publicKey: account2fa.confirmKey.getPublicKey() });
    account2fa.getRecoveryMethods = () => ({
        data: keys.map(keyMapping)
    });
    if (deployContract) {
        await account2fa.deployMultisig([...fs.readFileSync('./test/data/multisig.wasm')]);
    }
    return account2fa;
};

function mock2faLimitedAccessKeys(keysToReturn) {
    return new Array(keysToReturn)
        .fill()
        .map(() => ({
            public_key: KeyPair.fromRandom('ed25519').publicKey.toString(),
        }));
}

beforeAll(async () => {
    nearjs = await testUtils.setUpTestConnection();
    let nodeStatus = await nearjs.connection.provider.status();
    startFromVersion = (version) => semver.gte(nodeStatus.version.version, version);
    console.log(startFromVersion);
});

describe('deployMultisig key rotations', () => {

    test('full access key if recovery method is "ledger" or "phrase", limited access key if "phone"', async () => {
        const account = await testUtils.createAccount(nearjs);
        await account.addKey(KeyPair.fromRandom('ed25519').getPublicKey());
        await account.addKey(KeyPair.fromRandom('ed25519').getPublicKey());
        const keys = await account.getAccessKeys();
        const kinds = ['ledger', 'phrase', 'phone'];
        const account2fa = await getAccount2FA(
            account,
            ({ public_key: publicKey }, i) => ({ publicKey, kind: kinds[i] })
        );
        const currentKeys = await account2fa.getAccessKeys();
        expect(currentKeys.find(({ public_key }) => keys[0].public_key === public_key).access_key.permission).toEqual('FullAccess');
        expect(currentKeys.find(({ public_key }) => keys[1].public_key === public_key).access_key.permission).toEqual('FullAccess');
        expect(currentKeys.find(({ public_key }) => keys[2].public_key === public_key).access_key.permission).not.toEqual('FullAccess');
    });
    
});

describe('account2fa transactions', () => {

    test('add app key before deployMultisig', async() => {
        let account = await testUtils.createAccount(nearjs);
        const appPublicKey = KeyPair.fromRandom('ed25519').getPublicKey();
        const appAccountId = 'foobar';
        const appMethodNames = ['some_app_stuff','some_more_app_stuff'];
        await account.addKey(appPublicKey.toString(), appAccountId, appMethodNames, new BN(parseNearAmount('0.25')));
        account = await getAccount2FA(account);
        const keys = await account.getAccessKeys();
        expect(keys.find(({ public_key }) => appPublicKey.toString() === public_key)
            .access_key.permission.FunctionCall.method_names).toEqual(appMethodNames);
        expect(keys.find(({ public_key }) => appPublicKey.toString() === public_key)
            .access_key.permission.FunctionCall.receiver_id).toEqual(appAccountId);
    });

    test('add app key', async() => {
        let account = await testUtils.createAccount(nearjs);
        account = await getAccount2FA(account);
        const appPublicKey = KeyPair.fromRandom('ed25519').getPublicKey();
        const appAccountId = 'foobar';
        const appMethodNames = ['some_app_stuff', 'some_more_app_stuff'];
        await account.addKey(appPublicKey.toString(), appAccountId, appMethodNames, new BN(parseNearAmount('0.25')));
        const keys = await account.getAccessKeys();
        expect(keys.find(({ public_key }) => appPublicKey.toString() === public_key)
            .access_key.permission.FunctionCall.method_names).toEqual(appMethodNames);
        expect(keys.find(({ public_key }) => appPublicKey.toString() === public_key)
            .access_key.permission.FunctionCall.receiver_id).toEqual(appAccountId);
    });

    test('send money', async() => {
        let sender = await testUtils.createAccount(nearjs);
        let receiver = await testUtils.createAccount(nearjs);
        sender = await getAccount2FA(sender);
        receiver = await getAccount2FA(receiver);
        const { amount: receiverAmount } = await receiver.state();
        await sender.sendMoney(receiver.accountId, new BN(parseNearAmount('1')));
        const state = await receiver.state();
        expect(BigInt(state.amount)).toBeGreaterThanOrEqual(BigInt(new BN(receiverAmount).add(new BN(parseNearAmount('0.9'))).toString()));
    });

    test('send money through signAndSendTransaction', async() => {
        let sender = await testUtils.createAccount(nearjs);
        let receiver = await testUtils.createAccount(nearjs);
        sender = await getAccount2FA(sender);
        receiver = await getAccount2FA(receiver);
        const { amount: receiverAmount } = await receiver.state();
        await sender.signAndSendTransaction({receiverId: receiver.accountId, actions: [transfer(new BN(parseNearAmount('1')))]});
        const state = await receiver.state();
        expect(BigInt(state.amount)).toBeGreaterThanOrEqual(BigInt(new BN(receiverAmount).add(new BN(parseNearAmount('0.9'))).toString()));
    });

});

describe('2fa batch key conversion', () => {
    let sender;
    beforeAll(async () => {
        sender = await testUtils.createAccount(nearjs);
        sender = await getAccount2FA(sender);
    });

    beforeEach(async () => {
        sender = await getAccount2FA(sender, undefined, false);
        sender.disable = async () => {};
    });

    test('get2faLimitedAccessKeys filters out full access keys', async() => {
        sender.getAccessKeys = async () => [{
            access_key: { permission: 'FullAccess' },
            public_key: KeyPair.fromRandom('ed25519').publicKey.toString(),
        }];

        expect(await sender.get2faLimitedAccessKeys()).toHaveLength(0);
    });

    test('get2faLimitedAccessKeys filters out LAKs with only the `confirm` method', async() => {
        sender.getAccessKeys = async () => [{
            access_key: {
                permission: {
                    FunctionCall: {
                        method_names: ['confirm'],
                        receiver_id: sender.accountId,
                    },
                },
            },
            public_key: KeyPair.fromRandom('ed25519').publicKey.toString(),
        }];

        expect(await sender.get2faLimitedAccessKeys()).toHaveLength(0);
    });

    test('get2faLimitedAccessKeys includes LAKs for requesting multisig signing', async() => {
        sender.getAccessKeys = async () => [{
            access_key: {
                permission: {
                    FunctionCall: {
                        method_names: MULTISIG_CHANGE_METHODS,
                        receiver_id: sender.accountId,
                    },
                },
            },
            public_key: KeyPair.fromRandom('ed25519').publicKey.toString(),
        }];

        expect(await sender.get2faLimitedAccessKeys()).toHaveLength(1);
    });

    test('isConversionRequiredForDisable returns false for accounts with fewer than 48 LAKs to convert', async() => {
        await Promise.all([0, 1, 2, 48].map(async (n) => {
            sender.get2faLimitedAccessKeys = async () => mock2faLimitedAccessKeys(n);
            expect(await sender.isConversionRequiredForDisable()).toEqual(false);
        }));
    });

    test('isConversionRequiredForDisable returns true for accounts with 48 or more LAKs to convert', async() => {
        await Promise.all([49, 100].map(async (n) => {
            sender.get2faLimitedAccessKeys = async () => mock2faLimitedAccessKeys(n);
            expect(await sender.isConversionRequiredForDisable()).toEqual(true);
        }));
    });

    test('batchConvertKeysAndDisable throws an exception for empty signing keys', async() => {
        await expect(async () => {
            await sender.batchConvertKeysAndDisable({});
        }).rejects.toBeTruthy();

        await expect(async () => {
            await sender.batchConvertKeysAndDisable({ signingPublicKey: '' });
        }).rejects.toBeTruthy();
    });

    test('batchConvertKeysAndDisable signs the expected number of transactions', async() => {
        const batches = [
            // no batches for cardinality <= 48 since these can be disabled directly
            { numberOfLaks: 1, numberOfBatches: 0 },
            { numberOfLaks: 48, numberOfBatches: 0 },
            { numberOfLaks: 49, numberOfBatches: 1 },
            { numberOfLaks: 98, numberOfBatches: 1 },
            { numberOfLaks: 99, numberOfBatches: 2 },
        ];

        await Promise.all(batches.map(async ({ numberOfLaks, numberOfBatches }) => {
            let batchesSigned = 0;
            let disable2faCalled = false;
            const laks = mock2faLimitedAccessKeys(numberOfLaks);
            const account = {
                ...sender,
                validateMultisigState: async () => {},
                get2faLimitedAccessKeys: async () => laks,
                signAndSendTransaction: async () => batchesSigned++,
                disable: async () => disable2faCalled = true,
            };
            account.batchConvertKeysAndDisable = sender.batchConvertKeysAndDisable.bind(account);

            const signingPublicKey = (await account.get2faLimitedAccessKeys())[0];
            await account.batchConvertKeysAndDisable({
                signingPublicKey: signingPublicKey.public_key,
                contractBytes: [],
                cleanupContractBytes: [],
            });
            expect(batchesSigned).toEqual(numberOfBatches);
            expect(disable2faCalled).toBe(true);
        }));
    });
});
