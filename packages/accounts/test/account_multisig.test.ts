import * as fs from 'node:fs';
import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import { KeyPair } from '@near-js/crypto';
import { InMemorySigner } from '@near-js/signers';
import { actionCreators } from '@near-js/transactions';
import { parseNearAmount } from '@near-js/utils';
import semver from 'semver';

import { Account2FA, MULTISIG_DEPOSIT, MULTISIG_GAS, MultisigStateStatus } from '../src';
import { createAccount, setUpTestConnection } from './test-utils';

const { functionCall, transfer } = actionCreators;

let nearjs;
let startFromVersion;

jest.setTimeout(50000);

const getAccount2FA = async (account, keyMapping = ({ public_key: publicKey }) => ({ publicKey, kind: 'phone' })) => {
    // modifiers to functions replaces contract helper (CH)
    const { accountId } = account;
    const keys = await account.getAccessKeys();
    const account2fa: any = new Account2FA(nearjs.connection, accountId, {
        // skip this (not using CH)
        getCode: () => {},
        sendCode: () => {},
        // auto accept "code"
        verifyCode: () => ({}), // TODO: Is there any content needed in result?
        onAddRequestResult: async () => {
            const { requestId } = account2fa.getRequest();
            // set confirmKey as signer
            const originalSigner = nearjs.connection.signer;
            nearjs.connection.signer = await InMemorySigner.fromKeyPair(
                nearjs.connection.networkId,
                accountId,
                account2fa.confirmKey,
            );
            // 2nd confirmation signing with confirmKey from Account instance
            await account.signAndSendTransaction({
                receiverId: accountId,
                actions: [functionCall('confirm', { request_id: requestId }, MULTISIG_GAS, MULTISIG_DEPOSIT)],
            });
            nearjs.connection.signer = originalSigner;
        },
    });
    account2fa.confirmKey = KeyPair.fromRandom('ed25519');
    account2fa.postSignedJson = () => ({
        publicKey: account2fa.confirmKey.getPublicKey(),
    });
    account2fa.getRecoveryMethods = () => ({
        data: keys.map(keyMapping),
    });
    account2fa.checkMultisigCodeAndStateStatus = () => ({
        codeStatus: 1,
        stateStatus: MultisigStateStatus.STATE_NOT_INITIALIZED,
    });
    await account2fa.deployMultisig(fs.readFileSync('./test/wasm/multisig.wasm'));
    return account2fa;
};

beforeAll(async () => {
    nearjs = await setUpTestConnection();
    const nodeStatus = await nearjs.connection.provider.status();
    startFromVersion = (version) => semver.gte(nodeStatus.version.version, version);
    console.log(startFromVersion);
});

describe('deployMultisig key rotations', () => {
    test('full access key if recovery method is "ledger" or "phrase", limited access key if "phone"', async () => {
        const account = await createAccount(nearjs);
        await account.addKey(KeyPair.fromRandom('ed25519').getPublicKey());
        await account.addKey(KeyPair.fromRandom('ed25519').getPublicKey());
        const keys = await account.getAccessKeys();
        const kinds = ['ledger', 'phrase', 'phone'];
        const account2fa = await getAccount2FA(
            account,
            // @ts-expect-error test input
            ({ public_key: publicKey }, i) => ({ publicKey, kind: kinds[i] }),
        );
        const currentKeys = await account2fa.getAccessKeys();
        expect(currentKeys.find(({ public_key }) => keys[0].public_key === public_key).access_key.permission).toEqual(
            'FullAccess',
        );
        expect(currentKeys.find(({ public_key }) => keys[1].public_key === public_key).access_key.permission).toEqual(
            'FullAccess',
        );
        expect(
            currentKeys.find(({ public_key }) => keys[2].public_key === public_key).access_key.permission,
        ).not.toEqual('FullAccess');
    });
});

describe('account2fa transactions', () => {
    test('add app key before deployMultisig', async () => {
        let account = await createAccount(nearjs);
        const appPublicKey = KeyPair.fromRandom('ed25519').getPublicKey();
        const appAccountId = 'foobar';
        const appMethodNames = ['some_app_stuff', 'some_more_app_stuff'];
        await account.addKey(appPublicKey.toString(), appAccountId, appMethodNames, BigInt(parseNearAmount('0.25')));
        account = await getAccount2FA(account);
        const keys = await account.getAccessKeys();
        expect(
            // @ts-expect-error test input
            keys.find(({ public_key }) => appPublicKey.toString() === public_key).access_key.permission.FunctionCall
                .method_names,
        ).toEqual(appMethodNames);
        expect(
            // @ts-expect-error test input
            keys.find(({ public_key }) => appPublicKey.toString() === public_key).access_key.permission.FunctionCall
                .receiver_id,
        ).toEqual(appAccountId);
    });

    test('add app key', async () => {
        let account = await createAccount(nearjs);
        account = await getAccount2FA(account);
        const appPublicKey = KeyPair.fromRandom('ed25519').getPublicKey();
        const appAccountId = 'foobar';
        const appMethodNames = ['some_app_stuff', 'some_more_app_stuff'];
        await account.addKey(appPublicKey.toString(), appAccountId, appMethodNames, BigInt(parseNearAmount('0.25')));
        const keys = await account.getAccessKeys();
        expect(
            // @ts-expect-error test input
            keys.find(({ public_key }) => appPublicKey.toString() === public_key).access_key.permission.FunctionCall
                .method_names,
        ).toEqual(appMethodNames);
        expect(
            // @ts-expect-error test input
            keys.find(({ public_key }) => appPublicKey.toString() === public_key).access_key.permission.FunctionCall
                .receiver_id,
        ).toEqual(appAccountId);
    });

    test('send money', async () => {
        let sender = await createAccount(nearjs);
        let receiver = await createAccount(nearjs);
        sender = await getAccount2FA(sender);
        receiver = await getAccount2FA(receiver);
        const { amount: receiverAmount } = await receiver.state();
        await sender.sendMoney(receiver.accountId, BigInt(parseNearAmount('1')));
        const state = await receiver.state();
        expect(BigInt(state.amount)).toBeGreaterThanOrEqual(
            BigInt(receiverAmount) + BigInt(parseNearAmount('0.9').toString()),
        );
    });

    test('send money through signAndSendTransaction', async () => {
        let sender = await createAccount(nearjs);
        let receiver = await createAccount(nearjs);
        sender = await getAccount2FA(sender);
        receiver = await getAccount2FA(receiver);
        const { amount: receiverAmount } = await receiver.state();
        await sender.signAndSendTransaction({
            receiverId: receiver.accountId,
            actions: [transfer(BigInt(parseNearAmount('1')))],
        });
        const state = await receiver.state();
        expect(BigInt(state.amount)).toBeGreaterThanOrEqual(
            BigInt(receiverAmount) + BigInt(parseNearAmount('0.9').toString()),
        );
    });
});
