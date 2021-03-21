const url = require('url');
const localStorage = require('localstorage-memory');
const BN = require('bn.js');

// If an access key has itself as receiverId and method permission add_request_and_confirm, then it is being used in a wallet with multisig contract: https://github.com/near/core-contracts/blob/671c05f09abecabe7a7e58efe942550a35fc3292/multisig/src/lib.rs#L149-L153
const MULTISIG_HAS_METHOD = 'add_request_and_confirm';

let lastRedirectUrl;
let lastTransaction;
global.window = {
    localStorage
};
global.document = {
    title: 'documentTitle'
};
const nearApi = require('../lib/index');

let history;
let nearFake;
let walletConnection;
let keyStore = new nearApi.keyStores.InMemoryKeyStore();
beforeEach(() => {
    nearFake = {
        config: {
            networkId: 'networkId',
            contractName: 'contractId',
            walletUrl: 'http://example.com/wallet',
        },
        connection: {
            networkId: 'networkId',
            signer: new nearApi.InMemorySigner(keyStore)
        }
    };
    lastRedirectUrl = null;
    history = [];
    Object.assign(global.window, {
        location: {
            href: 'http://example.com/location',
            assign(url) {
                lastRedirectUrl = url;
            }
        },
        history: {
            replaceState: (state, title, url) => history.push([state, title, url])
        }
    });
    walletConnection = new nearApi.WalletConnection(nearFake);
});

it('not signed in by default', () => {
    expect(walletConnection.isSignedIn()).not.toBeTruthy();
});

it('can request sign in', async () => {
    await walletConnection.requestSignIn('signInContract', 'signInTitle', 'http://example.com/success',  'http://example.com/fail');

    let accounts = await keyStore.getAccounts('networkId');
    expect(accounts).toHaveLength(1);
    expect(accounts[0]).toMatch(/^pending_key.+/);
    expect(url.parse(lastRedirectUrl, true)).toMatchObject({
        protocol: 'http:',
        host: 'example.com',
        query: {
            contract_id: 'signInContract',
            success_url: 'http://example.com/success',
            failure_url: 'http://example.com/fail',
            public_key: (await keyStore.getKey('networkId', accounts[0])).publicKey.toString()
        }
    });
});

it('can complete sign in', async () => {
    const keyPair = nearApi.KeyPair.fromRandom('ed25519');
    global.window.location.href = `http://example.com/location?account_id=near.account&public_key=${keyPair.publicKey}`;
    await keyStore.setKey('networkId', 'pending_key' + keyPair.publicKey, keyPair);

    await walletConnection._completeSignInWithAccessKey();

    expect(await keyStore.getKey('networkId', 'near.account')).toEqual(keyPair);
    expect(localStorage.getItem('contractId_wallet_auth_key'));
    expect(history.slice(1)).toEqual([
        [{}, 'documentTitle', 'http://example.com/location']
    ]);
});

const BLOCK_HASH = '244ZQ9cgj3CQ6bWBdytfrJMuMQ1jdXLFGnr4HhvtCTnM';
const blockHash = nearApi.utils.serialize.base_decode(BLOCK_HASH);
function createTransferTx() {
    const actions = [
        nearApi.transactions.transfer(1),
    ];
    return nearApi.transactions.createTransaction(
        'test.near',
        nearApi.utils.PublicKey.fromString('Anu7LYDfpLtkP7E16LT9imXF694BdQaa9ufVkQiwTQxC'),
        'whatever.near',
        1,
        actions,
        blockHash);
}

it('can request transaction signing', async () => {
    await walletConnection.requestSignTransactions([createTransferTx()], 'http://example.com/callback');

    expect(url.parse(lastRedirectUrl, true)).toMatchObject({
        protocol: 'http:',
        host: 'example.com',
        query: {
            callbackUrl: 'http://example.com/callback',
            transactions: 'CQAAAHRlc3QubmVhcgCRez0mjUtY9/7BsVC9aNab4+5dTMOYVeNBU4Rlu3eGDQEAAAAAAAAADQAAAHdoYXRldmVyLm5lYXIPpHP9JpAd8pa+atxMxN800EDvokNSJLaYaRDmMML+9gEAAAADAQAAAAAAAAAAAAAAAAAAAA=='
        }
    });
});

