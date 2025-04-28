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
} from "@near-js/transactions";
import {
    PositionalArgsError,
    FinalExecutionOutcome,
    TypedError,
    AccountView,
    AccessKeyView,
    AccessKeyViewRaw,
    AccessKeyList,
    AccessKeyInfoView,
    FunctionCallPermissionView,
    BlockReference,
    ContractCodeView,
    ContractStateView,
    ErrorContext,
    CallContractViewFunctionResult,
} from "@near-js/types";
import {
    baseDecode,
    Logger,
    DEFAULT_FUNCTION_CALL_GAS,
    baseEncode,
    parseResultError,
    printTxOutcomeLogsAndFailures,
} from "@near-js/utils";

import { Signer } from "@near-js/signers";
import { Connection } from "./connection";
import { viewFunction, viewState } from "./utils";
import {
    ChangeFunctionCallOptions,
    IntoConnection,
    ViewFunctionCallOptions,
} from "./interface";
import { randomBytes } from "crypto";
import { SignedMessage } from "@near-js/signers/lib/esm/signer";
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
    stake,
    transfer,
} = actionCreators;

// Default number of retries with different nonce before giving up on a transaction.
const TX_NONCE_RETRY_NUMBER = 12;

// Default wait until next retry in millis.
const TX_NONCE_RETRY_WAIT = 500;

// Exponential back off for waiting to retry.
const TX_NONCE_RETRY_WAIT_BACKOFF = 1.5;

export interface AccountBalance {
    total: string;
    stateStaked: string;
    staked: string;
    available: string;
}

export interface AccountBalanceInfo {
    total: bigint;
    stateStaked: bigint;
    staked: bigint;
    available: bigint;
}

export interface AccountAuthorizedApp {
    contractId: string;
    amount: string;
    publicKey: string;
}

interface SignerOptions {
    signer?: Signer;
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
 * This class provides common account related RPC calls including signing transactions with a {@link "@near-js/crypto".key_pair.KeyPair | KeyPair}.
 */
export class Account implements IntoConnection {
    public readonly accountId: string;
    public readonly provider: Provider;
    public readonly signer?: Signer;

    constructor(accountId: string, provider: Provider, signer?: Signer) {
        this.accountId = accountId;
        this.provider = provider;
        this.signer = signer;
    }

    public getConnection(): Connection {
        return new Connection("", this.provider, this.signer);
    }

    /**
     * Returns basic NEAR account information via the `view_account` RPC query method
     * @see [https://docs.near.org/api/rpc/contracts#view-account](https://docs.near.org/api/rpc/contracts#view-account)
     */
    public async getInformation(): Promise<AccountView> {
        return this.provider.viewAccount(this.accountId, {
            finality: "optimistic",
        });
    }

    /**
     * Returns calculated account balance
     */
    async getBalance(): Promise<AccountBalanceInfo> {
        const protocolConfig = await this.provider.experimental_protocolConfig({
            finality: "final",
        });
        const state = await this.getInformation();

        const costPerByte = BigInt(
            protocolConfig.runtime_config.storage_amount_per_byte
        );
        const stateStaked = BigInt(state.storage_usage) * costPerByte;
        const totalBalance = BigInt(state.amount) + state.locked;
        const availableBalance =
            totalBalance -
            (state.locked > stateStaked ? state.locked : stateStaked);

        return {
            total: totalBalance,
            stateStaked: stateStaked,
            staked: state.locked,
            available: availableBalance,
        };
    }

    /**
     * Returns basic NEAR account information via the `view_account` RPC query method
     * @see [https://docs.near.org/api/rpc/contracts#view-account](https://docs.near.org/api/rpc/contracts#view-account)
     */
    public async getAccessKey(pk: PublicKey | string): Promise<AccessKeyView> {
        return this.provider.viewAccessKey(this.accountId, pk, {
            finality: "optimistic",
        });
    }

