/**
 * @module
 * @description
 * This module contains the {@link JsonRpcProvider} client class
 * which can be used to interact with the [NEAR RPC API](https://docs.near.org/api/rpc/introduction).
 * @see {@link "@near-js/types".provider | provider} for a list of request and response types
 */
import {
    baseEncode,
    findSeatPrice,
    formatError,
    getErrorTypeFromErrorMessage,
    parseRpcError,
    ServerError,
} from '@near-js/utils';
import {
    AccessKeyWithPublicKey,
    BlockId,
    BlockReference,
    BlockResult,
    BlockChangeResult,
    ChangeResult,
    ChunkId,
    ChunkResult,
    EpochValidatorInfo,
    FinalExecutionOutcome,
    GasPrice,
    LightClientProof,
    LightClientProofRequest,
    NextLightClientBlockRequest,
    NextLightClientBlockResponse,
    NearProtocolConfig,
    NodeStatusResult,
    QueryResponseKind,
    type SerializedReturnValue,
    TypedError,
    AccessKeyViewRaw,
    AccessKeyView,
    FinalityReference,
    AccessKeyList,
    AccountView,
    AccountViewRaw,
    ContractCodeViewRaw,
    ContractCodeView,
    ContractStateView,
    CallContractViewFunctionResultRaw,
    ExecutionOutcomeReceiptDetail,
} from '@near-js/types';
import {
    encodeTransaction,
    SignedTransaction,
} from '@near-js/transactions';

