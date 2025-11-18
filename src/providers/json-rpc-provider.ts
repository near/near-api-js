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
} from '../utils';
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
    AccessKeyList,
    AccountView,
    AccountViewRaw,
    ContractCodeViewRaw,
    ContractCodeView,
    ContractStateView,
    CallContractViewFunctionResultRaw,
    ExecutionOutcomeReceiptDetail,
} from '../types';
import {
    encodeTransaction,
    SignedTransaction,
} from '../transactions';

import { Provider } from './provider';
import { ConnectionInfo, fetchJsonRpc, retryConfig } from './fetch_json';
import { TxExecutionStatus } from '../types';

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
        const { minimum_stake_ratio: minStakeRatio, protocol_version: protocolVersion } = await this.experimental_protocolConfig({ blockReference: { finality: DEFAULT_FINALITY } });

        const { current_validators: currentValidators } = await this.viewValidatorsV2(null);

        // hard-coded in the protocol
        const maxNumberOfSeats = 300;

        return findSeatPrice(currentValidators, maxNumberOfSeats, minStakeRatio, protocolVersion);
    }

    public async getNextEpochSeatPrice(): Promise<bigint> {
        const { minimum_stake_ratio: minStakeRatio, protocol_version: protocolVersion } = await this.experimental_protocolConfig({ blockReference: { finality: DEFAULT_FINALITY } });

        const { next_validators: nextValidators } = await this.viewValidatorsV2(null);

        // hard-coded in the protocol
        const maxNumberOfSeats = 300;

        return findSeatPrice(nextValidators, maxNumberOfSeats, minStakeRatio, protocolVersion);
    }

    public async viewAccessKey({
        accountId,
        publicKey,
        finalityQuery = { finality: DEFAULT_FINALITY }
    }: import('./provider').ViewAccessKeyParams): Promise<AccessKeyView> {
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

    public async viewAccessKeyList({
        accountId,
        finalityQuery = { finality: DEFAULT_FINALITY }
    }: import('./provider').ViewAccessKeyListParams): Promise<AccessKeyList> {
        return (this as Provider).query<AccessKeyList>({
            ...finalityQuery,
            request_type: 'view_access_key_list',
            account_id: accountId,
        });
    }

    public async viewAccount({
        accountId,
        blockQuery = { finality: DEFAULT_FINALITY }
    }: import('./provider').ViewAccountParams): Promise<AccountView> {
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

    public async viewContractCode({
        contractId,
        blockQuery = { finality: DEFAULT_FINALITY }
    }: import('./provider').ViewContractCodeParams): Promise<ContractCodeView> {
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

    public async viewContractState({
        contractId,
        prefix,
        blockQuery = { finality: DEFAULT_FINALITY }
    }: import('./provider').ViewContractStateParams): Promise<ContractStateView> {
        const prefixBase64 = Buffer.from(prefix || '').toString('base64');

        return (this as Provider).query<ContractStateView>({
            ...blockQuery,
            request_type: 'view_state',
            account_id: contractId,
            prefix_base64: prefixBase64,
        });
    }

    public async callFunction<T extends SerializedReturnValue>({
        contractId,
        method,
        args,
        blockQuery = { finality: DEFAULT_FINALITY }
    }: import('./provider').CallFunctionParams): Promise<T | undefined> {
        const { result } = await this.callFunctionRaw({
            contractId,
            method,
            args,
            blockQuery
        });

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
        blockQuery = { finality: DEFAULT_FINALITY }
    }: import('./provider').CallFunctionParams): Promise<CallContractViewFunctionResultRaw> {
        const argsBuffer = ArrayBuffer.isView(args) ? Buffer.from(args as Uint8Array) : Buffer.from(JSON.stringify(args));
        const argsBase64 = argsBuffer.toString('base64');

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

    public async viewBlock({ blockQuery }: { blockQuery: BlockReference }): Promise<BlockResult> {
        const { finality } = blockQuery as any;
        const { blockId } = blockQuery as any;
        return this.sendJsonRpc('block', { block_id: blockId, finality });
    }

    public async viewChunk({ chunkId }: { chunkId: ChunkId }): Promise<ChunkResult> {
        return this.sendJsonRpc('chunk', [chunkId]);
    }

    public async viewGasPrice(params?: { blockId?: BlockId }): Promise<GasPrice> {
        return this.sendJsonRpc('gas_price', [params?.blockId || null]);
    }

    public async viewNodeStatus(): Promise<NodeStatusResult> {
        return this.sendJsonRpc('status', []);
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
    public async viewValidatorsV2(params: { blockId: string | number } | { epochId: string } | null): Promise<EpochValidatorInfo> {
        if (params === null) return this.sendJsonRpc('validators', [null]);

        if (typeof params === 'object' && 'blockId' in params) return this.sendJsonRpc('validators', { block_id: params.blockId });

        if (typeof params === 'object' && 'epochId' in params) return this.sendJsonRpc('validators', { epoch_id: params.epochId });

        throw new Error('Invalid parameters for validatorsV2');
    }

    public async viewTransactionStatus({
        txHash,
        accountId,
        waitUntil
    }: { txHash: Uint8Array | string; accountId: string; waitUntil: TxExecutionStatus }): Promise<FinalExecutionOutcome> {
        const encodedTxHash =
            typeof txHash === 'string' ? txHash : baseEncode(txHash);

        return this.sendJsonRpc('tx', {
            tx_hash: encodedTxHash,
            sender_account_id: accountId,
            wait_until: waitUntil,
        });
    }

    public async viewTransactionStatusWithReceipts({
        txHash,
        accountId,
        waitUntil
    }: { txHash: Uint8Array | string; accountId: string; waitUntil: TxExecutionStatus }): Promise<
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

    public async viewTransactionReceipt({
        receiptId
    }: { receiptId: string }): Promise<ExecutionOutcomeReceiptDetail> {
        return this.sendJsonRpc('EXPERIMENTAL_receipt', {
            receipt_id: receiptId,
        });
    }

    /**
     * Sends a signed transaction to the RPC
     *
     * @param params Object containing signedTransaction and waitUntil
     */
    async sendTransactionUntil({ signedTransaction, waitUntil }: { signedTransaction: SignedTransaction; waitUntil: TxExecutionStatus }): Promise<FinalExecutionOutcome> {
        const bytes = encodeTransaction(signedTransaction);
        return this.sendJsonRpc('send_tx', { signed_tx_base64: Buffer.from(bytes).toString('base64'), wait_until: waitUntil });
    }

    /**
     * Sends a signed transaction to the RPC and waits until transaction is fully complete
     * @see [https://docs.near.org/docs/develop/front-end/rpc#send-transaction-await](https://docs.near.org/docs/develop/front-end/rpc#general-validator-status)
     *
     * @param params Object containing signedTransaction
     */
    async sendTransaction({ signedTransaction }: { signedTransaction: SignedTransaction }): Promise<FinalExecutionOutcome> {
        return this.sendTransactionUntil({ signedTransaction, waitUntil: 'EXECUTED_OPTIMISTIC' });
    }

    /**
     * Sends a signed transaction to the RPC and immediately returns transaction hash
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#send-transaction-async)
     * @param params Object containing signedTransaction
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async sendTransactionAsync({ signedTransaction }: { signedTransaction: SignedTransaction }): Promise<FinalExecutionOutcome> {
        return this.sendTransactionUntil({ signedTransaction, waitUntil: 'NONE' });
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
     * Query changes in block from the RPC
     * pass block_id OR finality as blockQuery, not both
     * @see [https://docs.near.org/api/rpc/block-chunk](https://docs.near.org/api/rpc/block-chunk)
     */
    async blockChanges({ blockQuery }: { blockQuery: BlockId | BlockReference }): Promise<BlockChangeResult> {
        const { finality } = blockQuery as any;
        const { blockId } = blockQuery as any;
        return this.sendJsonRpc('EXPERIMENTAL_changes_in_block', { block_id: blockId, finality });
    }

    /**
     * Gets the protocol config at a block from RPC
     *
     * @param params Object containing blockReference which specifies the block to get the protocol config for
     */
    async experimental_protocolConfig({ blockReference }: { blockReference: BlockReference | { sync_checkpoint: 'genesis' } }): Promise<NearProtocolConfig> {
        const { blockId, ...otherParams } = blockReference as any;
        return await this.sendJsonRpc('EXPERIMENTAL_protocol_config', { ...otherParams, block_id: blockId });
    }

    /**
     * Gets a light client execution proof for verifying execution outcomes
     * @see [https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof](https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof)
     */
    async lightClientProof({ request }: { request: LightClientProofRequest }): Promise<LightClientProof> {
        return await this.sendJsonRpc('EXPERIMENTAL_light_client_proof', request);
    }

    /**
     * Returns the next light client block as far in the future as possible from the last known hash
     * to still be able to validate from that hash. This will either return the last block of the
     * next epoch, or the last final known block.
     *
     * @see [https://github.com/near/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-block](https://github.com/near/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-block)
     */
    async nextLightClientBlock({ request }: { request: NextLightClientBlockRequest }): Promise<NextLightClientBlockResponse> {
        return await this.sendJsonRpc('next_light_client_block', request);
    }

    /**
     * Gets access key changes for a given array of accountIds
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-all)
     * @returns {Promise<ChangeResult>}
     */
    async accessKeyChanges({ accountIdArray, blockQuery }: { accountIdArray: string[]; blockQuery: BlockId | BlockReference }): Promise<ChangeResult> {
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
    async singleAccessKeyChanges({ accessKeyArray, blockQuery }: { accessKeyArray: AccessKeyWithPublicKey[]; blockQuery: BlockId | BlockReference }): Promise<ChangeResult> {
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
    async accountChanges({ accountIdArray, blockQuery }: { accountIdArray: string[]; blockQuery: BlockId | BlockReference }): Promise<ChangeResult> {
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
    async contractStateChanges({ accountIdArray, blockQuery, keyPrefix = '' }: { accountIdArray: string[]; blockQuery: BlockId | BlockReference; keyPrefix?: string }): Promise<ChangeResult> {
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
    async contractCodeChanges({ accountIdArray, blockQuery }: { accountIdArray: string[]; blockQuery: BlockId | BlockReference }): Promise<ChangeResult> {
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
