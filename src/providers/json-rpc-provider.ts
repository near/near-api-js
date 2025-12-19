/**
 * @module
 * @description
 * This module contains the {@link JsonRpcProvider} client class
 * which can be used to interact with the [NEAR RPC API](https://docs.near.org/api/rpc/introduction).
 * @see {@link "@near-js/types".provider | provider} for a list of request and response types
 */

import {
    block,
    changes,
    chunk,
    experimentalChangesInBlock,
    experimentalLightClientProof,
    experimentalProtocolConfig,
    experimentalReceipt,
    experimentalTxStatus,
    gasPrice,
    NearRpcClient,
    nextLightClientBlock,
    query,
    sendTx,
    status,
    tx,
    validators,
    viewAccessKey,
} from '@near-js/jsonrpc-client/no-validation';
import type {
    AccessKeyList,
    AccountView,
    CallResult,
    ContractCodeView,
    QueryRequest,
    RpcLightClientExecutionProofRequest,
    RpcLightClientNextBlockRequest,
    RpcQueryResponse,
    ViewStateResult,
} from '@near-js/jsonrpc-types';
import { encodeTransaction, type SignedTransaction } from '../transactions/index.js';
import {
    type AccessKeyWithPublicKey,
    type BlockId,
    type BlockReference,
    type ChunkId,
    type SerializedReturnValue,
    type TxExecutionStatus,
    TypedError,
} from '../types/index.js';
import {
    baseEncode,
    findSeatPrice,
    formatError,
    getErrorTypeFromErrorMessage,
    parseRpcError,
    ServerError,
} from '../utils/index.js';
import { type ConnectionInfo, fetchJsonRpc, retryConfig } from './fetch_json.js';
import type {
    CallFunctionArgs,
    Provider,
    StripKeys,
    ViewAccessKeyArgs,
    ViewAccessKeyListArgs,
    ViewAccountArgs,
    ViewContractCodeArgs,
    ViewContractStateArgs,
    ViewTransactionStatusArgs,
    ViewValidatorsArgs,
} from './provider.js';

/** @hidden */
// Default number of retries before giving up on a request.
const REQUEST_RETRY_NUMBER = 12;

// Default wait until next retry in millis.
const REQUEST_RETRY_WAIT = 500;

// Exponential back off for waiting to retry.
const REQUEST_RETRY_WAIT_BACKOFF = 1.5;

/// Keep ids unique across all connections.
let _nextId = 123;

type RequestOptions = {
    /**
     * Number of retries before giving up on a request
     */
    retries: number;
    /**
     * Wait until next retry in milliseconds
     */
    wait: number;
    /**
     * Exponential back off for waiting to retry again
     */
    backoff: number;
};

const DEFAULT_FINALITY = 'optimistic';

/**
 * Client class to interact with the [NEAR RPC API](https://docs.near.org/api/rpc/introduction).
 * @see [https://github.com/near/nearcore/tree/master/chain/jsonrpc](https://github.com/near/nearcore/tree/master/chain/jsonrpc)
 */
export class JsonRpcProvider implements Provider {
    /** @hidden */
    readonly connection: ConnectionInfo;

    /** @hidden */
    readonly options: RequestOptions;

    /** @hidden */
    private networkId: string | undefined;

    protected readonly client: NearRpcClient;

    /**
     * @param connectionInfo Connection info
     */
    constructor(connectionInfo: ConnectionInfo, options?: Partial<RequestOptions>) {
        this.connection = connectionInfo || { url: '' };
        const defaultOptions: RequestOptions = {
            retries: REQUEST_RETRY_NUMBER,
            wait: REQUEST_RETRY_WAIT,
            backoff: REQUEST_RETRY_WAIT_BACKOFF,
        };
        this.options = Object.assign({}, defaultOptions, options);
        this.networkId = undefined;

        this.client = new NearRpcClient({
            endpoint: this.connection.url,
            headers: this.connection.headers,
            retries: this.options.retries,
            timeout: 15_000,
        });
    }

    public async getNetworkId(): Promise<string> {
        if (this.networkId) return this.networkId;

        const { chainId } = await this.viewNodeStatus();

        this.networkId = chainId;

        return this.networkId;
    }

    public async getCurrentEpochSeatPrice(): Promise<bigint> {
        const { minimumStakeRatio, protocolVersion } = await this.experimental_protocolConfig({
            finality: DEFAULT_FINALITY,
        });

        if (typeof minimumStakeRatio === 'undefined')
            throw new Error(`Property 'minimum_stake_ratio' is missing in the protocol config`);

        const { currentValidators } = await this.viewValidators();

        // hard-coded in the protocol
        const maxNumberOfSeats = 300;

        return findSeatPrice(currentValidators, maxNumberOfSeats, minimumStakeRatio, protocolVersion);
    }

