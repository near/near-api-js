const url = require('url');

const nearlib = require('../lib/index');

let windowSpy;
let documentSpy;
let nearFake;
let walletAccount;
let keyStore = new nearlib.keyStores.InMemoryKeyStore();
beforeEach(() => {
    windowSpy = jest.spyOn(global, 'window', 'get');
    documentSpy = jest.spyOn(global, 'document', 'get');
    nearFake = {
        config: {
            networkId: 'networkId',
            contractName: 'contractId',
            walletUrl: 'http://example.com/wallet',
        },
        connection: {
            signer: {
                keyStore
            }
        }
    };
    walletAccount = new nearlib.WalletAccount(nearFake);
});

afterEach(() => {
    windowSpy.mockRestore();
});

it('not signed in by default', () => {
    expect(walletAccount.isSignedIn()).not.toBeTruthy();
});

it('can request sign in', async () => {
    let newUrl;
    windowSpy.mockImplementation(() => ({
        location: {
            href: 'http://example.com/location',
            assign(url) {
                newUrl = url;
            }
        }
    }));

    await walletAccount.requestSignIn('signInContract', 'signInTitle', 'http://example.com/success',  'http://example.com/fail');

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
            public_key: (await keyStore.getKey('networkId', accounts[0])).publicKey.toString()
        }
    });
});

it('can complete sign in', async () => {
    const localStorage = require('localstorage-memory');
    const keyPair = nearlib.KeyPair.fromRandom('ed25519'); 
    const history = [];
    windowSpy.mockImplementation(() => ({
        location: {
            href: `http://example.com/location?account_id=near.account&public_key=${keyPair.publicKey}`
        },
        history: {
            replaceState: (state, title, url) => history.push([state, title, url])
        },
        localStorage
    }));
    documentSpy.mockImplementation(() => ({
        title: 'documentTitle'
    }));
    await keyStore.setKey('networkId', 'pending_key' + keyPair.publicKey, keyPair);

    await walletAccount._completeSignInWithAccessKey();

    expect(await keyStore.getKey('networkId', 'near.account')).toEqual(keyPair);
    expect(localStorage.getItem('contractId_wallet_auth_key'));
    expect(history).toEqual([
        [{}, 'documentTitle', 'http://example.com/location']
    ]);
});

function createTransferTx() {
    const actions = [
        nearlib.transactions.transfer(1),
    ];
    const blockHash = nearlib.utils.serialize.base_decode('244ZQ9cgj3CQ6bWBdytfrJMuMQ1jdXLFGnr4HhvtCTnM');
    return nearlib.transactions.createTransaction(
        'test.near',
        nearlib.utils.PublicKey.fromString('Anu7LYDfpLtkP7E16LT9imXF694BdQaa9ufVkQiwTQxC'),
        'whatever.near',
        1,
        actions,
        blockHash);
}

it('can request transaction signing', async () => {
    let newUrl;
    windowSpy.mockImplementation(() => ({
        location: {
            href: 'http://example.com/location',
            assign(url) {
                newUrl = url;
            }
        }
    }));

    await walletAccount.requestSignTransactions([createTransferTx()], 'http://example.com/callback');

    expect(url.parse(newUrl, true)).toMatchObject({
        protocol: 'http:',
        host: 'example.com',
        query: {
            callbackUrl: 'http://example.com/callback',
            transactions: 'CQAAAHRlc3QubmVhcgCRez0mjUtY9/7BsVC9aNab4+5dTMOYVeNBU4Rlu3eGDQEAAAAAAAAADQAAAHdoYXRldmVyLm5lYXIPpHP9JpAd8pa+atxMxN800EDvokNSJLaYaRDmMML+9gEAAAADAQAAAAAAAAAAAAAAAAAAAA=='
        }
    });
});
