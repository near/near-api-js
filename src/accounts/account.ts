import { type KeyPairString, PublicKey } from '../crypto/index.js';
import type { Provider } from '../providers/index.js';
import { KeyPairSigner, type SignedMessage, type Signer } from '../signers/index.js';
import type { SignDelegateActionReturn } from '../signers/signer.js';
import type { FungibleToken, NativeToken } from '../tokens/index.js';
import { NEAR } from '../tokens/index.js';
import {
    type Action,
    actionCreators,
    buildDelegateAction,
    createTransaction,
    type DelegateAction,
    GlobalContractDeployMode,
    GlobalContractIdentifier,
    type SignedTransaction,
} from '../transactions/index.js';
import type {
    AccessKeyList,
    AccessKeyView,
    ContractCodeView,
    ContractStateView,
    FinalExecutionOutcome,
    Finality,
    SerializedReturnValue,
    TxExecutionStatus,
} from '../types/index.js';
import { baseDecode, getTransactionLastResult, parseResultError } from '../utils/index.js';

const {
    addKey,
    createAccount,
    deleteAccount,
    deleteKey,
    deployContract,
    deployGlobalContract,
    fullAccessKey,
    functionCall,
    functionCallAccessKey,
    transfer,
    useGlobalContract,
} = actionCreators;

const DEFAULT_FINALITY: Finality = 'optimistic';
export const DEFAULT_WAIT_STATUS: TxExecutionStatus = 'EXECUTED_OPTIMISTIC';
const DEFAULT_FUNCTION_CALL_GAS = 30_000_000_000_000n; // 30 TGas

export interface AccountState {
    balance: {
        total: bigint;
        usedOnStorage: bigint;
        locked: bigint;
        available: bigint;
    };
    storageUsage: number;
    codeHash: string;
}

export interface CreateTransactionArgs {
    receiverId: string;
    actions: Action[];
    publicKey: string | PublicKey;
}

export interface CreateSignedTransactionArgs {
    receiverId: string;
    actions: Action[];
    signer?: Signer;
}

export interface CreateMetaTransactionArgs {
    receiverId: string;
    actions: Action[];
    blockHeightTtl?: number;
    publicKey: PublicKey | string;
}

export interface CreateSignedMetaTransactionArgs {
    receiverId: string;
    actions: Action[];
    blockHeightTtl?: number;
    signer?: Signer;
}

export interface SignAndSendTransactionArgs {
    receiverId: string;
    actions: Action[];
    waitUntil?: TxExecutionStatus;
    throwOnFailure?: boolean;
    signer?: Signer;
}

export interface SignAndSendTransactionsArgs {
    transactions: Array<{
        receiverId: string;
        actions: Action[];
    }>;
    waitUntil?: TxExecutionStatus;
    throwOnFailure?: boolean;
    signer?: Signer;
}

export interface CreateAccountArgs {
    newAccountId: string;
    publicKey: PublicKey | string;
    nearToTransfer?: bigint | string | number;
}

export interface CreateSubAccountArgs {
    accountOrPrefix: string;
    publicKey: PublicKey | string;
    nearToTransfer?: bigint | string | number;
}

export interface AddFunctionAccessKeyArgs {
    publicKey: PublicKey | string;
    contractId: string;
    methodNames?: string[];
    allowance?: bigint | string | number;
}

export interface CallFunctionArgs {
    contractId: string;
    methodName: string;
    args?: Uint8Array | Record<string, any>;
    deposit?: bigint | string | number;
    gas?: bigint | string | number;
    waitUntil?: TxExecutionStatus;
}

export interface SignNep413MessageArgs {
    message: string;
    recipient: string;
    nonce: Uint8Array;
    callbackUrl?: string;
}

export interface TransferArgs {
    receiverId: string;
    amount: bigint | string | number;
    token?: NativeToken | FungibleToken;
}

/**
 * This class allows to access common account information.
 * If a {@link Signer} is provider, then the account can
 * be used to perform all common actions such as
 * transferring tokens and calling functions
 */
export class Account {
    public readonly accountId: string;
    public readonly provider: Provider;
    private signer?: Signer;

    constructor(accountId: string, provider: Provider, signer?: Signer | KeyPairString) {
        this.accountId = accountId;
        this.provider = provider;
        if (typeof signer === 'string') {
            this.signer = KeyPairSigner.fromSecretKey(signer);
        } else {
            this.signer = signer;
        }
    }

