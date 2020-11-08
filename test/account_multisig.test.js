const nearApi = require('../lib/index');
const fs = require('fs');
const BN = require('bn.js');
const testUtils  = require('./test-utils');
const semver = require('semver');

let nearjs;
let workingAccount;
let startFromVersion;

const {
    KeyPair,
    transactions: { functionCall },
    InMemorySigner,
    keyStores: { InMemoryKeyStore },
    multisig: { AccountMultisig, MULTISIG_GAS, MULTISIG_DEPOSIT },
    utils: { format: { parseNearAmount } }
} = nearApi;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

const AccountMultisigInstance = async (account, keyMapping = ({ public_key: publicKey }) => ({ publicKey, kind: 'phone' })) => {
    // modifiers to functions replaces contract helper (CH)
    const { accountId } = account
    const keys = await account.getAccessKeys()
    const accountMultisig = new AccountMultisig(nearjs.connection, accountId, {
        // skip this (not using CH)
        getCode: () => {},
        sendCode: () => {},
        // auto accept "code"
        verifyCode: () => ({ success: true, res: '' }),
        onResult: async () => {
            const { requestId } = accountMultisig.getRequest()
            console.log('requestId', requestId)
            // set confirmKey as signer
            const originalSigner = nearjs.connection.signer
            const tempKeyStore = new InMemoryKeyStore()
            await tempKeyStore.setKey(nearjs.connection.networkId, accountId, accountMultisig.confirmKey)
            nearjs.connection.signer = new InMemorySigner(tempKeyStore)
            // 2nd confirmation signing with confirmKey from Account instance
            await account.signAndSendTransaction(accountId, [
                functionCall('confirm', { request_id: requestId }, MULTISIG_GAS, MULTISIG_DEPOSIT)
            ]);
            nearjs.connection.signer = originalSigner
        }
    });
    accountMultisig.confirmKey = KeyPair.fromRandom('ed25519')
    accountMultisig.postSignedJson = () => ({ publicKey: accountMultisig.confirmKey.getPublicKey() });
    accountMultisig.getRecoveryMethods = () => ({
        data: keys.map(keyMapping)
    });
    try {
        await accountMultisig.deployMultisig([...fs.readFileSync('./test/data/multisig.wasm')]);
    } catch (e) {
        console.log(e)
        if (e.message.indexOf('Contract method is not found') === -1) {
            throw(e);
        }
    }
    return accountMultisig;
};

beforeAll(async () => {
    nearjs = await testUtils.setUpTestConnection();
    workingAccount = await testUtils.createAccountMultisig(nearjs, {
        getCode: () => 'test'
    });
    let nodeStatus = await nearjs.connection.provider.status();
    startFromVersion = (version) => semver.gte(nodeStatus.version.version, version);
    console.log(startFromVersion);
});

describe('deployMultisig key rotations', () => {

    test('full access key if recovery method is "ledger" or "phrase"', async () => {
        const account = await testUtils.createAccount(nearjs);
        await account.addKey(KeyPair.fromRandom('ed25519').getPublicKey());
        const keys = await account.getAccessKeys()
        const accountMultisig = await AccountMultisigInstance(
            account,
            ({ public_key: publicKey }, i) => ({ publicKey, kind: i > 0 ? 'ledger' : 'phrase' })
        );
        const currentKeys = await accountMultisig.getAccessKeys();
        expect(currentKeys.find(({ public_key }) => keys[0].public_key === public_key).access_key.permission).toEqual('FullAccess');
        expect(currentKeys.find(({ public_key }) => keys[1].public_key === public_key).access_key.permission).toEqual('FullAccess');
    });

    test('access key if method is "phone"', async () => {
        const account = await testUtils.createAccount(nearjs);
        const keys = await account.getAccessKeys()
        const accountMultisig = await AccountMultisigInstance(account);
        const currentKeys = await accountMultisig.getAccessKeys();
        expect(currentKeys.find(({ public_key }) => keys[0].public_key === public_key).access_key.permission).not.toEqual('FullAccess');
    });
    
});

describe('accountMultisig transactions', () => {

    test('add app key', async() => {
        let account = await testUtils.createAccount(nearjs);
        account = await AccountMultisigInstance(account);
        const appPublicKey = KeyPair.fromRandom('ed25519').getPublicKey()
        const appMethodNames = ['some_app_stuff', 'some_more_app_stuff']
        await account.addKey(appPublicKey, 'foobar', appMethodNames.join(), new BN(parseNearAmount('0.25')));
        const keys = await account.getAccessKeys()
        // console.log(keys.map((k) => ({
        //     publicKey: k.public_key,
        //     permission: k.access_key.permission,
        //     method_names: k.access_key.permission.FunctionCall.method_names
        // })))
        // console.log('appPublicKey', appPublicKey.toString())
        expect(keys.find(({ public_key }) => appPublicKey.toString() === public_key)
            .access_key.permission.FunctionCall.method_names).toEqual(appMethodNames);
    });

    test('send money', async() => {
        let sender = await testUtils.createAccount(nearjs);
        let receiver = await testUtils.createAccount(nearjs);
        sender = await AccountMultisigInstance(sender);
        receiver = await AccountMultisigInstance(receiver);
        const { amount: receiverAmount } = await receiver.state();
        await sender.sendMoney(receiver.accountId, new BN(parseNearAmount('1')));
        await receiver.fetchState();
        const state = await receiver.state();
        expect(BigInt(state.amount)).toBeGreaterThanOrEqual(BigInt(new BN(receiverAmount).add(new BN(parseNearAmount('0.9'))).toString()));
    });
    
});
