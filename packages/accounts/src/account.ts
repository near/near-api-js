import { PublicKey } from "@near-js/crypto";
import { exponentialBackoff, Provider } from "@near-js/providers";
import {
    actionCreators,
    Action,
    buildDelegateAction,
    SignedDelegate,
    SignedTransaction,
    createTransaction,
    stringifyJsonOrBytes,
    DelegateAction,
} from "@near-js/transactions";
import {
    PositionalArgsError,
    FinalExecutionOutcome,
    TypedError,
    AccessKeyView,
    AccessKeyViewRaw,
    AccessKeyList,
    AccessKeyInfoView,
    FunctionCallPermissionView,
    BlockReference,
    ContractCodeView,
    ContractStateView,
    ErrorContext,
    TxExecutionStatus,
    AccountView,
} from "@near-js/types";
import {
    baseDecode,
    Logger,
    DEFAULT_FUNCTION_CALL_GAS,
    baseEncode,
    parseResultError,
    printTxOutcomeLogsAndFailures,
} from "@near-js/utils";

import { SignedMessage, Signer } from "@near-js/signers";
import { Connection } from "./connection";
import { viewFunction, viewState } from "./utils";
import {
    ChangeFunctionCallOptions,
    ViewFunctionCallOptions,
} from "./interface";
import { NearToken, FungibleToken } from "@near-js/tokens";

const {
    addKey,
    createAccount,
    deleteAccount,
    deleteKey,
    deployContract,
    fullAccessKey,
    functionCall,
    functionCallAccessKey,
    transfer,
} = actionCreators;

// Default values to wait for
const DEFAULT_FINALITY = "optimistic";
export const DEFAULT_WAIT_STATUS: TxExecutionStatus = "EXECUTED_OPTIMISTIC";

export interface AccountState {
    balance: {
        total: bigint;
        usedOnStorage: bigint;
        locked: bigint;
        available: bigint;
    }
    storageUsage: number;
    codeHash: string;
}

export interface AccountBalance {
    total: string;
    stateStaked: string;
    staked: string;
    available: string;
}

export interface AccountAuthorizedApp {
    contractId: string;
    amount: string;
    publicKey: string;
}

/**
 * Options used to initiate sining and sending transactions
 */
export interface SignAndSendTransactionOptions {
    receiverId: string;
    actions: Action[];
    /**
     * Metadata to send the NEAR Wallet if using it to sign transactions.
     * @see RequestSignTransactionsOptions
     */
    walletMeta?: string;
    /**
     * Callback url to send the NEAR Wallet if using it to sign transactions.
     * @see RequestSignTransactionsOptions
     */
    walletCallbackUrl?: string;
    returnError?: boolean;
}

interface StakedBalance {
    validatorId: string;
    amount?: string;
    error?: string;
}

interface ActiveDelegatedStakeBalance {
    stakedValidators: StakedBalance[];
    failedValidators: StakedBalance[];
    total: bigint | string;
}

interface SignedDelegateOptions {
    actions: Action[];
    blockHeightTtl: number;
    receiverId: string;
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

    constructor(accountId: string, provider: Provider, signer?: Signer) {
        this.accountId = accountId;
        this.provider = provider;
        this.signer = signer;
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
        const state = await this.provider.viewAccount(this.accountId, {
            finality: DEFAULT_FINALITY,
        });

        const costPerByte = BigInt(
            protocolConfig.runtime_config.storage_amount_per_byte
        );
        const usedOnStorage = BigInt(state.storage_usage) * costPerByte;
        const locked = BigInt(state.locked);
        const total = BigInt(state.amount) + locked;
        const available =
            total - (locked > usedOnStorage ? locked : usedOnStorage);

        return {
            balance: {
                total, usedOnStorage, locked, available
            },
            storageUsage: state.storage_usage,
            codeHash: state.code_hash,
        };
    }

    /**
     * Calls {@link Provider.viewAccessKey} to retrieve information for a
     * specific key in the account
     */
    public async getAccessKey(
        publicKey: PublicKey | string
    ): Promise<AccessKeyView> {
        return this.provider.viewAccessKey(this.accountId, publicKey, {
            finality: DEFAULT_FINALITY,
        });
    }

    /**
     * Calls {@link Provider.viewAccessKeyList} to retrieve the account's keys
     */
    public async getAccessKeyList(): Promise<AccessKeyList> {
        return this.provider.viewAccessKeyList(this.accountId, {
            finality: DEFAULT_FINALITY,
        });
    }

    /**
     * Calls {@link Provider.viewContractCode} to retrieve the account's
     * contract code and its hash
     */
    public async getContractCode(): Promise<ContractCodeView> {
        return this.provider.viewContractCode(this.accountId, {
            finality: DEFAULT_FINALITY,
        });
    }