    /**
     * Allows to set the signer used to control the account
     *
     * @param signer holds the private key and can sign Transactions
     */
    public setSigner(signer: Signer): void {
        this.signer = signer;
    }

    public getSigner(): Signer | undefined {
        return this.signer;
    }

    /**
     * Returns an overview of the account's state, including the account's
     * balance, storage usage, and code hash
     */
    public async getState(): Promise<AccountState> {
        const protocolConfig = await this.provider.experimental_protocolConfig({
            finality: DEFAULT_FINALITY,
        });
        const state = await this.provider.viewAccount({
            accountId: this.accountId,
            blockQuery: {
                finality: DEFAULT_FINALITY,
            },
        });

        const costPerByte = BigInt(protocolConfig.runtime_config.storage_amount_per_byte);
        const usedOnStorage = BigInt(state.storage_usage) * costPerByte;
        const locked = BigInt(state.locked);
        const total = BigInt(state.amount) + locked;
        const available = total - (locked > usedOnStorage ? locked : usedOnStorage);

        return {
            balance: {
                total,
                usedOnStorage,
                locked,
                available,
            },
            storageUsage: state.storage_usage,
            codeHash: state.code_hash,
        };
    }

    /**
     * Calls {@link Provider.viewAccessKey} to retrieve information for a
     * specific key in the account
     */
    public async getAccessKey(publicKey: PublicKey | string): Promise<AccessKeyView> {
        return this.provider.viewAccessKey({
            accountId: this.accountId,
            publicKey,
            finalityQuery: {
                finality: DEFAULT_FINALITY,
            },
        });
    }

    /**
     * Calls {@link Provider.viewAccessKeyList} to retrieve the account's keys
     */
    public async getAccessKeyList(): Promise<AccessKeyList> {
        return this.provider.viewAccessKeyList({
            accountId: this.accountId,
            finalityQuery: {
                finality: DEFAULT_FINALITY,
            },
        });
    }

    /**
     * Calls {@link Provider.viewContractCode} to retrieve the account's
     * contract code and its hash
     */
    public async getContractCode(): Promise<ContractCodeView> {
        return this.provider.viewContractCode({
            contractId: this.accountId,
            blockQuery: {
                finality: DEFAULT_FINALITY,
            },
        });
    }

    /**
     * Calls {@link Provider.viewContractState} to retrieve the keys and values
     * stored on the account's contract
     */
    public async getContractState(prefix?: string): Promise<ContractStateView> {
        return this.provider.viewContractState({
            contractId: this.accountId,
            prefix,
            blockQuery: {
                finality: DEFAULT_FINALITY,
            },
        });
    }

    /**
     * Create a transaction that can be later signed with a {@link Signer}
     *
     * @param receiverId Account against which to perform the actions
     * @param actions Actions to perform
     * @param publicKey The public part of the key that will be used to sign the transaction
     */
    public async createTransaction({ receiverId, actions, publicKey }: CreateTransactionArgs) {
        if (!publicKey) throw new Error('Please provide a public key');

        const pk = PublicKey.from(publicKey);

        const accessKey = await this.getAccessKey(pk);

        const block = await this.provider.viewBlock({
            finality: DEFAULT_FINALITY,
        });
        const recentBlockHash = block.header.hash;

        const nonce = BigInt(accessKey.nonce) + 1n;

        return createTransaction(this.accountId, pk, receiverId, nonce + 1n, actions, baseDecode(recentBlockHash));
    }

    /**
     * Create a signed transaction ready to be broadcast by a {@link Provider}
     */
    public async createSignedTransaction({
        receiverId,
        actions,
        signer = this.signer,
    }: CreateSignedTransactionArgs): Promise<SignedTransaction> {
        if (!signer) throw new Error('Please set a signer');

        const tx = await this.createTransaction({
            receiverId,
            actions,
            publicKey: await signer.getPublicKey(),
        });

        const { signedTransaction } = await signer.signTransaction(tx);

        return signedTransaction;
    }