    public async getNextEpochSeatPrice(): Promise<bigint> {
        const { minimumStakeRatio, protocolVersion } = await this.experimental_protocolConfig({
            finality: DEFAULT_FINALITY,
        });

        if (typeof minimumStakeRatio === 'undefined')
            throw new Error(`Property 'minimum_stake_ratio' is missing in the protocol config`);

        const { nextValidators } = await this.viewValidators();

        // hard-coded in the protocol
        const maxNumberOfSeats = 300;

        return findSeatPrice(nextValidators, maxNumberOfSeats, minimumStakeRatio, protocolVersion);
    }

    public async viewAccessKey({
        accountId,
        publicKey,
        finalityQuery = { finality: DEFAULT_FINALITY },
    }: ViewAccessKeyArgs) {
        return viewAccessKey(this.client, {
            accountId,
            publicKey: publicKey.toString(),
            ...finalityQuery,
        });
    }

    public async viewAccessKeyList({
        accountId,
        finalityQuery = { finality: DEFAULT_FINALITY },
    }: ViewAccessKeyListArgs) {
        return (this as Provider).query<AccessKeyList>({
            ...finalityQuery,
            requestType: 'view_access_key_list',
            accountId,
        });
    }

    public async viewAccount({ accountId, blockQuery = { finality: DEFAULT_FINALITY } }: ViewAccountArgs) {
        return (this as Provider).query<AccountView>({
            ...blockQuery,
            requestType: 'view_account',
            accountId,
        });
    }

    public async viewContractCode({ contractId, blockQuery = { finality: DEFAULT_FINALITY } }: ViewContractCodeArgs) {
        return (this as Provider).query<ContractCodeView>({
            ...blockQuery,
            requestType: 'view_code',
            accountId: contractId,
        });
    }

    public async viewContractState({
        contractId,
        prefix,
        blockQuery = { finality: DEFAULT_FINALITY },
    }: ViewContractStateArgs) {
        const prefixBase64 = Buffer.from(prefix || '').toString('base64');

        return (this as Provider).query<ViewStateResult>({
            ...blockQuery,
            requestType: 'view_state',
            accountId: contractId,
            prefixBase64: prefixBase64,
        });
    }

    public async callFunction<T extends SerializedReturnValue>({
        contractId,
        method,
        args,
        blockQuery = { finality: DEFAULT_FINALITY },
    }: CallFunctionArgs): Promise<T | undefined> {
        const { result } = await this.callFunctionRaw({ contractId, method, args, blockQuery });

        if (result.length === 0) return undefined;

        const serializedResult = Buffer.from(result).toString();

        try {
            return JSON.parse(serializedResult) as T;
        } catch {
            return serializedResult as T;
        }
    }

    public async callFunctionRaw({
        contractId,
        method,
        args,
        blockQuery = { finality: DEFAULT_FINALITY },
    }: CallFunctionArgs) {
        const argsBuffer = ArrayBuffer.isView(args) ? Buffer.from(args) : Buffer.from(JSON.stringify(args));
        const argsBase64 = argsBuffer.toString('base64');

        return (this as Provider).query<CallResult>({
            ...blockQuery,
            requestType: 'call_function',
            accountId: contractId,
            methodName: method,
            argsBase64: argsBase64,
        });
    }

    public async viewBlock(blockQuery: BlockReference) {
        return block(this.client, { ...blockQuery });
    }

    public async viewChunk(chunkId: ChunkId) {
        if (Array.isArray(chunkId) && chunkId.length === 2) {
            return chunk(this.client, { blockId: chunkId[0], shardId: chunkId[1] });
        } else if (typeof chunkId === 'string') {
            return chunk(this.client, { chunkId: chunkId });
        } else {
            throw new Error('Invalid chunkId provided');
        }
    }

    public async viewGasPrice(blockId?: BlockId) {
        if (typeof blockId === 'string' || typeof blockId === 'number') {
            // @ts-expect-error tuple args are deprecated, but tests are still running on old nearcore version that doesn't support object args
            return gasPrice(this.client, [blockId]);
        } else {
            // @ts-expect-error tuple args are deprecated, but tests are still running on old nearcore version that doesn't support object args
            return gasPrice(this.client, [null]);
        }
    }

    public async viewNodeStatus() {
        return status(this.client);
    }