    /**
     * Calls {@link Provider.viewContractState} to retrieve the keys and values
     * stored on the account's contract
     */
    public async getContractState(prefix?: string): Promise<ContractStateView> {
        return this.provider.viewContractState(this.accountId, prefix, {
            finality: DEFAULT_FINALITY,
        });
    }

    /**
     * Create a transaction that can be later signed with a {@link Signer}
     *
     * @param receiverId Account against which to perform the actions
     * @param actions Actions to perform
     * @param publicKey The public part of the key that will be used to sign the transaction
     */
    public async createTransaction(
        receiverId: string,
        actions: Action[],
        publicKey: PublicKey | string
    ) {
        if (!publicKey) throw new Error("Please provide a public key");

        const pk = PublicKey.from(publicKey);

        const accessKey = await this.getAccessKey(pk);

        const block = await this.provider.viewBlock({
            finality: DEFAULT_FINALITY,
        });
        const recentBlockHash = block.header.hash;

        const nonce = BigInt(accessKey.nonce) + 1n;

        return createTransaction(
            this.accountId,
            pk,
            receiverId,
            nonce + 1n,
            actions,
            baseDecode(recentBlockHash)
        );
    }

    /**
     * Create a signed transaction ready to be broadcast by a {@link Provider}
     */
    public async createSignedTransaction(
        receiverId: string,
        actions: Action[]
    ): Promise<SignedTransaction> {
        if (!this.signer) throw new Error("Please set a signer");

        const tx = await this.createTransaction(
            receiverId,
            actions,
            await this.signer.getPublicKey()
        );

        const [, signedTx] = await this.signer.signTransaction(tx);

        return signedTx;
    }