    /**
     * Create a meta transaction ready to be signed by a {@link Signer}
     *
     * @param receiverId NEAR account receiving the transaction
     * @param actions list of actions to perform as part of the meta transaction
     * @param blockHeightTtl number of blocks after which a meta transaction will expire if not processed
     */
    public async createMetaTransaction({
        receiverId,
        actions,
        blockHeightTtl = 200,
        publicKey,
    }: CreateMetaTransactionArgs): Promise<DelegateAction> {
        if (!publicKey) throw new Error('Please provide a public key');

        const pk = PublicKey.from(publicKey);

        const accessKey = await this.getAccessKey(pk);
        const nonce = BigInt(accessKey.nonce) + 1n;

        const { header } = await this.provider.viewBlock({
            finality: DEFAULT_FINALITY,
        });

        const maxBlockHeight = BigInt(header.height) + BigInt(blockHeightTtl);

        return buildDelegateAction({
            receiverId,
            senderId: this.accountId,
            actions,
            publicKey: pk,
            nonce,
            maxBlockHeight,
        });
    }

    /**
     * Create a signed MetaTransaction that can be broadcasted to a relayer
     *
     * @param receiverId NEAR account receiving the transaction
     * @param actions list of actions to perform as part of the meta transaction
     * @param blockHeightTtl number of blocks after which a meta transaction will expire if not processed
     */
    public async createSignedMetaTransaction({
        receiverId,
        actions,
        blockHeightTtl = 200,
        signer = this.signer,
    }: CreateSignedMetaTransactionArgs): Promise<SignDelegateActionReturn> {
        if (!signer) throw new Error('Please set a signer');

        const delegateAction = await this.createMetaTransaction({
            receiverId,
            actions,
            blockHeightTtl,
            publicKey: await signer.getPublicKey(),
        });

        return signer.signDelegateAction(delegateAction);
    }

    /**
     * Creates a transaction, signs it and broadcast it to the network
     *
     * @param receiverId The NEAR account ID of the transaction receiver.
     * @param actions The list of actions to be performed in the transaction.
     * @param throwOnFailure Whether to throw an error if the transaction fails.
     * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the transaction.
     *
     */
    async signAndSendTransaction({
        receiverId,
        actions,
        waitUntil = DEFAULT_WAIT_STATUS,
        throwOnFailure = true,
        signer = this.signer,
    }: SignAndSendTransactionArgs): Promise<FinalExecutionOutcome> {
        const signedTx = await this.createSignedTransaction({
            receiverId,
            actions,
            signer,
        });

        const result = await this.provider.sendTransactionUntil(signedTx, waitUntil);

        if (
            throwOnFailure &&
            typeof result.status === 'object' &&
            typeof result.status.Failure === 'object' &&
            result.status.Failure !== null
        ) {
            throw parseResultError(result);
        }

        return result;
    }

    async signAndSendTransactions({
        transactions,
        waitUntil = DEFAULT_WAIT_STATUS,
        throwOnFailure = true,
        signer = this.signer,
    }: SignAndSendTransactionsArgs): Promise<FinalExecutionOutcome[]> {
        if (!this.signer) throw new Error('Please set a signer');

        const results = await Promise.all(
            transactions.map(async ({ receiverId, actions }) => {
                return this.signAndSendTransaction({
                    receiverId,
                    actions,
                    waitUntil,
                    throwOnFailure,
                    signer,
                });
            })
        );

        return results;
    }

    /**
     * Creates a new NEAR account with a given ID and public key.
     *
     * This method can create two types of accounts:
     *
     * 1. Top-level accounts of the form `name.tla` (e.g., `bob.near`):
     *
     * 2. Sub-accounts of the current account (e.g., `sub.ana.near`):
     *    - The new account ID must end with the current account ID
     *    - Example: If your account is `ana.near`, you can create `sub.ana.near`
     *
     * @param newAccountId the new account to create (e.g. bob.near or sub.ana.near)
     * @param publicKey the public part of the key that will control the account
     * @param nearToTransfer how much NEAR to transfer to the account in yoctoNEAR (default: 0)
     *
     */
    public async createAccount({
        newAccountId,
        publicKey,
        nearToTransfer = 0n,
    }: CreateAccountArgs): Promise<FinalExecutionOutcome> {
        if (newAccountId.endsWith(this.accountId)) {
            return this.createSubAccount({ accountOrPrefix: newAccountId, publicKey, nearToTransfer });
        }

        const splitted = newAccountId.split('.');
        if (splitted.length != 2) {
            throw new Error('newAccountId needs to be of the form <string>.<tla>');
        }

        const TLA = splitted[1]!;
        return this.signAndSendTransaction({
            receiverId: TLA,
            actions: [
                functionCall(
                    'create_account',
                    {
                        new_account_id: newAccountId,
                        new_public_key: publicKey.toString(),
                    },
                    BigInt('60000000000000'),
                    BigInt(nearToTransfer)
                ),
            ],
        });
    }