    /**
     * Query validators of an epoch.
     * @see [https://docs.near.org/api/rpc/network#validation-status](https://docs.near.org/api/rpc/network#validation-status)
     *
     * @param params Object specifying either a block or epoch to query.
     * - `{ blockId }`: Block hash or height.
     * - `{ epochId }`: Epoch hash.
     * - `null`: Current epoch.
     */
    public async viewValidators(params?: ViewValidatorsArgs) {
        if (typeof params === 'undefined') return validators(this.client, 'latest');

        if (typeof params === 'object' && 'blockId' in params)
            return validators(this.client, {
                blockId: params.blockId,
            });

        if (typeof params === 'object' && 'epochId' in params)
            return validators(this.client, {
                epochId: params.epochId,
            });

        throw new Error('Invalid parameters for validators');
    }

    public async viewTransactionStatus({
        txHash,
        accountId,
        waitUntil = 'EXECUTED_OPTIMISTIC',
    }: ViewTransactionStatusArgs) {
        const encodedTxHash = typeof txHash === 'string' ? txHash : baseEncode(txHash);

        return tx(this.client, {
            txHash: encodedTxHash,
            senderAccountId: accountId,
            waitUntil: waitUntil,
        });
    }

    public async viewTransactionStatusWithReceipts({
        txHash,
        accountId,
        waitUntil = 'EXECUTED_OPTIMISTIC',
    }: ViewTransactionStatusArgs) {
        const encodedTxHash = typeof txHash === 'string' ? txHash : baseEncode(txHash);

        return experimentalTxStatus(this.client, {
            txHash: encodedTxHash,
            senderAccountId: accountId,
            waitUntil: waitUntil,
        });
    }

    public async viewTransactionReceipt(receiptId: string) {
        return experimentalReceipt(this.client, {
            receiptId,
        });
    }

    /**
     * Sends a signed transaction to the RPC
     *
     * @param signedTransaction The signed transaction being sent
     * @param waitUntil
     */
    async sendTransactionUntil(signedTransaction: SignedTransaction, waitUntil: TxExecutionStatus) {
        const bytes = encodeTransaction(signedTransaction);

        return sendTx(this.client, {
            signedTxBase64: Buffer.from(bytes).toString('base64'),
            waitUntil,
        });
    }

    /**
     * Sends a signed transaction to the RPC and waits until transaction is fully complete
     * @see [https://docs.near.org/docs/develop/front-end/rpc#send-transaction-await](https://docs.near.org/docs/develop/front-end/rpc#general-validator-status)
     *
     * @param signedTransaction The signed transaction being sent
     */
    async sendTransaction(signedTransaction: SignedTransaction) {
        return this.sendTransactionUntil(signedTransaction, 'EXECUTED_OPTIMISTIC');
    }

    /**
     * Sends a signed transaction to the RPC and immediately returns transaction hash
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#send-transaction-async)
     * @param signedTransaction The signed transaction being sent
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async sendTransactionAsync(signedTransaction: SignedTransaction) {
        return this.sendTransactionUntil(signedTransaction, 'NONE');
    }

    /**
     * Query the RPC by passing an {@link "@near-js/types".provider/request.RpcQueryRequest | RpcQueryRequest }
     * @see [https://docs.near.org/api/rpc/contracts](https://docs.near.org/api/rpc/contracts)
     *
     * @typeParam T the shape of the returned query response
     */
    async query<R extends StripKeys<RpcQueryResponse, 'blockHash' | 'blockHeight'>>(
        params: QueryRequest['params']
    ): Promise<R & { blockHash: string; blockHeight: number }>;
    query<R extends StripKeys<RpcQueryResponse, 'blockHash' | 'blockHeight'>>(
        path: string,
        data: string
    ): Promise<R & { blockHash: string; blockHeight: number }>;
    async query(...args: any[]) {
        let result;
        if (args.length === 1) {
            const { block_id, blockId, ...otherParams } = args[0];
            result = await query(this.client, { ...otherParams, blockId: block_id || blockId });
        } else {
            const [path, data] = args;
            result = await query(this.client, { ...data, requestType: path });
        }
        if (result && result.error) {
            throw new TypedError(
                `Querying failed: ${result.error}.\n${JSON.stringify(result, null, 2)}`,
                getErrorTypeFromErrorMessage(result.error, result.error.name)
            );
        }
        return result;
    }

    /**
     * Query changes in block from the RPC
     * pass block_id OR finality as blockQuery, not both
     * @see [https://docs.near.org/api/rpc/block-chunk](https://docs.near.org/api/rpc/block-chunk)
     */
    async blockChanges(blockQuery: BlockReference) {
        return experimentalChangesInBlock(this.client, { ...blockQuery });
    }