import { Provider } from './provider';
import { ConnectionInfo, fetchJsonRpc, retryConfig } from './fetch_json';
import { TxExecutionStatus } from '@near-js/types';
import { PublicKey } from '@near-js/crypto';

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
}

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

    /**
     * @param connectionInfo Connection info
     */
    constructor(connectionInfo: ConnectionInfo, options?: Partial<RequestOptions>) {
        this.connection = connectionInfo || { url: '' };
        const defaultOptions: RequestOptions = {
            retries: REQUEST_RETRY_NUMBER,
            wait: REQUEST_RETRY_WAIT,
            backoff: REQUEST_RETRY_WAIT_BACKOFF
        };
        this.options = Object.assign({}, defaultOptions, options);
        this.networkId = undefined;
    }

    public async getNetworkId(): Promise<string> {
        if (this.networkId) return this.networkId;

        const { chain_id } = await this.viewNodeStatus();

        this.networkId = chain_id;

        return this.networkId;
    }

    public async getCurrentEpochSeatPrice(): Promise<bigint> {
        const { minimum_stake_ratio: minStakeRatio, protocol_version: protocolVersion } = await this.experimental_protocolConfig({ finality: DEFAULT_FINALITY });

        const { current_validators: currentValidators } = await this.viewValidators();

        // hard-coded in the protocol
        const maxNumberOfSeats = 300;

        return findSeatPrice(currentValidators, maxNumberOfSeats, minStakeRatio, protocolVersion);
    }

    public async getNextEpochSeatPrice(): Promise<bigint> {
        const { minimum_stake_ratio: minStakeRatio, protocol_version: protocolVersion } = await this.experimental_protocolConfig({ finality: DEFAULT_FINALITY });

        const { next_validators: nextValidators } = await this.viewValidators();

        // hard-coded in the protocol
        const maxNumberOfSeats = 300;

        return findSeatPrice(nextValidators, maxNumberOfSeats, minStakeRatio, protocolVersion);
    }

    public async viewAccessKey(
        accountId: string,
        publicKey: PublicKey | string,
        finalityQuery: FinalityReference = { finality: DEFAULT_FINALITY }
    ): Promise<AccessKeyView> {
        const data = await (this as Provider).query<AccessKeyViewRaw>({
            ...finalityQuery,
            request_type: 'view_access_key',
            account_id: accountId,
            public_key: publicKey.toString(),
        });

        return {
            ...data,
            nonce: BigInt(data.nonce),
        };
    }

    public async viewAccessKeyList(
        accountId: string,
        finalityQuery: FinalityReference = { finality: DEFAULT_FINALITY }
    ): Promise<AccessKeyList> {
        return (this as Provider).query<AccessKeyList>({
            ...finalityQuery,
            request_type: 'view_access_key_list',
            account_id: accountId,
        });
    }

    public async viewAccount(
        accountId: string,
        blockQuery: BlockReference = { finality: DEFAULT_FINALITY }
    ): Promise<AccountView> {
        const data = await (this as Provider).query<AccountViewRaw>({
            ...blockQuery,
            request_type: 'view_account',
            account_id: accountId,
        });

        return {
            ...data,
            amount: BigInt(data.amount),
            locked: BigInt(data.locked),
        };
    }

    public async viewContractCode(
        contractId: string,
        blockQuery: BlockReference = { finality: DEFAULT_FINALITY }
    ): Promise<ContractCodeView> {
        const data = await (this as Provider).query<ContractCodeViewRaw>({
            ...blockQuery,
            request_type: 'view_code',
            account_id: contractId,
        });

        return {
            ...data,
            code: new Uint8Array(Buffer.from(data.code_base64, 'base64')),
        };
    }

    public async viewContractState(
        contractId: string,
        prefix?: string,
        blockQuery: BlockReference = { finality: DEFAULT_FINALITY }
    ): Promise<ContractStateView> {
        const prefixBase64 = Buffer.from(prefix || '').toString('base64');

        return (this as Provider).query<ContractStateView>({
            ...blockQuery,
            request_type: 'view_state',
            account_id: contractId,
            prefix_base64: prefixBase64,
        });
    }

    public async callFunction<T extends SerializedReturnValue>(
        contractId: string,
        method: string,
        args: Record<string, unknown>,
        blockQuery: BlockReference = { finality: DEFAULT_FINALITY }
    ): Promise<T | undefined> {
        const { result } = await this.callFunctionRaw(
            contractId,
            method,
            args,
            blockQuery
        );

        if (result.length === 0) return undefined;

        const serializedResult = Buffer.from(result).toString();

        try {
            return JSON.parse(serializedResult) as T;
        } catch {
            return serializedResult as T;
        }
    }

    public async callFunctionRaw(
        contractId: string,
        method: string,
        args: Record<string, unknown>,
        blockQuery: BlockReference = { finality: DEFAULT_FINALITY }
    ): Promise<CallContractViewFunctionResultRaw> {
        const argsBase64 = Buffer.from(JSON.stringify(args)).toString('base64');

        return await (
            this as Provider
        ).query<CallContractViewFunctionResultRaw>({
            ...blockQuery,
            request_type: 'call_function',
            account_id: contractId,
            method_name: method,
            args_base64: argsBase64,
        });
    }

    public async viewBlock(blockQuery: BlockReference): Promise<BlockResult> {
        const { finality } = blockQuery as any;
        const { blockId } = blockQuery as any;
        return this.sendJsonRpc('block', { block_id: blockId, finality });
    }

    public async viewChunk(chunkId: ChunkId): Promise<ChunkResult> {
        return this.sendJsonRpc('chunk', [chunkId]);
    }

    public async viewGasPrice(blockId?: BlockId): Promise<GasPrice> {
        return this.sendJsonRpc('gas_price', [blockId || null]);
    }

    public async viewNodeStatus(): Promise<NodeStatusResult> {
        return this.sendJsonRpc('status', []);
    }

    public async viewValidators(
        blockId?: BlockId
    ): Promise<EpochValidatorInfo> {
        return this.sendJsonRpc('validators', [blockId || null]);
    }

    public async viewTransactionStatus(
        txHash: Uint8Array | string,
        accountId: string,
        waitUntil: TxExecutionStatus
    ): Promise<FinalExecutionOutcome> {
        const encodedTxHash =
            typeof txHash === 'string' ? txHash : baseEncode(txHash);

        return this.sendJsonRpc('tx', {
            tx_hash: encodedTxHash,
            sender_account_id: accountId,
            wait_until: waitUntil,
        });
    }

    public async viewTransactionStatusWithReceipts(
        txHash: Uint8Array | string,
        accountId: string,
        waitUntil: TxExecutionStatus
    ): Promise<
        FinalExecutionOutcome &
            Required<Pick<FinalExecutionOutcome, 'receipts'>>
    > {
        const encodedTxHash =
            typeof txHash === 'string' ? txHash : baseEncode(txHash);

        return this.sendJsonRpc('EXPERIMENTAL_tx_status', {
            tx_hash: encodedTxHash,
            sender_account_id: accountId,
            wait_until: waitUntil,
        });
    }

    public async viewTransactionReceipt(
        receiptId: string
    ): Promise<ExecutionOutcomeReceiptDetail> {
        return this.sendJsonRpc('EXPERIMENTAL_receipt', {
            receipt_id: receiptId,
        });
    }

    /**
     * Gets the RPC's status
     * @see [https://docs.near.org/docs/develop/front-end/rpc#general-validator-status](https://docs.near.org/docs/develop/front-end/rpc#general-validator-status)
     */
    async status(): Promise<NodeStatusResult> {
        return this.sendJsonRpc('status', []);
    }

    /**
     * Sends a signed transaction to the RPC
     *
     * @param signedTransaction The signed transaction being sent
     * @param waitUntil
     */
    async sendTransactionUntil(signedTransaction: SignedTransaction, waitUntil: TxExecutionStatus): Promise<FinalExecutionOutcome> {
        const bytes = encodeTransaction(signedTransaction);
        return this.sendJsonRpc('send_tx', { signed_tx_base64: Buffer.from(bytes).toString('base64'), wait_until: waitUntil });
    }

    /**
     * Sends a signed transaction to the RPC and waits until transaction is fully complete
     * @see [https://docs.near.org/docs/develop/front-end/rpc#send-transaction-await](https://docs.near.org/docs/develop/front-end/rpc#general-validator-status)
     *
     * @param signedTransaction The signed transaction being sent
     */
    async sendTransaction(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome> {
        return this.sendTransactionUntil(signedTransaction, 'EXECUTED_OPTIMISTIC');
    }

    /**
     * Sends a signed transaction to the RPC and immediately returns transaction hash
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#send-transaction-async)
     * @param signedTransaction The signed transaction being sent
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async sendTransactionAsync(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome> {
        return this.sendTransactionUntil(signedTransaction, 'NONE');
    }

    /**
     * Gets a transaction's status from the RPC
     * @see [https://docs.near.org/docs/develop/front-end/rpc#transaction-status](https://docs.near.org/docs/develop/front-end/rpc#general-validator-status)
     *
     * @param txHash A transaction hash as either a Uint8Array or a base58 encoded string
     * @param accountId The NEAR account that signed the transaction
     * @param waitUntil
     */
    async txStatus(txHash: Uint8Array | string, accountId: string, waitUntil: TxExecutionStatus = 'EXECUTED_OPTIMISTIC'): Promise<FinalExecutionOutcome> {
        if (typeof txHash === 'string') {
            return this.txStatusString(txHash, accountId, waitUntil);
        } else {
            return this.txStatusUint8Array(txHash, accountId, waitUntil);
        }
    }

    private async txStatusUint8Array(txHash: Uint8Array, accountId: string, waitUntil: TxExecutionStatus): Promise<FinalExecutionOutcome> {
        return this.sendJsonRpc('tx', { tx_hash: baseEncode(txHash), sender_account_id: accountId, wait_until: waitUntil });
    }

    private async txStatusString(txHash: string, accountId: string, waitUntil: string): Promise<FinalExecutionOutcome> {
        return this.sendJsonRpc('tx', { tx_hash: txHash, sender_account_id: accountId, wait_until: waitUntil });
    }

    /**
     * Gets a transaction's status from the RPC with receipts
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#transaction-status-with-receipts)
     * @param txHash The hash of the transaction
     * @param accountId The NEAR account that signed the transaction
     * @param waitUntil
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async txStatusReceipts(txHash: Uint8Array | string, accountId: string, waitUntil: TxExecutionStatus = 'EXECUTED_OPTIMISTIC'): Promise<FinalExecutionOutcome> {
        if (typeof txHash === 'string') {
            return this.sendJsonRpc('EXPERIMENTAL_tx_status', { tx_hash: txHash, sender_account_id: accountId, wait_until: waitUntil });
        }
        else {
            return this.sendJsonRpc('EXPERIMENTAL_tx_status', { tx_hash: baseEncode(txHash), sender_account_id: accountId, wait_until: waitUntil });
        }
    }

    /**
     * Query the RPC by passing an {@link "@near-js/types".provider/request.RpcQueryRequest | RpcQueryRequest }
     * @see [https://docs.near.org/api/rpc/contracts](https://docs.near.org/api/rpc/contracts)
     *
     * @typeParam T the shape of the returned query response
     */
    async query<T extends QueryResponseKind>(...args: any[]): Promise<T> {
        let result;
        if (args.length === 1) {
            const { block_id, blockId, ...otherParams } = args[0];
            result = await this.sendJsonRpc<T>('query', { ...otherParams, block_id: block_id || blockId });
        } else {
            const [path, data] = args;
            result = await this.sendJsonRpc<T>('query', [path, data]);
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
     * Query for block info from the RPC
     * pass block_id OR finality as blockQuery, not both
     * @see [https://docs.near.org/api/rpc/block-chunk](https://docs.near.org/api/rpc/block-chunk)
     *
     * @param blockQuery {@link BlockReference} (passing a {@link BlockId} is deprecated)
     */
    async block(blockQuery: BlockId | BlockReference): Promise<BlockResult> {
        const { finality } = blockQuery as any;
        const { blockId } = blockQuery as any;
        return this.sendJsonRpc('block', { block_id: blockId, finality });
    }

    /**
     * Query changes in block from the RPC
     * pass block_id OR finality as blockQuery, not both
     * @see [https://docs.near.org/api/rpc/block-chunk](https://docs.near.org/api/rpc/block-chunk)
     */
    async blockChanges(blockQuery: BlockReference): Promise<BlockChangeResult> {
        const { finality } = blockQuery as any;
        const { blockId } = blockQuery as any;
        return this.sendJsonRpc('EXPERIMENTAL_changes_in_block', { block_id: blockId, finality });
    }

    /**
     * Queries for details about a specific chunk appending details of receipts and transactions to the same chunk data provided by a block
     * @see [https://docs.near.org/api/rpc/block-chunk](https://docs.near.org/api/rpc/block-chunk)
     *
     * @param chunkId Hash of a chunk ID or shard ID
     */
    async chunk(chunkId: ChunkId): Promise<ChunkResult> {
        return this.sendJsonRpc('chunk', [chunkId]);
    }

    /**
     * Query validators of the epoch defined by the given block id.
     * @see [https://docs.near.org/api/rpc/network#validation-status](https://docs.near.org/api/rpc/network#validation-status)
     *
     * @param blockId Block hash or height, or null for latest.
     */
    async validators(blockId: BlockId | null): Promise<EpochValidatorInfo> {
        return this.sendJsonRpc('validators', [blockId]);
    }

    /**
     * Gets the protocol config at a block from RPC
     *
     * @param blockReference specifies the block to get the protocol config for
     */
    async experimental_protocolConfig(blockReference: BlockReference | { sync_checkpoint: 'genesis' }): Promise<NearProtocolConfig> {
        const { blockId, ...otherParams } = blockReference as any;
        return await this.sendJsonRpc('EXPERIMENTAL_protocol_config', { ...otherParams, block_id: blockId });
    }

    /**
     * Gets a light client execution proof for verifying execution outcomes
     * @see [https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof](https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof)
     */
    async lightClientProof(request: LightClientProofRequest): Promise<LightClientProof> {
        return await this.sendJsonRpc('EXPERIMENTAL_light_client_proof', request);
    }

    /**
     * Returns the next light client block as far in the future as possible from the last known hash
     * to still be able to validate from that hash. This will either return the last block of the
     * next epoch, or the last final known block.
     * 
     * @see [https://github.com/near/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-block](https://github.com/near/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-block)
     */
    async nextLightClientBlock(request: NextLightClientBlockRequest): Promise<NextLightClientBlockResponse> {
        return await this.sendJsonRpc('next_light_client_block', request);
    }

    /**
     * Gets access key changes for a given array of accountIds
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-all)
     * @returns {Promise<ChangeResult>}
     */
    async accessKeyChanges(accountIdArray: string[], blockQuery: BlockReference): Promise<ChangeResult> {
        const { finality } = blockQuery as any;
        const { blockId } = blockQuery as any;
        return this.sendJsonRpc('EXPERIMENTAL_changes', {
            changes_type: 'all_access_key_changes',
            account_ids: accountIdArray,
            block_id: blockId,
            finality
        });
    }

    /**
     * Gets single access key changes for a given array of access keys
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-single)
     * @returns {Promise<ChangeResult>}
     */
    async singleAccessKeyChanges(accessKeyArray: AccessKeyWithPublicKey[], blockQuery: BlockReference): Promise<ChangeResult> {
        const { finality } = blockQuery as any;
        const { blockId } = blockQuery as any;
        return this.sendJsonRpc('EXPERIMENTAL_changes', {
            changes_type: 'single_access_key_changes',
            keys: accessKeyArray,
            block_id: blockId,
            finality
        });
    }

    /**
     * Gets account changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-account-changes)
     * @returns {Promise<ChangeResult>}
     */
    async accountChanges(accountIdArray: string[], blockQuery: BlockReference): Promise<ChangeResult> {
        const { finality } = blockQuery as any;
        const { blockId } = blockQuery as any;
        return this.sendJsonRpc('EXPERIMENTAL_changes', {
            changes_type: 'account_changes',
            account_ids: accountIdArray,
            block_id: blockId,
            finality
        });
    }

    /**
     * Gets contract state changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * Note: If you pass a keyPrefix it must be base64 encoded
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-state-changes)
     * @returns {Promise<ChangeResult>}
     */
    async contractStateChanges(accountIdArray: string[], blockQuery: BlockReference, keyPrefix = ''): Promise<ChangeResult> {
        const { finality } = blockQuery as any;
        const { blockId } = blockQuery as any;
        return this.sendJsonRpc('EXPERIMENTAL_changes', {
            changes_type: 'data_changes',
            account_ids: accountIdArray,
            key_prefix_base64: keyPrefix,
            block_id: blockId,
            finality
        });
    }

    /**
     * Gets contract code changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * Note: Change is returned in a base64 encoded WASM file
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-code-changes)
     * @returns {Promise<ChangeResult>}
     */
    async contractCodeChanges(accountIdArray: string[], blockQuery: BlockReference): Promise<ChangeResult> {
        const { finality } = blockQuery as any;
        const { blockId } = blockQuery as any;
        return this.sendJsonRpc('EXPERIMENTAL_changes', {
            changes_type: 'contract_code_changes',
            account_ids: accountIdArray,
            block_id: blockId,
            finality
        });
    }

    /**
     * Returns gas price for a specific block_height or block_hash.
     * @see [https://docs.near.org/api/rpc/gas](https://docs.near.org/api/rpc/gas)
     *
     * @param blockId Block hash or height, or null for latest.
     */
    async gasPrice(blockId: BlockId | null): Promise<GasPrice> {
        return await this.sendJsonRpc('gas_price', [blockId]);
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
            id: (_nextId++),
            jsonrpc: '2.0'
        };
        const response = await fetchJsonRpc(this.connection.url, request, this.connection.headers || {}, retryConfig(this.options.retries, this.options.backoff, this.options.wait));
        if (response.error) {
            if (typeof response.error.data === 'object') {
                if (typeof response.error.data.error_message === 'string' && typeof response.error.data.error_type === 'string') {
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
                `Exceeded ${this.options.retries} attempts for request to ${method}.`, 'RetriesExceeded');
        }
        return result;
    }
}
