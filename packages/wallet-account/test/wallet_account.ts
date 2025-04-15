import { beforeEach, describe, expect, it } from '@jest/globals';
import { KeyPair } from '@near-js/crypto';
import { InMemoryKeyStore } from '@near-js/keystores';
import { KeyPairSigner } from '@near-js/signers';
import { actionCreators } from '@near-js/transactions';
import localStorage from 'localstorage-memory';
import { WalletConnection } from '../src';


const { functionCall } = actionCreators;
// If an access key has itself as receiverId and method permission add_request_and_confirm, then it is being used in a wallet with multisig contract: https://github.com/near/core-contracts/blob/671c05f09abecabe7a7e58efe942550a35fc3292/multisig/src/lib.rs#L149-L153
const MULTISIG_HAS_METHOD = 'add_request_and_confirm';

let lastTransaction;

// @ts-ignore
global.window = {
    localStorage
};
// @ts-ignore
global.document = {
    title: 'documentTitle'
};

let history;
let nearFake;
let walletConnection;
let keyStore = new InMemoryKeyStore();
export const createTransactions = () => {
    beforeEach(() => {
        keyStore.clear();
        nearFake = {
            config: {
                networkId: 'networkId',
                contractName: 'contractId',
                walletUrl: 'http://example.com/wallet',
                keyStore: keyStore
            },
            connection: {
                networkId: 'networkId',
                signer: new KeyPairSigner(KeyPair.fromRandom('ed25519'))
            },
            account() {
                return {
                    state() {}
                };
            }
        };
        history = [];
        Object.assign(global.window, {
            location: {
                href: 'http://example.com/location',
            },
            history: {
                replaceState: (state, title, url) => history.push([state, title, url])
            }
        });
        walletConnection = new WalletConnection(nearFake, '');
    });

    it('not signed in by default', () => {
        expect(walletConnection.isSignedIn()).not.toBeTruthy();
    });

    it('throws if non string appKeyPrefix', () => {
        // @ts-ignore
        expect(() => new WalletConnection(nearFake)).toThrow(/appKeyPrefix/);
// @ts-ignore
        expect(() => new WalletConnection(nearFake, 1)).toThrow(/appKeyPrefix/);
        expect(() => new WalletConnection(nearFake, null)).toThrow(/appKeyPrefix/);
        expect(() => new WalletConnection(nearFake, undefined)).toThrow(/appKeyPrefix/);
    });

    const BLOCK_HASH = '244ZQ9cgj3CQ6bWBdytfrJMuMQ1jdXLFGnr4HhvtCTnM';

    function setupWalletConnectionForSigning({ allKeys, accountAccessKeys, signer }) {
        walletConnection._authData = {
            allKeys: allKeys,
            accountId: 'signer.near'
        };
        nearFake.connection.provider = {
            query(params) {
                if (params.request_type === 'view_account' && params.account_id === 'signer.near') {
                    return { };
                }
                if (params.request_type === 'view_access_key_list' && params.account_id === 'signer.near') {
                    return { keys: accountAccessKeys };
                }
                if (params.request_type === 'view_access_key' && params.account_id === 'signer.near') {
                    for (let accessKey of accountAccessKeys) {
                        if (accessKey.public_key === params.public_key) {
                            return accessKey.access_key;
                        }
                    }
                }
                throw new Error(`Unexpected query: ${JSON.stringify(params)}`);
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
            },
            viewAccessKey(accountId, pk) {
                return this.query({
                    request_type: "view_access_key",
                    account_id: accountId,
                    public_key: pk.toString(),
                });
            },
        };

        nearFake.connection.signer = signer;
    }

    describe('requests transaction signing with 2fa access key', () => {
        beforeEach(async () => {
            let localKeyPair = KeyPair.fromRandom('ed25519');
            let walletKeyPair = KeyPair.fromRandom('ed25519');
            setupWalletConnectionForSigning({
                // @ts-ignore
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
                    // @ts-ignore
                    public_key: localKeyPair.publicKey.toString()
                }],
                signer: new KeyPairSigner(localKeyPair)
            });
            await keyStore.setKey('networkId', 'signer.near', localKeyPair);
        });

        it('V2', async () => {
            const res = await walletConnection.account().signAndSendTransaction({
                receiverId: 'receiver.near',
                actions: [functionCall('someMethod', new Uint8Array(), 1n, 1n)]
            });

            // multisig access key is accepted res is object representing transaction, populated upon wallet redirect to app
            expect(res).toHaveProperty('transaction_outcome');
            expect(res).toHaveProperty('receipts_outcome');
        });
    });

    describe('fails requests transaction signing without 2fa access key', () => {
        beforeEach(async () => {
            const localKeyPair = KeyPair.fromRandom('ed25519');
            const walletKeyPair = KeyPair.fromRandom('ed25519');
            setupWalletConnectionForSigning({
                // @ts-ignore
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
                    // @ts-ignore
                    public_key: localKeyPair.publicKey.toString()
                }],
                signer: new KeyPairSigner(localKeyPair)
            });
            await keyStore.setKey('networkId', 'signer.near', localKeyPair);
        });

        it('V2', () => {
            return expect(
                walletConnection.account().signAndSendTransaction({
                    receiverId: 'receiver.near',
                    actions: [functionCall('someMethod', new Uint8Array(), 1n, 1n)]
                })
            ).rejects.toThrow('Cannot find matching key for transaction sent to receiver.near');
        });
    });

    describe('can sign transaction locally when function call has no attached deposit', () => {
        beforeEach(async () => {
            const localKeyPair = KeyPair.fromRandom('ed25519');
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
                    // @ts-ignore
                    public_key: localKeyPair.publicKey.toString()
                }],
                signer: new KeyPairSigner(localKeyPair)
            });
            await keyStore.setKey('networkId', 'signer.near', localKeyPair);
        });

        it.each([
            functionCall('someMethod', new Uint8Array(), 1n, 0n),
            functionCall('someMethod', new Uint8Array(), 1n),
            functionCall('someMethod', new Uint8Array())
        ])('V2', async (functionCall) => {
            await walletConnection.account().signAndSendTransaction({
                receiverId: 'receiver.near',
                actions: [ functionCall ]
            });
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
    });
}