function parseTransactionsFromUrl(urlToParse) {
    const parsedUrl = url.parse(urlToParse, true);
    expect(parsedUrl).toMatchObject({
        protocol: 'http:',
        host: 'example.com',
        query: {
            callbackUrl: 'http://example.com/location'
        }
    });
    const transactions = parsedUrl.query.transactions.split(',')
        .map(txBase64 => nearApi.utils.serialize.deserialize(
            nearApi.transactions.SCHEMA,
            nearApi.transactions.Transaction,
            Buffer.from(txBase64, 'base64')));
    return transactions;
}

function setupWalletConnectionForSigning({ allKeys, accountAccessKeys }) {
    walletConnection._authData = {
        allKeys: allKeys,
        accountId: 'signer.near'
    };
    nearFake.connection.provider = {
        query(path, data) {
            if (path === 'account/signer.near') {
                return { };
            }
            if (path === 'access_key/signer.near') {
                return { keys: accountAccessKeys };
            }
            if (path.startsWith('access_key/signer.near')) {
                const [,,publicKey] = path.split('/');
                for (let accessKey of accountAccessKeys) {
                    if (accessKey.public_key === publicKey) {
                        return accessKey;
                    }
                }
            }
            fail(`Unexpected query: ${path} ${data}`);
        },
        sendTransaction(signedTransaction) {
            lastTransaction = signedTransaction;
            return {
                transaction_outcome: { outcome: { logs: [] } },
                receipts_outcome: []
            };
        },
        block() {
            return {
                header: {
                    hash: BLOCK_HASH
                }
            };
        }
    };
}

it('requests transaction signing automatically when there is no local key', async () => {
    let keyPair = nearApi.KeyPair.fromRandom('ed25519');
    setupWalletConnectionForSigning({
        allKeys: [ 'no_such_access_key', keyPair.publicKey.toString() ],
        accountAccessKeys: [{
            access_key: {
                nonce: 1,
                permission: 'FullAccess'
            },
            public_key: keyPair.publicKey.toString()
        }]
    });

    try {
        await walletConnection.account().signAndSendTransaction('receiver.near', [nearApi.transactions.transfer(1)]);
        fail('expected to throw');
    } catch (e) {
        expect(e.message).toEqual('Failed to redirect to sign transaction');
    }

    const transactions = parseTransactionsFromUrl(lastRedirectUrl);
    expect(transactions).toHaveLength(1);
    expect(transactions[0]).toMatchObject({
        signerId: 'signer.near',
        // nonce: new BN(2)
        receiverId: 'receiver.near',
        actions: [{
            transfer: {
                // deposit: new BN(1)
            }
        }]
    });
    expect(transactions[0].nonce.toString()).toEqual('2');
    expect(transactions[0].actions[0].transfer.deposit.toString()).toEqual('1');
    expect(Buffer.from(transactions[0].publicKey.data)).toEqual(Buffer.from(keyPair.publicKey.data));
});

it('requests transaction signing automatically when function call has attached deposit', async () => {
    let localKeyPair = nearApi.KeyPair.fromRandom('ed25519');
    let walletKeyPair = nearApi.KeyPair.fromRandom('ed25519');
    setupWalletConnectionForSigning({
        allKeys: [ walletKeyPair.publicKey.toString() ],
        accountAccessKeys: [{
            access_key: {
                nonce: 1,
                permission: {
                    FunctionCall: {
                        allowance: '1000000000',
                        receiver_id: 'receiver.near',
                        method_names: []
                    }
                }
            },
            public_key: localKeyPair.publicKey.toString()
        }, {
            access_key: {
                nonce: 1,
                permission: 'FullAccess'
            },
            public_key: walletKeyPair.publicKey.toString()
        }]
    });
    await keyStore.setKey('networkId', 'signer.near', localKeyPair);

    try {
        await walletConnection.account().signAndSendTransaction('receiver.near', [
            nearApi.transactions.functionCall('someMethod', new Uint8Array(), new BN('1'), new BN('1'))
        ]);
        fail('expected to throw');
    } catch (e) {
        expect(e.message).toEqual('Failed to redirect to sign transaction');
    }

    const transactions = parseTransactionsFromUrl(lastRedirectUrl);
    expect(transactions).toHaveLength(1);
});

