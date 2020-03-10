const url = require('url');
const localStorage = require('localstorage-memory');

let newUrl;
global.window = {
    localStorage
};
global.document = {
    title: 'documentTitle'
};
const nearlib = require('../lib/index');

let history;
let nearFake;
let walletConnection;
let keyStore = new nearlib.keyStores.InMemoryKeyStore();
beforeEach(() => {
    nearFake = {
        config: {
            networkId: 'networkId',
            contractName: 'contractId',
            walletUrl: 'http://example.com/wallet',
        },
        connection: {
            signer: new nearlib.InMemorySigner(keyStore)
        }
    };
    newUrl = null;
    history = [];
    Object.assign(global.window, {
        location: {
            href: 'http://example.com/location',
            assign(url) {
                newUrl = url;
            }
        },
        history: {
            replaceState: (state, title, url) => history.push([state, title, url])
        }
    });
    walletConnection = new nearlib.WalletConnection(nearFake);
});

it('not signed in by default', () => {
    expect(walletConnection.isSignedIn()).not.toBeTruthy();
});

it('can request sign in', async () => {
    await walletConnection.requestSignIn('signInContract', 'signInTitle', 'http://example.com/success',  'http://example.com/fail', '0x0');

    let accounts = await keyStore.getAccounts('networkId');
    expect(accounts).toHaveLength(1);
    expect(accounts[0]).toMatch(/^pending_key.+/);
    expect(url.parse(newUrl, true)).toMatchObject({
        protocol: 'http:',
        host: 'example.com',
        query: {
            title: 'signInTitle',
            contract_id: 'signInContract',
            success_url: 'http://example.com/success',
            failure_url: 'http://example.com/fail',
            funding_key: '0x0',
            public_key: (await keyStore.getKey('networkId', accounts[0])).publicKey.toString()
        }
    });
});

it('can complete sign in', async () => {
    const keyPair = nearlib.KeyPair.fromRandom('ed25519');
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
const blockHash = nearlib.utils.serialize.base_decode(BLOCK_HASH);
function createTransferTx() {
    const actions = [
        nearlib.transactions.transfer(1),
    ];
    return nearlib.transactions.createTransaction(
        'test.near',
        nearlib.utils.PublicKey.fromString('Anu7LYDfpLtkP7E16LT9imXF694BdQaa9ufVkQiwTQxC'),
        'whatever.near',
        1,
        actions,
        blockHash);
}

it('can request transaction signing', async () => {
    await walletConnection.requestSignTransactions([createTransferTx()], 'http://example.com/callback');

    expect(url.parse(newUrl, true)).toMatchObject({
        protocol: 'http:',
        host: 'example.com',
        query: {
            callbackUrl: 'http://example.com/callback',
            transactions: 'CQAAAHRlc3QubmVhcgCRez0mjUtY9/7BsVC9aNab4+5dTMOYVeNBU4Rlu3eGDQEAAAAAAAAADQAAAHdoYXRldmVyLm5lYXIPpHP9JpAd8pa+atxMxN800EDvokNSJLaYaRDmMML+9gEAAAADAQAAAAAAAAAAAAAAAAAAAA=='
        }
    });
});

it('requests transaction signing automatically when there is no local key', async () => {
    // TODO: Refactor copy-pasted common setup code
    let keyPair = nearlib.KeyPair.fromRandom('ed25519');
    walletConnection._authData = {
        allKeys: [ 'no_such_access_key', keyPair.publicKey.toString() ],
        accountId: 'signer.near'
    };
    nearFake.connection.provider = {
        query(path, data) {
            if (path === 'account/signer.near') {
                return { };
            }
            if (path === 'access_key/signer.near') {
                return { keys: [{
                    access_key: {
                        nonce: 1,
                        permission: 'FullAccess'
                    },
                    public_key: keyPair.publicKey.toString()
                }] };
            }
            fail(`Unexpected query: ${path} ${data}`);
        },
        status() {
            return {
                sync_info: {
                    latest_block_hash: BLOCK_HASH
                }
            };
        }
    };

    try {
        await walletConnection.account().signAndSendTransaction('receiver.near', [nearlib.transactions.transfer(1)]);
        fail('expected to throw');
    } catch (e) {
        expect(e.message).toEqual('Failed to redirect to sign transaction');
    }

    const parsedUrl = url.parse(newUrl, true);
    expect(parsedUrl).toMatchObject({
        protocol: 'http:',
        host: 'example.com',
        query: {
            callbackUrl: 'http://example.com/location'
        }
    });
    const transactions = parsedUrl.query.transactions.split(',')
        .map(txBase64 => nearlib.utils.serialize.deserialize(
            nearlib.transactions.SCHEMA,
            nearlib.transactions.Transaction,
            Buffer.from(txBase64, 'base64')));

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