    /**
     * Create a meta transaction ready to be signed by a {@link Signer}
     *
     * @param receiverId NEAR account receiving the transaction
     * @param actions list of actions to perform as part of the meta transaction
     * @param blockHeightTtl number of blocks after which a meta transaction will expire if not processed
     */
    public async createMetaTransaction(
        receiverId: string,
        actions: Action[],
        blockHeightTtl: number = 200,
        publicKey: PublicKey | string
    ): Promise<DelegateAction> {
        if (!publicKey) throw new Error(`Please provide a public key`);

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
    public async createSignedMetaTransaction(
        receiverId: string,
        actions: Action[],
        blockHeightTtl: number = 200
    ): Promise<[Uint8Array, SignedDelegate]> {
        if (!this.signer) throw new Error(`Please set a signer`);

        const delegateAction = await this.createMetaTransaction(
            receiverId,
            actions,
            blockHeightTtl,
            await this.signer.getPublicKey()
        );

        return this.signer.signDelegateAction(delegateAction);
    }

    /**
     * Creates a transaction, signs it and broadcast it to the network
     *
     * @param receiverId The NEAR account ID of the transaction receiver.
     * @param actions The list of actions to be performed in the transaction.
     * @param returnError Whether to return an error if the transaction fails.
     * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the transaction.
     *
     */
    async signAndSendTransaction({
        receiverId,
        actions,
        waitUntil = DEFAULT_WAIT_STATUS,
    }: {
        receiverId: string;
        actions: Action[];
        waitUntil?: TxExecutionStatus;
    }): Promise<FinalExecutionOutcome> {
        const signedTx = await this.createSignedTransaction(
            receiverId,
            actions
        );
        return await this.provider.sendTransactionUntil(signedTx, waitUntil);
    }

    /**
     * Creates an account of the form <name>.<tla>, e.g. ana.testnet or ana.near
     *
     * @param newAccountId the new account to create (e.g. ana.near)
     * @param publicKey the public part of the key that will control the account
     * @param amountToTransfer how much NEAR to transfer to the account
     *
     */
    public async createTopLevelAccount(
        newAccountId: string,
        publicKey: PublicKey | string,
        amountToTransfer: bigint | string | number
    ): Promise<FinalExecutionOutcome> {
        const splitted = newAccountId.split(".");
        if (splitted.length != 2) {
            throw new Error(
                "newAccountId needs to be of the form <string>.<tla>"
            );
        }

        const TLA = splitted[1];
        return await this.callFunction({
            contractId: TLA,
            methodName: "create_account",
            args: {
                new_account_id: newAccountId,
                new_public_key: publicKey.toString(),
            },
            gas: BigInt("60000000000000"),
            deposit: BigInt(amountToTransfer),
        });
    }

    /**
     * Creates a sub account of this account. For example, if the account is
     * ana.near, you can create sub.ana.near.
     *
     * @param accountOrPrefix a prefix (e.g. `sub`) or the full sub-account (`sub.ana.near`)
     * @param publicKey the public part of the key that will control the account
     * @param amountToTransfer how much NEAR to transfer to the account
     *
     */
    public async createSubAccount(
        accountOrPrefix: string,
        publicKey: PublicKey | string,
        amountToTransfer: bigint | string | number
    ): Promise<FinalExecutionOutcome> {
        if (!this.signer) throw new Error("Please set a signer");

        const newAccountId = accountOrPrefix.includes(".")
            ? accountOrPrefix
            : `${accountOrPrefix}.${this.accountId}`;

        if (newAccountId.length > 64) {
            throw new Error(`Accounts cannot exceed 64 characters`);
        }

        if (!newAccountId.endsWith(this.accountId)) {
            throw new Error(`New account must end up with ${this.accountId}`);
        }

        const actions = [
            createAccount(),
            transfer(BigInt(amountToTransfer)),
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
    public async deleteAccount(
        beneficiaryId: string
    ): Promise<FinalExecutionOutcome> {
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
    public async deployContract(
        code: Uint8Array
    ): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [deployContract(code)],
        });
    }

    /**
     *
     * @param publicKey The key to add to the account
     * @param contractId The contract that this key can call
     * @param methodNames The methods this key is allowed to call
     * @param allowance The amount of NEAR this key can expend in gas
     * @param opts
     * @returns
     */
    public async addFunctionCallAccessKey(
        publicKey: PublicKey | string,
        contractId: string,
        methodNames: string[],
        allowance?: bigint | string | number
    ): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [
                addKey(
                    PublicKey.from(publicKey),
                    functionCallAccessKey(
                        contractId,
                        methodNames,
                        BigInt(allowance)
                    )
                ),
            ]
        });
    }

    /**
     * Add a full access key to the account
     *
     * @param publicKey The public key to be added
     * @param opts
     * @returns {Promise<FinalExecutionOutcome>}
     */
    public async addFullAccessKey(
        publicKey: PublicKey | string
    ): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction(
            {
                receiverId: this.accountId,
                actions: [
                    addKey(
                        PublicKey.from(publicKey),
                        fullAccessKey()
                    ),
                ],
            }
        );
    }

    /**
     * @param publicKey The public key to be deleted
     * @returns {Promise<FinalExecutionOutcome>}
     */
    public async deleteKey(
        publicKey: PublicKey | string
    ): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [deleteKey(PublicKey.from(publicKey))],
        });
    }

    /**
     * Call a function on a smart contract
     *
     * @param options
     * @param options.contractId The contract in which to call the function
     * @param options.methodName The method that will be called
     * @param options.args Arguments, either as a valid JSON Object or a raw Uint8Array
     * @param options.deposit (optional) Amount of NEAR Tokens to attach to the call (default 0)
     * @param options.gas (optional) Amount of GAS to use attach to the call (default 30TGas)
     * @returns
     */
    public async callFunction({
        contractId,
        methodName,
        args = {},
        deposit = "0",
        gas = DEFAULT_FUNCTION_CALL_GAS,
    }: {
        contractId: string;
        methodName: string;
        args: Uint8Array | Record<string, any>;
        deposit?: bigint | string | number;
        gas?: bigint | string | number;
    }): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction({
            receiverId: contractId,
            actions: [
                functionCall(methodName, args, BigInt(gas), BigInt(deposit)),
            ],
        });
    }

    /**
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
    }: {
        message: string;
        recipient: string;
        nonce: Uint8Array;
        callbackUrl?: string;
    }): Promise<SignedMessage> {
        if (!this.signer) throw new Error("Please set a signer");
        return this.signer.signNep413Message(
            message,
            this.accountId,
            recipient,
            nonce,
            callbackUrl
        );
    }

    // DEPRECATED FUNCTIONS BELLOW - Please remove in next release

    /**
     * @deprecated please use {@link Account.createSignedMetaTransaction} instead
     *
     * Compose and sign a SignedDelegate action to be executed in a transaction on behalf of this Account instance
     *
     * @param options Options for the transaction.
     * @param options.actions Actions to be included in the meta transaction
     * @param options.blockHeightTtl Number of blocks past the current block height for which the SignedDelegate action may be included in a meta transaction
     * @param options.receiverId Receiver account of the meta transaction
     */
    public async signedDelegate({
        actions,
        blockHeightTtl,
        receiverId,
    }: SignedDelegateOptions): Promise<SignedDelegate> {
        const { header } = await this.provider.viewBlock({
            finality: DEFAULT_FINALITY,
        });

        if (!this.signer) throw new Error(`Please set a signer`);

        const pk = await this.signer.getPublicKey();

        const accessKey = await this.getAccessKey(pk);

        const delegateAction = buildDelegateAction({
            actions,
            maxBlockHeight: BigInt(header.height) + BigInt(blockHeightTtl),
            nonce: BigInt(accessKey.nonce) + 1n,
            publicKey: pk,
            receiverId,
            senderId: this.accountId,
        });

        const [, signedDelegate] = await this.signer.signDelegateAction(
            delegateAction
        );

        return signedDelegate;
    }

    /**
     * @deprecated
     */
    public getConnection(): Connection {
        return new Connection("", this.provider, this.signer);
    }

    /** @hidden */
    private validateArgs(args: any) {
        const isUint8Array =
            args.byteLength !== undefined && args.byteLength === args.length;
        if (isUint8Array) {
            return;
        }

        if (Array.isArray(args) || typeof args !== "object") {
            throw new PositionalArgsError();
        }
    }

    /**
     * @deprecated please use callFunction instead
     *
     * Execute a function call.
     * @param options The options for the function call.
     * @param options.contractId The NEAR account ID of the smart contract.
     * @param options.methodName The name of the method to be called on the smart contract.
     * @param options.args The arguments to be passed to the method.
     * @param options.gas The maximum amount of gas to be used for the function call.
     * @param options.attachedDeposit The amount of NEAR tokens to be attached to the function call.
     * @param options.walletMeta Metadata for wallet integration.
     * @param options.walletCallbackUrl The callback URL for wallet integration.
     * @param options.stringify A function to convert input arguments into bytes array
     * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the function call.
     */
    async functionCall({
        contractId,
        methodName,
        args = {},
        gas = DEFAULT_FUNCTION_CALL_GAS,
        attachedDeposit,
        walletMeta,
        walletCallbackUrl,
        stringify,
    }: ChangeFunctionCallOptions): Promise<FinalExecutionOutcome> {
        this.validateArgs(args);

        const stringifyArg =
            stringify === undefined ? stringifyJsonOrBytes : stringify;
        const functionCallArgs = [
            methodName,
            args,
            gas,
            attachedDeposit,
            stringifyArg,
            false,
        ];

        return this.signAndSendTransactionLegacy({
            receiverId: contractId,
            // eslint-disable-next-line prefer-spread
            actions: [functionCall.apply(void 0, functionCallArgs)],
            walletMeta,
            walletCallbackUrl,
        });
    }

    /**
     * @deprecated use instead {@link Provider.viewTransactionStatus}
     */
    public async getTransactionStatus(
        txHash: string | Uint8Array
    ): Promise<FinalExecutionOutcome> {
        return this.provider.viewTransactionStatus(
            txHash,
            this.accountId, // accountId is used to determine on which shard to look for a tx
            "EXECUTED_OPTIMISTIC"
        );
    }

    /**
     * @deprecated use ${@link createSignedTransaction}
     * Create a signed transaction which can be broadcast to the network
     * @param receiverId NEAR account receiving the transaction
     * @param actions list of actions to perform as part of the transaction
     * @see {@link "@near-js/providers".json-rpc-provider.JsonRpcProvider.sendTransaction | JsonRpcProvider.sendTransaction}
     */
    public async signTransaction(
        receiverId: string,
        actions: Action[],
        opts?: { signer: Signer }
    ): Promise<[Uint8Array, SignedTransaction]> {
        const signer = opts?.signer || this.signer;

        if (!signer) throw new Error(`Please set a signer`);

        const pk = await signer.getPublicKey();

        const accessKey = await this.getAccessKey(pk);

        const block = await this.provider.viewBlock({
            finality: DEFAULT_FINALITY,
        });
        const recentBlockHash = block.header.hash;

        const nonce = BigInt(accessKey.nonce) + 1n;

        const tx = createTransaction(
            this.accountId,
            pk,
            receiverId,
            nonce + 1n,
            actions,
            baseDecode(recentBlockHash)
        );

        return signer.signTransaction(tx);
    }

    /**
     * @deprecated instead please create a transaction with
     * the actions bellow and broadcast it to the network
     * 1. createAccount
     * 2. transfer some tokens
     * 3. deployContract
     * 4. (optional) addKey
     * 5. (optional) functionCall to an initialization function
     *
     * Create a new account and deploy a contract to it
     * @param contractId NEAR account where the contract is deployed
     * @param publicKey The public key to add to the created contract account
     * @param data The compiled contract code
     * @param amount of NEAR to transfer to the created contract account. Transfer enough to pay for storage https://docs.near.org/docs/concepts/storage-staking
     */
    async createAndDeployContract(
        contractId: string,
        publicKey: string | PublicKey,
        data: Uint8Array,
        amount: bigint
    ): Promise<Account> {
        const accessKey = fullAccessKey();
        await this.signAndSendTransactionLegacy({
            receiverId: contractId,
            actions: [
                createAccount(),
                transfer(amount),
                addKey(PublicKey.from(publicKey), accessKey),
                deployContract(data),
            ],
        });
        return new Account(contractId, this.provider);
    }

    /**
     * @deprecated please instead use {@link transfer}
     *
     * @param receiverId NEAR account receiving Ⓝ
     * @param amount Amount to send in yoctoⓃ
     */
    async sendMoney(
        receiverId: string,
        amount: bigint
    ): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransactionLegacy({
            receiverId,
            actions: [transfer(amount)],
        });
    }

    /**
     * @deprecated please instead use {@link createTopLevelAccount}
     *
     * @param newAccountId NEAR account name to be created
     * @param publicKey A public key created from the masterAccount
     */
    async createAccount(
        newAccountId: string,
        publicKey: string | PublicKey,
        amount: bigint
    ): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransactionLegacy({
            receiverId: newAccountId,
            actions: [
                createAccount(),
                transfer(amount),
                addKey(PublicKey.from(publicKey), fullAccessKey()),
            ],
        });
    }

    /**
     * @deprecated please instead use {@link signAndSendTransaction}
     *
     * Sign a transaction to perform a list of actions and broadcast it using the RPC API.
     * @see {@link "@near-js/providers".json-rpc-provider.JsonRpcProvider | JsonRpcProvider }
     *
     * @param options The options for signing and sending the transaction.
     * @param options.receiverId The NEAR account ID of the transaction receiver.
     * @param options.actions The list of actions to be performed in the transaction.
     * @param options.returnError Whether to return an error if the transaction fails.
     * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the transaction.
     *
     */
    async signAndSendTransactionLegacy(
        { receiverId, actions, returnError }: SignAndSendTransactionOptions,
        opts?: { signer: Signer }
    ): Promise<FinalExecutionOutcome> {
        let txHash, signedTx;

        // Default number of retries with different nonce before giving up on a transaction.
        const TX_NONCE_RETRY_NUMBER = 12;

        // Default wait until next retry in millis.
        const TX_NONCE_RETRY_WAIT = 500;

        // Exponential back off for waiting to retry.
        const TX_NONCE_RETRY_WAIT_BACKOFF = 1.5;

        // TODO: TX_NONCE (different constants for different uses of exponentialBackoff?)
        const result = await exponentialBackoff(
            TX_NONCE_RETRY_WAIT,
            TX_NONCE_RETRY_NUMBER,
            TX_NONCE_RETRY_WAIT_BACKOFF,
            async () => {
                [txHash, signedTx] = await this.signTransaction(
                    receiverId,
                    actions,
                    opts
                );

                try {
                    return await this.provider.sendTransaction(signedTx);
                } catch (error) {
                    if (error.type === "InvalidNonce") {
                        Logger.warn(
                            `Retrying transaction ${receiverId}:${baseEncode(
                                txHash
                            )} with new nonce.`
                        );
                        return null;
                    }
                    if (error.type === "Expired") {
                        Logger.warn(
                            `Retrying transaction ${receiverId}:${baseEncode(
                                txHash
                            )} due to expired block hash`
                        );
                        return null;
                    }

                    error.context = new ErrorContext(baseEncode(txHash));
                    throw error;
                }
            }
        );
        if (!result) {
            // TODO: This should have different code actually, as means "transaction not submitted for sure"
            throw new TypedError(
                "nonce retries exceeded for transaction. This usually means there are too many parallel requests with the same access key.",
                "RetriesExceeded"
            );
        }

        printTxOutcomeLogsAndFailures({
            contractId: signedTx.transaction.receiverId,
            outcome: result,
        });

        // Should be falsy if result.status.Failure is null
        if (
            !returnError &&
            typeof result.status === "object" &&
            typeof result.status.Failure === "object" &&
            result.status.Failure !== null
        ) {
            // if error data has error_message and error_type properties, we consider that node returned an error in the old format
            if (
                result.status.Failure.error_message &&
                result.status.Failure.error_type
            ) {
                throw new TypedError(
                    `Transaction ${result.transaction_outcome.id} failed. ${result.status.Failure.error_message}`,
                    result.status.Failure.error_type
                );
            } else {
                throw parseResultError(result);
            }
        }
        // TODO: if Tx is Unknown or Started.
        return result;
    }

    /** @hidden */
    accessKeyByPublicKeyCache: { [key: string]: AccessKeyView } = {};

    /**
     * @deprecated, accounts will no longer handle keystores
     *
     * Finds the {@link AccessKeyView} associated with the accounts {@link PublicKey} stored in the {@link "@near-js/keystores".keystore.KeyStore | Keystore}.
     *
     * @param receiverId currently unused
     * @param actions currently unused
     * @returns `{ publicKey PublicKey; accessKey: AccessKeyView }`
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async findAccessKey(
        receiverId: string,
        actions: Action[]
    ): Promise<{ publicKey: PublicKey; accessKey: AccessKeyView }> {
        if (!this.signer) throw new Error(`Please set a signer`);

        const publicKey = await this.signer.getPublicKey();
        if (!publicKey) {
            throw new TypedError(
                `no matching key pair found in ${this.signer.constructor.name}`,
                "PublicKeyNotFound"
            );
        }

        const cachedAccessKey =
            this.accessKeyByPublicKeyCache[publicKey.toString()];
        if (cachedAccessKey !== undefined) {
            return { publicKey, accessKey: cachedAccessKey };
        }

        try {
            const rawAccessKey = await this.provider.query<AccessKeyViewRaw>({
                request_type: "view_access_key",
                account_id: this.accountId,
                public_key: publicKey.toString(),
                finality: DEFAULT_FINALITY,
            });

            // store nonce as BigInt to preserve precision on big number
            const accessKey = {
                ...rawAccessKey,
                nonce: BigInt(rawAccessKey.nonce || 0),
            };
            // this function can be called multiple times and retrieve the same access key
            // this checks to see if the access key was already retrieved and cached while
            // the above network call was in flight. To keep nonce values in line, we return
            // the cached access key.
            if (this.accessKeyByPublicKeyCache[publicKey.toString()]) {
                return {
                    publicKey,
                    accessKey:
                        this.accessKeyByPublicKeyCache[publicKey.toString()],
                };
            }

            this.accessKeyByPublicKeyCache[publicKey.toString()] = accessKey;
            return { publicKey, accessKey };
        } catch (e) {
            if (e.type == "AccessKeyDoesNotExist") {
                return null;
            }

            throw e;
        }
    }

    /**
     * @deprecated please use {@link addFullAccessKey} or {@link addFunctionAccessKey}
     *
     * @see [https://docs.near.org/concepts/basics/accounts/access-keys](https://docs.near.org/concepts/basics/accounts/access-keys)
     * @todo expand this API to support more options.
     * @param publicKey A public key to be associated with the contract
     * @param contractId NEAR account where the contract is deployed
     * @param methodNames The method names on the contract that should be allowed to be called. Pass null for no method names and '' or [] for any method names.
     * @param amount Payment in yoctoⓃ that is sent to the contract during this function call
     */
    async addKey(
        publicKey: string | PublicKey,
        contractId?: string,
        methodNames?: string | string[],
        amount?: bigint
    ): Promise<FinalExecutionOutcome> {
        if (!methodNames) {
            methodNames = [];
        }
        if (!Array.isArray(methodNames)) {
            methodNames = [methodNames];
        }
        let accessKey;
        if (!contractId) {
            accessKey = fullAccessKey();
        } else {
            accessKey = functionCallAccessKey(contractId, methodNames, amount);
        }
        return this.signAndSendTransactionLegacy({
            receiverId: this.accountId,
            actions: [addKey(PublicKey.from(publicKey), accessKey)],
        });
    }

    /**
     * Invoke a contract view function using the RPC API.
     * @see [https://docs.near.org/api/rpc/contracts#call-a-contract-function](https://docs.near.org/api/rpc/contracts#call-a-contract-function)
     *
     * @deprecated please use {@link Provider.callFunction} instead
     *
     * @param options Function call options.
     * @param options.contractId NEAR account where the contract is deployed
     * @param options.methodName The view-only method (no state mutations) name on the contract as it is written in the contract code
     * @param options.args Any arguments to the view contract method, wrapped in JSON
     * @param options.parse Parse the result of the call. Receives a Buffer (bytes array) and converts it to any object. By default result will be treated as json.
     * @param options.stringify Convert input arguments into a bytes array. By default the input is treated as a JSON.
     * @param options.blockQuery specifies which block to query state at. By default returns last DEFAULT_FINALITY block (i.e. not necessarily finalized).
     * @returns {Promise<any>}
     */
    async viewFunction(options: ViewFunctionCallOptions): Promise<any> {
        return await viewFunction(this.getConnection(), options);
    }

    /**
     * @deprecated please use {@link getContractState} instead
     *
     * Returns the state (key value pairs) of this account's contract based on the key prefix.
     * Pass an empty string for prefix if you would like to return the entire state.
     * @see [https://docs.near.org/api/rpc/contracts#view-contract-state](https://docs.near.org/api/rpc/contracts#view-contract-state)
     *
     * @param prefix allows to filter which keys should be returned. Empty prefix means all keys. String prefix is utf-8 encoded.
     * @param blockQuery specifies which block to query state at. By default returns last DEFAULT_FINALITY block (i.e. not necessarily finalized).
     */
    async viewState(
        prefix: string | Uint8Array,
        blockQuery: BlockReference = { finality: DEFAULT_FINALITY }
    ): Promise<Array<{ key: Buffer; value: Buffer }>> {
        return await viewState(
            this.getConnection(),
            this.accountId,
            prefix,
            blockQuery
        );
    }

    /**
     * Get all access keys for the account
     * @see [https://docs.near.org/api/rpc/access-keys#view-access-key-list](https://docs.near.org/api/rpc/access-keys#view-access-key-list)
     *
     * @deprecated
     */
    async getAccessKeys(): Promise<AccessKeyInfoView[]> {
        const response = await this.provider.query<AccessKeyList>({
            request_type: "view_access_key_list",
            account_id: this.accountId,
            finality: DEFAULT_FINALITY,
        });
        // Replace raw nonce into a new BigInt
        return response?.keys?.map((key) => ({
            ...key,
            access_key: {
                ...key.access_key,
                nonce: BigInt(key.access_key.nonce),
            },
        }));
    }

    /**
     * @deprecated
     * 
     * Returns a list of authorized apps
     * @todo update the response value to return all the different keys, not just app keys.
     *
     */
    async getAccountDetails(): Promise<{
        authorizedApps: AccountAuthorizedApp[];
    }> {
        // TODO: update the response value to return all the different keys, not just app keys.
        // Also if we need this function, or getAccessKeys is good enough.
        const accessKeys = await this.getAccessKeys();
        const authorizedApps = accessKeys
            .filter((item) => item.access_key.permission !== "FullAccess")
            .map((item) => {
                const perm = item.access_key
                    .permission as FunctionCallPermissionView;
                return {
                    contractId: perm.FunctionCall.receiver_id,
                    amount: perm.FunctionCall.allowance,
                    publicKey: item.public_key,
                };
            });

        return { authorizedApps };
    }

    /**
     * @deprecated please use {@link getState} instead
     * 
     * Returns basic NEAR account information via the `view_account` RPC query method
     * @see [https://docs.near.org/api/rpc/contracts#view-account](https://docs.near.org/api/rpc/contracts#view-account)
     */
    async state(): Promise<AccountView> {
        return this.provider.query<AccountView>({
            request_type: 'view_account',
            account_id: this.accountId,
            finality: 'optimistic'
        });
    }

    /**
     * @deprecated please use {@link getState} instead
     * 
     */
    async getAccountBalance(): Promise<AccountBalance> {
        const protocolConfig = await this.provider.experimental_protocolConfig({
            finality: DEFAULT_FINALITY,
        });
        const state = await this.state();

        const costPerByte = BigInt(
            protocolConfig.runtime_config.storage_amount_per_byte
        );
        const stateStaked = BigInt(state.storage_usage) * costPerByte;
        const staked = BigInt(state.locked);
        const totalBalance = BigInt(state.amount) + staked;
        const availableBalance =
            totalBalance - (staked > stateStaked ? staked : stateStaked);

        return {
            total: totalBalance.toString(),
            stateStaked: stateStaked.toString(),
            staked: staked.toString(),
            available: availableBalance.toString(),
        };
    }

    /**
     * Returns the NEAR tokens balance and validators of a given account that is delegated to the staking pools that are part of the validators set in the current epoch.
     *
     * @deprecated
     *
     * NOTE: If the tokens are delegated to a staking pool that is currently on pause or does not have enough tokens to participate in validation, they won't be accounted for.
     * @returns {Promise<ActiveDelegatedStakeBalance>}
     */
    async getActiveDelegatedStakeBalance(): Promise<ActiveDelegatedStakeBalance> {
        const block = await this.provider.block({
            finality: DEFAULT_FINALITY,
        });
        const blockHash = block.header.hash;
        const epochId = block.header.epoch_id;
        const { current_validators, next_validators, current_proposals } =
            await this.provider.validators(epochId);
        const pools: Set<string> = new Set();
        [
            ...current_validators,
            ...next_validators,
            ...current_proposals,
        ].forEach((validator) => pools.add(validator.account_id));

        const uniquePools = [...pools];
        const promises = uniquePools.map((validator) =>
            this.viewFunction({
                contractId: validator,
                methodName: "get_account_total_balance",
                args: { account_id: this.accountId },
                blockQuery: { blockId: blockHash },
            })
        );

        const results = await Promise.allSettled(promises);

        const hasTimeoutError = results.some((result) => {
            if (
                result.status === "rejected" &&
                result.reason.type === "TimeoutError"
            ) {
                return true;
            }
            return false;
        });

        // When RPC is down and return timeout error, throw error
        if (hasTimeoutError) {
            throw new Error("Failed to get delegated stake balance");
        }
        const summary = results.reduce(
            (result, state, index) => {
                const validatorId = uniquePools[index];
                if (state.status === "fulfilled") {
                    const currentBN = BigInt(state.value);
                    if (currentBN !== 0n) {
                        return {
                            ...result,
                            stakedValidators: [
                                ...result.stakedValidators,
                                { validatorId, amount: currentBN.toString() },
                            ],
                            total: result.total + currentBN,
                        };
                    }
                }
                if (state.status === "rejected") {
                    return {
                        ...result,
                        failedValidators: [
                            ...result.failedValidators,
                            { validatorId, error: state.reason },
                        ],
                    };
                }
                return result;
            },
            { stakedValidators: [], failedValidators: [], total: 0n }
        );

        return {
            ...summary,
            total: summary.total.toString(),
        };
    }

    public async getTokenBalance(
        token: NearToken | FungibleToken
    ): Promise<bigint> {
        if (token instanceof NearToken) {
            const { amount } = await this.state();
            return amount;
        } else if (token instanceof FungibleToken) {
            const { result } = await this.provider.callFunction(
                token.contractId,
                "ft_balance_of",
                { account_id: this.accountId }
            );
            return BigInt(result);
        } else {
            throw new Error(`Invalid token`);
        }
    }

    public async getFormattedTokenBalance(
        token: NearToken | FungibleToken
    ): Promise<string> {
        const balance = await this.getTokenBalance(token);

        return token.toAmount(balance);
    }

    /**
     * Transfers a token to the specified receiver.
     *
     * Supports sending either the native NEAR token or any supported Fungible Token (FT).
     *
     * @param token
     * @param amount - The amount of tokens to transfer (in the smallest units)
     * @param receiverId
     */
    public async transferToken(
        token: NearToken | FungibleToken,
        amount: bigint | string | number,
        receiverId: string
    ): Promise<FinalExecutionOutcome> {
        if (token instanceof NearToken) {
            return this.signAndSendTransaction({
                receiverId,
                actions: [transfer(BigInt(amount))],
            });
        } else if (token instanceof FungibleToken) {
            return this.callFunction({
                contractId: token.contractId,
                methodName: "ft_transfer",
                args: {
                    amount: amount.toString(),
                    receiver_id: receiverId,
                },
                deposit: 1,
            });
        } else {
            throw new Error(`Invalid token`);
        }
    }

    /**
     * Transfers a Fungible Token to a receiver with a callback message.
     *
     * Only works with Fungible Tokens that implement the NEP-141 standard.
     *
     * The {@link message} will be forwarded to the receiver's contract
     * and typically triggers further logic on their side.
     *
     * @param token
     * @param amount - The amount of tokens to transfer (in the smallest units)
     * @param receiverId
     * @param message
     */
    public async transferTokenWithCallback(
        token: FungibleToken,
        amount: bigint | string | number,
        receiverId: string,
        message: string
    ): Promise<FinalExecutionOutcome> {
        return this.callFunction({
            contractId: token.contractId,
            methodName: "ft_transfer_call",
            args: {
                amount: amount.toString(),
                receiver_id: receiverId,
                msg: message,
            },
            deposit: 1,
        });
    }

    /**
     * Registers an account in the token contract's state.
     *
     * Creates a record for the specified account with an initial balance of zero, allowing it
     * to send and receive tokens. If the account is already registered, the function performs
     * no state changes and returns the attached deposit back to the caller.
     */
    public async registerTokenAccount(
        token: FungibleToken,
        accountId?: string
    ): Promise<FinalExecutionOutcome> {
        accountId = accountId ?? this.accountId;

        const { result } = await this.provider.callFunction(
            token.contractId,
            "storage_balance_bounds",
            {}
        );

        const requiredDeposit = result.min as string;

        return this.callFunction({
            contractId: token.contractId,
            methodName: "storage_deposit",
            args: {
                account_id: accountId,
                registration_only: true,
            },
            deposit: requiredDeposit,
        });
    }

    /**
     * Unregisters an account from the token contract's state.
     *
     * Removes the account's record from the contract, effectively disabling it from sending
     * or receiving tokens. This operation requires the account's token balance to be exactly zero;
     * otherwise, the function will panic.
     */
    public async unregisterTokenAccount(
        token: FungibleToken
    ): Promise<FinalExecutionOutcome> {
        return this.callFunction({
            contractId: token.contractId,
            methodName: "storage_unregister",
            args: {
                force: false,
            },
            deposit: "1",
        });
    }
}