it('requests transaction signing with 2fa access key', async () => {
    let localKeyPair = nearApi.KeyPair.fromRandom('ed25519');
    let walletKeyPair = nearApi.KeyPair.fromRandom('ed25519');
    setupWalletConnectionForSigning({
        allKeys: [ walletKeyPair.publicKey.toString() ],
        accountAccessKeys: [{
            access_key: {
                nonce: 1,
                permission: {
                    FunctionCall: {
                        allowance: '1000000000',
                        receiver_id: 'signer.near',
                        method_names: [MULTISIG_HAS_METHOD]
                    }
                }
            },
            public_key: localKeyPair.publicKey.toString()
        }]
    });
    await keyStore.setKey('networkId', 'signer.near', localKeyPair);

    let res;
    try {
        res = await walletConnection.account().signAndSendTransaction('receiver.near', [
            nearApi.transactions.functionCall('someMethod', new Uint8Array(), new BN('1'), new BN('1'))
        ]);
    } catch (e) {
        fail('expected transaction outcome');
    }
    // multisig access key is accepted res is object representing transaction, populated upon wallet redirect to app
    expect(res).toHaveProperty('transaction_outcome');
    expect(res).toHaveProperty('receipts_outcome');
});

it('fails requests transaction signing without 2fa access key', async () => {
    let localKeyPair = nearApi.KeyPair.fromRandom('ed25519');
    let walletKeyPair = nearApi.KeyPair.fromRandom('ed25519');
    setupWalletConnectionForSigning({
        allKeys: [ walletKeyPair.publicKey.toString() ],
        accountAccessKeys: [{
            access_key: {
                nonce: 1,
                permission: {
                    FunctionCall: {
                        allowance: '1000000000',
                        receiver_id: 'signer.near',
                        method_names: ['not_a_valid_2fa_method']
                    }
                }
            },
            public_key: localKeyPair.publicKey.toString()
        }]
    });
    await keyStore.setKey('networkId', 'signer.near', localKeyPair);

    try {
        await walletConnection.account().signAndSendTransaction('receiver.near', [
            nearApi.transactions.functionCall('someMethod', new Uint8Array(), new BN('1'), new BN('1'))
        ]);
        fail('expected to throw');
    } catch (e) {
        expect(e.message).toEqual('Cannot find matching key for transaction sent to receiver.near');
    }
});

it.each([
    nearApi.transactions.functionCall('someMethod', new Uint8Array(), new BN('1'), new BN('0')),
    nearApi.transactions.functionCall('someMethod', new Uint8Array(), new BN('1')),
    nearApi.transactions.functionCall('someMethod', new Uint8Array())
])('can sign transaction locally when function call has no attached deposit', async (functionCall) => {
    let localKeyPair = nearApi.KeyPair.fromRandom('ed25519');
    setupWalletConnectionForSigning({
        allKeys: [ /* no keys in wallet needed */ ],
        accountAccessKeys: [{
            access_key: {
                nonce: 1,
                permission: {
                    FunctionCall: {
                        allowance: '1000000000',
                        receiver_id: 'receiver.near',
                        method_names: []
                    }
                }
            },
            public_key: localKeyPair.publicKey.toString()
        }]
    });
    keyStore.setKey('networkId', 'signer.near', localKeyPair);

    await walletConnection.account().signAndSendTransaction('receiver.near', [ functionCall ]);
    // NOTE: Transaction gets signed without wallet in this test
    expect(lastTransaction).toMatchObject({
        transaction: {
            receiverId: 'receiver.near',
            signerId: 'signer.near',
            actions: [{
                functionCall: {
                    methodName: 'someMethod',
                }
            }]
        }
    });
});