    /**
     * Gets the protocol config at a block from RPC
     *
     * @param blockReference specifies the block to get the protocol config for
     */
    async experimental_protocolConfig(blockReference: BlockReference | { syncCheckpoint: 'genesis' }) {
        return experimentalProtocolConfig(this.client, { ...blockReference });
    }

    /**
     * Gets a light client execution proof for verifying execution outcomes
     * @see [https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof](https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof)
     */
    async lightClientProof(request: RpcLightClientExecutionProofRequest) {
        return experimentalLightClientProof(this.client, request);
    }

    /**
     * Returns the next light client block as far in the future as possible from the last known hash
     * to still be able to validate from that hash. This will either return the last block of the
     * next epoch, or the last final known block.
     *
     * @see [https://github.com/near/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-block](https://github.com/near/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-block)
     */
    async nextLightClientBlock(request: RpcLightClientNextBlockRequest) {
        return nextLightClientBlock(this.client, request);
    }

    /**
     * Gets access key changes for a given array of accountIds
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-all)
     */
    async accessKeyChanges(accountIdArray: string[], blockQuery: BlockReference) {
        return changes(this.client, {
            ...blockQuery,
            changesType: 'all_access_key_changes',
            accountIds: accountIdArray,
        });
    }

    /**
     * Gets single access key changes for a given array of access keys
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-single)
     */
    async singleAccessKeyChanges(accessKeyArray: AccessKeyWithPublicKey[], blockQuery: BlockReference) {
        return changes(this.client, {
            ...blockQuery,
            changesType: 'single_access_key_changes',
            keys: accessKeyArray,
        });
    }

    /**
     * Gets account changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-account-changes)
     */
    async accountChanges(accountIdArray: string[], blockQuery: BlockReference) {
        return changes(this.client, {
            ...blockQuery,
            changesType: 'account_changes',
            accountIds: accountIdArray,
        });
    }

    /**
     * Gets contract state changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * Note: If you pass a keyPrefix it must be base64 encoded
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-state-changes)
     */
    async contractStateChanges(accountIdArray: string[], blockQuery: BlockReference, keyPrefix = '') {
        return changes(this.client, {
            ...blockQuery,
            changesType: 'data_changes',
            accountIds: accountIdArray,
            keyPrefixBase64: keyPrefix,
        });
    }

    /**
     * Gets contract code changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * Note: Change is returned in a base64 encoded WASM file
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-code-changes)
     */
    async contractCodeChanges(accountIdArray: string[], blockQuery: BlockReference) {
        return changes(this.client, {
            ...blockQuery,
            changesType: 'contract_code_changes',
            accountIds: accountIdArray,
        });
    }

    /**
     * Directly call the RPC specifying the method and params
     *
     * @param method RPC method
     * @param params Parameters to the method
     */
    async sendJsonRpc<T>(method: string, params: object): Promise<T> {
        const request = {
            method,
            params,
            id: _nextId++,
            jsonrpc: '2.0',
        };
        const response = await fetchJsonRpc(
            this.connection.url,
            request,
            this.connection.headers || {},
            retryConfig(this.options.retries, this.options.backoff, this.options.wait)
        );
        if (response.error) {
            if (typeof response.error.data === 'object') {
                if (
                    typeof response.error.data.error_message === 'string' &&
                    typeof response.error.data.error_type === 'string'
                ) {
                    // if error data has error_message and error_type properties, we consider that node returned an error in the old format
                    throw new TypedError(response.error.data.error_message, response.error.data.error_type);
                }
                throw parseRpcError(response.error.data);
            } else {
                const errorMessage = `[${response.error.code}] ${response.error.message}: ${response.error.data}`;

                const errorType = getErrorTypeFromErrorMessage(response.error.data, '');
                if (errorType) {
                    throw new TypedError(formatError(errorType, params), errorType);
                }
                throw new TypedError(errorMessage, response.error.name);
            }
        } else if (typeof response.result?.error === 'string') {
            const errorType = getErrorTypeFromErrorMessage(response.result.error, '');
            if (errorType) {
                throw new ServerError(formatError(errorType, params), errorType);
            }
        }
        const { result } = response;
        // From jsonrpc spec:
        // result
        //   This member is REQUIRED on success.
        //   This member MUST NOT exist if there was an error invoking the method.
        if (typeof result === 'undefined') {
            throw new TypedError(
                `Exceeded ${this.options.retries} attempts for request to ${method}.`,
                'RetriesExceeded'
            );
        }
        return result;
    }
}