    public async getAccessKeyList(): Promise<AccessKeyList> {
        return this.provider.viewAccessKeyList(this.accountId, {
            finality: "optimistic",
        });
    }

    public async getContractCode(): Promise<ContractCodeView> {
        return this.provider.viewContractCode(this.accountId, {
            finality: "optimistic",
        });
    }

    public async getContractState(prefix?: string): Promise<ContractStateView> {
        return this.provider.viewContractState(this.accountId, prefix, {
            finality: "optimistic",
        });
    }

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
     * Invoke a contract view function using the RPC API.
     * @see [https://docs.near.org/api/rpc/contracts#call-a-contract-function](https://docs.near.org/api/rpc/contracts#call-a-contract-function)
     *
     * @returns {Promise<string>}
     */
    public async callReadFunction(
        contractId: string,
        methodName: string,
        args: Record<string, any> = {}
    ): Promise<CallContractViewFunctionResult> {
        return this.provider.callContractViewFunction(
            contractId,
            methodName,
            args,
            { finality: "optimistic" }
        );
    }

    /**
     * Returns basic NEAR account information via the `view_account` RPC query method
     * @see [https://docs.near.org/api/rpc/contracts#view-account](https://docs.near.org/api/rpc/contracts#view-account)
     *
     * @deprecated
     */
    async state(): Promise<AccountView> {
        return this.provider.query<AccountView>({
            request_type: "view_account",
            account_id: this.accountId,
            finality: "optimistic",
        });
    }

    /**
     * Create a signed transaction which can be broadcast to the network
     * @param receiverId NEAR account receiving the transaction
     * @param actions list of actions to perform as part of the transaction
     * @see {@link "@near-js/providers".json-rpc-provider.JsonRpcProvider.sendTransaction | JsonRpcProvider.sendTransaction}
     */
    public async signTransaction(
        receiverId: string,
        actions: Action[],
        opts?: SignerOptions
    ): Promise<[Uint8Array, SignedTransaction]> {
        const signer = opts?.signer || this.signer;

        if (!signer) throw new Error(`Signer is required`);

        const pk = await signer.getPublicKey();

        const accessKey = await this.getAccessKey(pk);

        const block = await this.provider.block({
            finality: "final",
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
     * Create a signed transaction which can be broadcasted to the relayer
     * @param receiverId NEAR account receiving the transaction
     * @param actions list of actions to perform as part of the neta transaction
     * @param blockHeightTtl number of blocks after which a meta transaction will expire if not processed
     */
    public async signMetaTransaction(
        receiverId: string,
        actions: Action[],
        blockHeightTtl: number = 200,
        opts?: SignerOptions
    ): Promise<[Uint8Array, SignedDelegate]> {
        const signer = opts?.signer || this.signer;

        if (!signer) throw new Error(`Signer is required`);

        const pk = await signer.getPublicKey();

        const accessKey = await this.getAccessKey(pk);

        const nonce = BigInt(accessKey.nonce) + 1n;

        const { header } = await this.provider.viewBlock({
            finality: "final",
        });

        const maxBlockHeight = BigInt(header.height) + BigInt(blockHeightTtl);

        const delegateAction = buildDelegateAction({
            receiverId: receiverId,
            senderId: this.accountId,
            actions: actions,
            publicKey: pk,
            nonce: nonce,
            maxBlockHeight: maxBlockHeight,
        });

        return signer.signDelegateAction(delegateAction);
    }

    public async signMessage(
        message: string,
        recipient: string,
        callbackUrl?: string,
        opts?: SignerOptions
    ): Promise<SignedMessage> {
        const signer = opts?.signer || this.signer;

        if (!signer) throw new Error(`Signer is required`);

        const nonce = new Uint8Array(randomBytes(32));

        return signer.signNep413Message(
            message,
            this.accountId,
            recipient,
            nonce,
            callbackUrl
        );
    }

    /**
     * Sign a transaction to perform a list of actions and broadcast it using the RPC API.
     * @see {@link "@near-js/providers".json-rpc-provider.JsonRpcProvider | JsonRpcProvider }
     *
     * @param options The options for signing and sending the transaction.
     * @param options.receiverId The NEAR account ID of the transaction receiver.
     * @param options.actions The list of actions to be performed in the transaction.
     * @param options.returnError Whether to return an error if the transaction fails.
     * @returns {Promise<FinalExecutionOutcome>} A promise that resolves to the final execution outcome of the transaction.
     */
    async signAndSendTransaction(
        { receiverId, actions, returnError }: SignAndSendTransactionOptions,
        opts?: SignerOptions
    ): Promise<FinalExecutionOutcome> {
        let txHash, signedTx;
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
     * Finds the {@link AccessKeyView} associated with the accounts {@link PublicKey} stored in the {@link "@near-js/keystores".keystore.KeyStore | Keystore}.
     *
     * @todo Find matching access key based on transaction (i.e. receiverId and actions)
     *
     * @deprecated
     *
     * @param receiverId currently unused (see todo)
     * @param actions currently unused (see todo)
     * @returns `{ publicKey PublicKey; accessKey: AccessKeyView }`
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async findAccessKey(
        receiverId: string,
        actions: Action[]
    ): Promise<{ publicKey: PublicKey; accessKey: AccessKeyView }> {
        if (!this.signer) throw new Error(`Signer is required`);

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
                finality: "optimistic",
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
     * Create a new account and deploy a contract to it
     *
     * @deprecated
     *
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
        await this.signAndSendTransaction({
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
     * @deprecated
     *
     * @param receiverId NEAR account receiving Ⓝ
     * @param amount Amount to send in yoctoⓃ
     */
    async sendMoney(
        receiverId: string,
        amount: bigint
    ): Promise<FinalExecutionOutcome> {
        return this.signAndSendTransaction({
            receiverId,
            actions: [transfer(amount)],
        });
    }

    /**
     * @deprecated
     *
     * @param newAccountId NEAR account name to be created
     * @param publicKey A public key created from the masterAccount
     */
    async createAccount(
        newAccountId: string,
        publicKey: string | PublicKey,
        amount: bigint
    ): Promise<FinalExecutionOutcome> {
        const accessKey = fullAccessKey();
        return this.signAndSendTransaction({
            receiverId: newAccountId,
            actions: [
                createAccount(),
                transfer(amount),
                addKey(PublicKey.from(publicKey), accessKey),
            ],
        });
    }

    public async createTopLevelAccount(
        account: string,
        pk: PublicKey | string,
        amount: bigint | string | number,
        opts?: SignerOptions
    ): Promise<FinalExecutionOutcome> {
        const topAccount = account.split(".").at(-1);

        if (!topAccount)
            throw new Error(
                `Failed to parse top account out of the name for new account`
            );

        const actions = [
            functionCall(
                "create_account",
                {
                    new_account_id: account,
                    new_public_key: pk.toString(),
                },
                BigInt(60_000_000_000_000),
                BigInt(amount)
            ),
        ];

        return this.signAndSendTransaction(
            {
                receiverId: topAccount,
                actions: actions,
            },
            opts
        );
    }

    public async createSubAccount(
        accountOrPrefix: string,
        pk: PublicKey | string,
        amount: bigint | string | number,
        opts?: SignerOptions
    ): Promise<FinalExecutionOutcome> {
        const newAccountId = accountOrPrefix.includes(".")
            ? accountOrPrefix
            : `${accountOrPrefix}.${this.accountId}`;
        const actions = [
            createAccount(),
            transfer(BigInt(amount)),
            addKey(PublicKey.from(pk), fullAccessKey()),
        ];

        return this.signAndSendTransaction(
            {
                receiverId: newAccountId,
                actions: actions,
            },
            opts
        );
    }

    public async createSubAccountAndDeployContract(
        accountOrPrefix: string,
        pk: PublicKey | string,
        amount: bigint | string | number,
        code: Uint8Array,
        opts?: SignerOptions
    ): Promise<FinalExecutionOutcome> {
        const newAccountId = accountOrPrefix.includes(".")
            ? accountOrPrefix
            : `${accountOrPrefix}.${this.accountId}`;
        const actions = [
            createAccount(),
            transfer(BigInt(amount)),
            addKey(PublicKey.from(pk), fullAccessKey()),
            deployContract(code),
        ];

        return this.signAndSendTransaction(
            {
                receiverId: newAccountId,
                actions: actions,
            },
            opts
        );
    }

    /**
     * @param beneficiaryId The NEAR account that will receive the remaining Ⓝ balance from the account being deleted
     */
    public async deleteAccount(
        beneficiaryId: string,
        opts?: SignerOptions
    ): Promise<FinalExecutionOutcome> {
        Logger.log(
            "Deleting an account does not automatically transfer NFTs and FTs to the beneficiary address. Ensure to transfer assets before deleting."
        );

        const actions = [deleteAccount(beneficiaryId)];

        return this.signAndSendTransaction(
            {
                receiverId: this.accountId,
                actions: actions,
            },
            opts
        );
    }

    /**
     * @param code The compiled contract code bytes
     */
    public async deployContract(
        code: Uint8Array,
        opts?: SignerOptions
    ): Promise<FinalExecutionOutcome> {
        const actions = [deployContract(code)];

        return this.signAndSendTransaction(
            {
                receiverId: this.accountId,
                actions: actions,
            },
            opts
        );
    }

    /**
     * @deprecated
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

        return this.signAndSendTransaction({
            receiverId: contractId,
            // eslint-disable-next-line prefer-spread
            actions: [functionCall.apply(void 0, functionCallArgs)],
            walletMeta,
            walletCallbackUrl,
        });
    }

    /**
     * @deprecated
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
        return this.signAndSendTransaction({
            receiverId: this.accountId,
            actions: [addKey(PublicKey.from(publicKey), accessKey)],
        });
    }

    public async addFullAccessKey(
        pk: PublicKey | string,
        opts?: SignerOptions
    ): Promise<FinalExecutionOutcome> {
        const actions = [addKey(PublicKey.from(pk), fullAccessKey())];

        return this.signAndSendTransaction(
            {
                receiverId: this.accountId,
                actions: actions,
            },
            opts
        );
    }

    public async addFunctionAccessKey(
        pk: PublicKey | string,
        receiverId: string,
        methodNames: string[],
        allowance?: bigint | string | number,
        opts?: SignerOptions
    ): Promise<FinalExecutionOutcome> {
        const actions = [
            addKey(
                PublicKey.from(pk),
                functionCallAccessKey(
                    receiverId,
                    methodNames,
                    BigInt(allowance)
                )
            ),
        ];

        return this.signAndSendTransaction(
            {
                receiverId: this.accountId,
                actions: actions,
            },
            opts
        );
    }

    /**
     * @param publicKey The public key to be deleted
     * @returns {Promise<FinalExecutionOutcome>}
     */
    public async deleteKey(
        publicKey: string | PublicKey,
        opts?: SignerOptions
    ): Promise<FinalExecutionOutcome> {
        const actions = [deleteKey(PublicKey.from(publicKey))];

        return this.signAndSendTransaction(
            {
                receiverId: this.accountId,
                actions: actions,
            },
            opts
        );
    }

    public async transfer(
        receiverId: string,
        amount: bigint | string | number,
        opts?: SignerOptions
    ): Promise<FinalExecutionOutcome> {
        const actions = [transfer(BigInt(amount))];

        return this.signAndSendTransaction(
            {
                receiverId: receiverId,
                actions: actions,
            },
            opts
        );
    }

    /**
     * @see [https://near-nodes.io/validator/staking-and-delegation](https://near-nodes.io/validator/staking-and-delegation)
     *
     * @param publicKey The public key for the account that's staking
     * @param amount The account to stake in yoctoⓃ
     */
    public async stake(
        publicKey: string | PublicKey,
        amount: bigint | string | number,
        opts?: SignerOptions
    ): Promise<FinalExecutionOutcome> {
        const actions = [stake(BigInt(amount), PublicKey.from(publicKey))];

        return this.signAndSendTransaction(
            {
                receiverId: this.accountId,
                actions: actions,
            },
            opts
        );
    }

    /**
     * @deprecated please use {@link Account.signMetaTransaction} instead
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
        const { header } = await this.provider.block({ finality: "final" });

        if (!this.signer) throw new Error(`Signer is required`);

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
     * Invoke a contract view function using the RPC API.
     * @see [https://docs.near.org/api/rpc/contracts#call-a-contract-function](https://docs.near.org/api/rpc/contracts#call-a-contract-function)
     *
     * @deprecated
     *
     * @param options Function call options.
     * @param options.contractId NEAR account where the contract is deployed
     * @param options.methodName The view-only method (no state mutations) name on the contract as it is written in the contract code
     * @param options.args Any arguments to the view contract method, wrapped in JSON
     * @param options.parse Parse the result of the call. Receives a Buffer (bytes array) and converts it to any object. By default result will be treated as json.
     * @param options.stringify Convert input arguments into a bytes array. By default the input is treated as a JSON.
     * @param options.blockQuery specifies which block to query state at. By default returns last "optimistic" block (i.e. not necessarily finalized).
     * @returns {Promise<any>}
     */

    async viewFunction(options: ViewFunctionCallOptions): Promise<any> {
        return await viewFunction(this.getConnection(), options);
    }

    /**
     * Returns the state (key value pairs) of this account's contract based on the key prefix.
     * Pass an empty string for prefix if you would like to return the entire state.
     * @see [https://docs.near.org/api/rpc/contracts#view-contract-state](https://docs.near.org/api/rpc/contracts#view-contract-state)
     *
     * @deprecated
     *
     * @param prefix allows to filter which keys should be returned. Empty prefix means all keys. String prefix is utf-8 encoded.
     * @param blockQuery specifies which block to query state at. By default returns last "optimistic" block (i.e. not necessarily finalized).
     */
    async viewState(
        prefix: string | Uint8Array,
        blockQuery: BlockReference = { finality: "optimistic" }
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
            finality: "optimistic",
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
     * Returns a list of authorized apps
     * @todo update the response value to return all the different keys, not just app keys.
     *
     * @deprecated
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
     * Returns calculated account balance
     *
     * @deprecated
     */
    async getAccountBalance(): Promise<AccountBalance> {
        const protocolConfig = await this.provider.experimental_protocolConfig({
            finality: "final",
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
        const block = await this.provider.block({ finality: "final" });
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
            const { amount } = await this.getInformation();
            return amount;
        } else if (token instanceof FungibleToken) {
            const { result } = await this.callReadFunction(
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
            return this.callFunction(
                token.contractId,
                "ft_transfer",
                {
                    amount: String(amount),
                    receiver_id: receiverId,
                },
                "1"
            );
        } else {
            throw new Error(`Invalid token`);
        }
    }

    /**
     * Execute a function call
     *
     * @param contractId
     * @param methodName
     * @param args
     * @param deposit
     * @param gas
     * @returns
     */
    public async callFunction(
        contractId: string,
        methodName: string,
        args: Record<string, any> = {},
        deposit: bigint | string | number = 0n,
        gas: bigint | string | number = DEFAULT_FUNCTION_CALL_GAS,
        opts?: SignerOptions
    ): Promise<FinalExecutionOutcome> {
        const actions = [
            functionCall(methodName, args, BigInt(gas), BigInt(deposit)),
        ];

        return this.signAndSendTransaction(
            {
                receiverId: contractId,
                actions: actions,
            },
            opts
        );
    }
}