    /**
     * Creates a sub account of this account. For example, if the account is
     * ana.near, you can create sub.ana.near.
     *
     * @param accountOrPrefix a prefix (e.g. `sub`) or the full sub-account (`sub.ana.near`)
     * @param publicKey the public part of the key that will control the account
     * @param nearToTransfer how much NEAR to transfer to the account (default: 0)
     *
     */
    public async createSubAccount({
        accountOrPrefix,
        publicKey,
        nearToTransfer = 0n,
    }: CreateSubAccountArgs): Promise<FinalExecutionOutcome> {
        if (!this.signer) throw new Error('Please set a signer');

        const newAccountId = accountOrPrefix.includes('.') ? accountOrPrefix : `${accountOrPrefix}.${this.accountId}`;

        if (newAccountId.length > 64) {
            throw new Error('Accounts cannot exceed 64 characters');
        }

        if (!newAccountId.endsWith(this.accountId)) {
            throw new Error(`New account must end up with ${this.accountId}`);
        }

        const actions = [
            createAccount(),
            transfer(BigInt(nearToTransfer)),
            addKey(PublicKey.from(publicKey), fullAccessKey()),
        ];

        return this.signAndSendTransaction({
            receiverId: newAccountId,
            actions,
        });
    }

    /**
     * Deletes the account, transferring all remaining NEAR to a beneficiary
     * account
     *
     * Important: Deleting an account does not transfer FTs or NFTs
     *
     * @param beneficiaryId Will receive the account's remaining balance
     */
    public async deleteAccount(beneficiaryId: string): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [deleteAccount(beneficiaryId)],
        });
    }

    /**
     * Deploy a smart contract in the account
     *
     * @param code The compiled contract code bytes
     */
    public async deployContract(code: Uint8Array): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [deployContract(code)],
        });
    }

    /**
     * Deploy a global contract that can be reused by multiple accounts
     *
     * @param code The compiled contract code bytes
     * @param deployMode Deploy mode - "codeHash" for immutable contracts, "accountId" for updateable contracts
     */
    public async deployGlobalContract(
        code: Uint8Array,
        deployMode: 'codeHash' | 'accountId'
    ): Promise<FinalExecutionOutcome> {
        const mode =
            deployMode === 'codeHash'
                ? new GlobalContractDeployMode({ CodeHash: null })
                : new GlobalContractDeployMode({ AccountId: null });

        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [deployGlobalContract(code, mode)],
        });
    }

    /**
     * Use a previously deployed global contract on this account
     *
     * @param contractIdentifier The global contract identifier - either { accountId: string } or { codeHash: string | Uint8Array }
     */
    public async useGlobalContract(
        contractIdentifier: { accountId: string } | { codeHash: string | Uint8Array }
    ): Promise<FinalExecutionOutcome> {
        const identifier =
            'accountId' in contractIdentifier
                ? new GlobalContractIdentifier({
                      AccountId: contractIdentifier.accountId,
                  })
                : new GlobalContractIdentifier({
                      CodeHash:
                          typeof contractIdentifier.codeHash === 'string'
                              ? Buffer.from(contractIdentifier.codeHash, 'hex')
                              : contractIdentifier.codeHash,
                  });

        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [useGlobalContract(identifier)],
        });
    }

    /**
     *
     * @param options
     * @param options.publicKey The key to add to the account
     * @param options.contractId The contract that this key can call
     * @param options.methodNames The methods this key is allowed to call
     * @param options.allowance The amount of NEAR this key can expend in gas
     * @returns
     */
    public async addFunctionCallAccessKey({
        publicKey,
        contractId,
        methodNames = [],
        allowance = NEAR.toUnits('0.25'),
    }: AddFunctionAccessKeyArgs): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [
                addKey(PublicKey.from(publicKey), functionCallAccessKey(contractId, methodNames, BigInt(allowance))),
            ],
        });
    }

    /**
     * Add a full access key to the account
     *
     * @param publicKey The public key to be added
     * @returns {Promise<FinalExecutionOutcome>}
     */
    public async addFullAccessKey(publicKey: PublicKey | string): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [addKey(PublicKey.from(publicKey), fullAccessKey())],
        });
    }

    /**
     * @param publicKey The public key to be deleted
     * @returns {Promise<FinalExecutionOutcome>}
     */
    public async deleteKey(publicKey: PublicKey | string): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [deleteKey(PublicKey.from(publicKey))],
        });
    }

    /**
     * Call a function on a smart contract and return parsed transaction result
     *
     * @param options
     * @param options.contractId The contract in which to call the function
     * @param options.methodName The method that will be called
     * @param options.args Arguments, either as a valid JSON Object or a raw Uint8Array
     * @param options.deposit (optional) Amount of NEAR Tokens to attach to the call (default 0)
     * @param options.gas (optional) Amount of GAS to use attach to the call (default 30TGas)
     * @param options.waitUntil (optional) Transaction finality to wait for (default INCLUDED_FINAL)
     * @returns
     */
    public async callFunction<T extends SerializedReturnValue>(params: CallFunctionArgs): Promise<T> {
        const outcome = await this.callFunctionRaw(params);
        return getTransactionLastResult(outcome) as T;
    }

    /**
     * Call a function on a smart contract and return raw transaction outcome
     *
     * @param options
     * @param options.contractId The contract in which to call the function
     * @param options.methodName The method that will be called
     * @param options.args Arguments, either as a valid JSON Object or a raw Uint8Array
     * @param options.deposit (optional) Amount of NEAR Tokens to attach to the call (default 0)
     * @param options.gas (optional) Amount of GAS to use attach to the call (default 30TGas)
     * @param options.waitUntil (optional) Transaction finality to wait for (default INCLUDED_FINAL)
     * @returns {FinalExecutionOutcome}
     */
    public async callFunctionRaw({
        contractId,
        methodName,
        args = {},
        deposit = 0n,
        gas = DEFAULT_FUNCTION_CALL_GAS,
        waitUntil = DEFAULT_WAIT_STATUS,
    }: CallFunctionArgs): Promise<FinalExecutionOutcome> {
        return await this.signAndSendTransaction({
            receiverId: contractId,
            actions: [functionCall(methodName, args, BigInt(gas), BigInt(deposit))],
            waitUntil,
        });
    }

    /**
     * This function simply calls the `signNep413Message` method of the Signer
     *
     * @deprecated This method is deprecated and will be removed in future versions. Please use `signMessage` from `near-api-js/nep413` to sign NEP-413 messages.
     *
     * @param options
     * @param options.message The message to be signed (e.g. "authenticating")
     * @param options.recipient Who will receive the message (e.g. auth.app.com)
     * @param options.nonce A challenge sent by the recipient
     * @param options.callbackUrl (optional) Deprecated parameter used only by browser wallets
     * @returns
     */
    public async signNep413Message({
        message,
        recipient,
        nonce,
        callbackUrl,
    }: SignNep413MessageArgs): Promise<SignedMessage> {
        if (!this.signer) throw new Error('Please set a signer');

        return this.signer.signNep413Message(this.accountId, {
            message,
            recipient,
            nonce,
            callbackUrl,
        });
    }

    /**
     *
     * @param token The token to check the balance of. Defaults to Native NEAR.
     * @returns The available balance of the account in units (e.g. yoctoNEAR).
     */
    public async getBalance(token: NativeToken | FungibleToken = NEAR): Promise<bigint> {
        return token.getBalance(this);
    }

    /**
     * Transfers a token to the specified receiver.
     *
     * Supports sending either the native NEAR token or any supported Fungible Token (FT).
     *
     * @param amount - The amount of tokens to transfer in units (e.g. yoctoNEAR).
     * @param receiverId - The NEAR account ID of the receiver.
     * @param token - The token to transfer. Defaults to Native NEAR.
     *
     */
    public async transfer({ receiverId, amount, token = NEAR }: TransferArgs): Promise<FinalExecutionOutcome> {
        return token.transfer({ from: this, receiverId, amount });
    }
}
