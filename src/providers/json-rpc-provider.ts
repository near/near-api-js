/**
 * @module
 * This module contains the {@link JsonRpcProvider} client class
 * which can be used to interact with the [NEAR RPC API](https://docs.near.org/api/rpc/introduction).
 * @see {@link "@near-js/types".provider | provider} for a list of request and response types
 */

import type {
    AccessKeyList,
    AccessKeyView,
    AccountView,
    CallResult,
    CryptoHash,
    ContractCodeView as RawContractCodeView,
    RpcBlockResponse,
    RpcChunkResponse,
    RpcGasPriceResponse,
    RpcLightClientExecutionProofResponse,
    RpcLightClientNextBlockResponse,
    RpcProtocolConfigResponse,
    RpcQueryRequest,
    RpcQueryResponse,
    RpcReceiptResponse,
    RpcStateChangesInBlockByTypeResponse,
    RpcStateChangesInBlockResponse,
    RpcStatusResponse,
    RpcTransactionResponse,
    RpcValidatorResponse,
    ViewStateResult,
} from '../rpc/index.js';
import { encodeTransaction, type SignedTransaction } from '../transactions/index.js';
import {
    type AccessKeyWithPublicKey,
    type BlockId,
    type BlockReference,
    type ChunkId,
    type Finality,
    type LightClientProofRequest,
    type NextLightClientBlockRequest,
    type SerializedReturnValue,
    type TxExecutionStatus,
    TypedError,
} from '../types/index.js';
import { baseEncode, findSeatPrice } from '../utils/index.js';
import { parseRpcError, parseRpcErrorMessage } from './errors/parse.js';
import { RpcError } from './errors/rpc.js';
import { type ConnectionInfo, fetchJsonRpc, retryConfig } from './fetch_json.js';
import type { Methods } from './methods.js';
import type {
    CallFunctionArgs,
    Provider,
    ViewAccessKeyArgs,
    ViewAccessKeyListArgs,
    ViewAccountArgs,
    ViewContractCodeArgs,
    ViewContractStateArgs,
    ViewGlobalContractCodeArgs,
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
    }

    public async getNetworkId(): Promise<string> {
        if (this.networkId) return this.networkId;

        const { chain_id } = await this.viewNodeStatus();

        this.networkId = chain_id;

        return this.networkId;
    }

    public async getCurrentEpochSeatPrice(): Promise<bigint> {
        const { minimum_stake_ratio: minStakeRatio, protocol_version: protocolVersion } =
            await this.experimental_protocolConfig({ finality: DEFAULT_FINALITY });

        if (!Array.isArray(minStakeRatio))
            throw new Error('minimum_stake_ratio is not available on this protocol version');

        const { current_validators: currentValidators } = await this.viewValidators();

        // hard-coded in the protocol
        const maxNumberOfSeats = 300;

        return findSeatPrice(currentValidators, maxNumberOfSeats, minStakeRatio, protocolVersion);
    }

    public async getNextEpochSeatPrice(): Promise<bigint> {
        const { minimum_stake_ratio: minStakeRatio, protocol_version: protocolVersion } =
            await this.experimental_protocolConfig({ finality: DEFAULT_FINALITY });

        if (!Array.isArray(minStakeRatio))
            throw new Error('minimum_stake_ratio is not available on this protocol version');

        const { next_validators: nextValidators } = await this.viewValidators();

        // hard-coded in the protocol
        const maxNumberOfSeats = 300;

        return findSeatPrice(nextValidators, maxNumberOfSeats, minStakeRatio, protocolVersion);
    }

    public async viewAccessKey({
        accountId,
        publicKey,
        finalityQuery = { finality: DEFAULT_FINALITY },
    }: ViewAccessKeyArgs) {
        const data = await this.query<AccessKeyView>({
            finality: finalityQuery.finality,
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
        finalityQuery = { finality: DEFAULT_FINALITY },
    }: ViewAccessKeyListArgs) {
        return this.query<AccessKeyList>({
            finality: finalityQuery.finality,
            request_type: 'view_access_key_list',
            account_id: accountId,
        });
    }

    public async viewAccount({ accountId, blockQuery = { finality: DEFAULT_FINALITY } }: ViewAccountArgs) {
        let reference: { block_id: BlockId } | { finality: Finality };

        if ('blockId' in blockQuery) {
            reference = { block_id: blockQuery.blockId };
        } else if ('finality' in blockQuery) {
            reference = { finality: blockQuery.finality };
        } else {
            throw new Error('Either blockId or finality must be provided in blockQuery');
        }

        const data = await this.query<AccountView>({
            ...reference,
            request_type: 'view_account',
            account_id: accountId,
        });

        return {
            ...data,
            amount: BigInt(data.amount),
            locked: BigInt(data.locked),
        };
    }

    public async viewContractCode({ contractId, blockQuery = { finality: DEFAULT_FINALITY } }: ViewContractCodeArgs) {
        let reference: { block_id: BlockId } | { finality: Finality };

        if ('blockId' in blockQuery) {
            reference = { block_id: blockQuery.blockId };
        } else if ('finality' in blockQuery) {
            reference = { finality: blockQuery.finality };
        } else {
            throw new Error('Either blockId or finality must be provided in blockQuery');
        }

        const data = await this.query<RawContractCodeView>({
            ...reference,
            request_type: 'view_code',
            account_id: contractId,
        });

        return {
            ...data,
            code: new Uint8Array(Buffer.from(data.code_base64, 'base64')),
        };
    }

    public async viewGlobalContractCode({
        identifier,
        blockQuery = { finality: DEFAULT_FINALITY },
    }: ViewGlobalContractCodeArgs) {
        let data: RawContractCodeView & {
            block_hash: CryptoHash;
            block_height: number;
        };

        let reference: { block_id: BlockId } | { finality: Finality };

        if ('blockId' in blockQuery) {
            reference = { block_id: blockQuery.blockId };
        } else if ('finality' in blockQuery) {
            reference = { finality: blockQuery.finality };
        } else {
            throw new Error('Either blockId or finality must be provided in blockQuery');
        }

        if ('codeHash' in identifier) {
            data = await this.query<RawContractCodeView>({
                ...reference,
                request_type: 'view_global_contract_code',
                code_hash:
                    typeof identifier.codeHash === 'string'
                        ? identifier.codeHash
                        : Buffer.from(identifier.codeHash).toString('hex'),
            });
        } else if ('accountId' in identifier) {
            data = await this.query<RawContractCodeView>({
                ...reference,
                request_type: 'view_global_contract_code_by_account_id',
                account_id: identifier.accountId,
            });
        } else {
            throw new Error('Either "codeHash", or "accountId" must be provided in identifier');
        }

        return {
            ...data,
            code: new Uint8Array(Buffer.from(data.code_base64, 'base64')),
        };
    }

    public async viewContractState({
        contractId,
        prefix,
        blockQuery = { finality: DEFAULT_FINALITY },
    }: ViewContractStateArgs) {
        const prefixBase64 = Buffer.from(prefix || '').toString('base64');

        let reference: { block_id: BlockId } | { finality: Finality };

        if ('blockId' in blockQuery) {
            reference = { block_id: blockQuery.blockId };
        } else if ('finality' in blockQuery) {
            reference = { finality: blockQuery.finality };
        } else {
            throw new Error('Either blockId or finality must be provided in blockQuery');
        }

        return await this.query<ViewStateResult>({
            ...reference,
            request_type: 'view_state',
            account_id: contractId,
            prefix_base64: prefixBase64,
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

        if ('blockId' in blockQuery) {
            return this.query<CallResult>({
                request_type: 'call_function',
                account_id: contractId,
                method_name: method,
                args_base64: argsBase64,
                block_id: blockQuery.blockId,
            });
        } else if ('finality' in blockQuery) {
            return this.query<CallResult>({
                request_type: 'call_function',
                account_id: contractId,
                method_name: method,
                args_base64: argsBase64,
                finality: blockQuery.finality,
            });
        } else {
            throw new Error('Either blockId or finality must be provided in blockQuery');
        }
    }

    public async viewBlock(blockQuery: BlockReference): Promise<RpcBlockResponse> {
        const { finality } = blockQuery as any;
        const { blockId } = blockQuery as any;
        return this.sendJsonRpc('block', { block_id: blockId, finality });
    }

    public async viewChunk(chunkId: ChunkId): Promise<RpcChunkResponse> {
        return this.sendJsonRpc('chunk', [chunkId]);
    }

    public async viewGasPrice(blockId?: BlockId): Promise<RpcGasPriceResponse> {
        return this.sendJsonRpc('gas_price', [blockId || null]);
    }

    public async viewNodeStatus(): Promise<RpcStatusResponse> {
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
    public async viewValidators(params?: ViewValidatorsArgs): Promise<RpcValidatorResponse> {
        if (typeof params === 'undefined') return this.sendJsonRpc('validators', [null]);

        if (typeof params === 'object' && 'blockId' in params)
            return this.sendJsonRpc('validators', { block_id: params.blockId });

        if (typeof params === 'object' && 'epochId' in params)
            return this.sendJsonRpc('validators', { epoch_id: params.epochId });

        throw new Error('Invalid parameters for validators');
    }

    public async viewTransactionStatus({
        txHash,
        accountId,
        waitUntil = 'EXECUTED_OPTIMISTIC',
    }: ViewTransactionStatusArgs): Promise<RpcTransactionResponse> {
        const encodedTxHash = typeof txHash === 'string' ? txHash : baseEncode(txHash);

        return this.sendJsonRpc('tx', {
            tx_hash: encodedTxHash,
            sender_account_id: accountId,
            wait_until: waitUntil,
        });
    }

    public async viewTransactionStatusWithReceipts({
        txHash,
        accountId,
        waitUntil = 'EXECUTED_OPTIMISTIC',
    }: ViewTransactionStatusArgs): Promise<RpcTransactionResponse> {
        const encodedTxHash = typeof txHash === 'string' ? txHash : baseEncode(txHash);

        return this.sendJsonRpc('EXPERIMENTAL_tx_status', {
            tx_hash: encodedTxHash,
            sender_account_id: accountId,
            wait_until: waitUntil,
        });
    }

    public async viewTransactionReceipt(receiptId: string): Promise<RpcReceiptResponse> {
        return this.sendJsonRpc('EXPERIMENTAL_receipt', {
            receipt_id: receiptId,
        });
    }

    /**
     * Sends a signed transaction to the RPC
     *
     * @param signedTransaction The signed transaction being sent
     * @param waitUntil
     */
    async sendTransactionUntil(
        signedTransaction: SignedTransaction,
        waitUntil: TxExecutionStatus
    ): Promise<RpcTransactionResponse> {
        const bytes = encodeTransaction(signedTransaction);
        return this.sendJsonRpc('send_tx', {
            signed_tx_base64: Buffer.from(bytes).toString('base64'),
            wait_until: waitUntil,
        });
    }

    /**
     * Sends a signed transaction to the RPC and waits until transaction is fully complete
     * @see [https://docs.near.org/docs/develop/front-end/rpc#send-transaction-await](https://docs.near.org/docs/develop/front-end/rpc#general-validator-status)
     *
     * @param signedTransaction The signed transaction being sent
     */
    async sendTransaction(signedTransaction: SignedTransaction): Promise<RpcTransactionResponse> {
        return this.sendTransactionUntil(signedTransaction, 'EXECUTED_OPTIMISTIC');
    }

    /**
     * Sends a signed transaction to the RPC and immediately returns transaction hash
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#send-transaction-async)
     * @param signedTransaction The signed transaction being sent
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async sendTransactionAsync(signedTransaction: SignedTransaction): Promise<RpcTransactionResponse> {
        return this.sendTransactionUntil(signedTransaction, 'NONE');
    }

    /**
     * Query the RPC by passing an {@link RpcQueryRequest }
     * @see [https://docs.near.org/api/rpc/contracts](https://docs.near.org/api/rpc/contracts)
     *
     */
    async query<R extends Omit<RpcQueryResponse, 'block_hash' | 'block_height'>>(
        params: RpcQueryRequest
    ): Promise<
        R & {
            block_hash: CryptoHash;
            block_height: number;
        }
    > {
        return this.sendJsonRpc('query', params);
    }

    /**
     * Query changes in block from the RPC
     * pass block_id OR finality as blockQuery, not both
     * @see [https://docs.near.org/api/rpc/block-chunk](https://docs.near.org/api/rpc/block-chunk)
     */
    async blockChanges(blockQuery: BlockReference): Promise<RpcStateChangesInBlockByTypeResponse> {
        const { finality } = blockQuery as any;
        const { blockId } = blockQuery as any;
        return this.sendJsonRpc('EXPERIMENTAL_changes_in_block', { block_id: blockId, finality });
    }

    /**
     * Gets the protocol config at a block from RPC
     *
     * @param blockReference specifies the block to get the protocol config for
     */
    async experimental_protocolConfig(
        blockReference: BlockReference | { sync_checkpoint: 'genesis' }
    ): Promise<RpcProtocolConfigResponse> {
        const { blockId, ...otherParams } = blockReference as any;
        return await this.sendJsonRpc('EXPERIMENTAL_protocol_config', { ...otherParams, block_id: blockId });
    }

    /**
     * Gets a light client execution proof for verifying execution outcomes
     * @see [https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof](https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof)
     */
    async lightClientProof(request: LightClientProofRequest): Promise<RpcLightClientExecutionProofResponse> {
        return await this.sendJsonRpc('EXPERIMENTAL_light_client_proof', request);
    }

    /**
     * Returns the next light client block as far in the future as possible from the last known hash
     * to still be able to validate from that hash. This will either return the last block of the
     * next epoch, or the last final known block.
     *
     * @see [https://github.com/near/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-block](https://github.com/near/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-block)
     */
    async nextLightClientBlock(request: NextLightClientBlockRequest): Promise<RpcLightClientNextBlockResponse> {
        return await this.sendJsonRpc('next_light_client_block', request);
    }

    /**
     * Gets access key changes for a given array of accountIds
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-all)
     */
    async accessKeyChanges(
        accountIdArray: string[],
        blockQuery: BlockReference
    ): Promise<RpcStateChangesInBlockResponse> {
        const { finality } = blockQuery as any;
        const { blockId } = blockQuery as any;
        return this.sendJsonRpc('EXPERIMENTAL_changes', {
            changes_type: 'all_access_key_changes',
            account_ids: accountIdArray,
            block_id: blockId,
            finality,
        });
    }

    /**
     * Gets single access key changes for a given array of access keys
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-single)
     */
    async singleAccessKeyChanges(
        accessKeyArray: AccessKeyWithPublicKey[],
        blockQuery: BlockReference
    ): Promise<RpcStateChangesInBlockResponse> {
        const { finality } = blockQuery as any;
        const { blockId } = blockQuery as any;
        return this.sendJsonRpc('EXPERIMENTAL_changes', {
            changes_type: 'single_access_key_changes',
            keys: accessKeyArray,
            block_id: blockId,
            finality,
        });
    }

    /**
     * Gets account changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-account-changes)
     */
    async accountChanges(
        accountIdArray: string[],
        blockQuery: BlockReference
    ): Promise<RpcStateChangesInBlockResponse> {
        const { finality } = blockQuery as any;
        const { blockId } = blockQuery as any;
        return this.sendJsonRpc('EXPERIMENTAL_changes', {
            changes_type: 'account_changes',
            account_ids: accountIdArray,
            block_id: blockId,
            finality,
        });
    }

    /**
     * Gets contract state changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * Note: If you pass a keyPrefix it must be base64 encoded
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-state-changes)
     */
    async contractStateChanges(
        accountIdArray: string[],
        blockQuery: BlockReference,
        keyPrefix = ''
    ): Promise<RpcStateChangesInBlockResponse> {
        const { finality } = blockQuery as any;
        const { blockId } = blockQuery as any;
        return this.sendJsonRpc('EXPERIMENTAL_changes', {
            changes_type: 'data_changes',
            account_ids: accountIdArray,
            key_prefix_base64: keyPrefix,
            block_id: blockId,
            finality,
        });
    }

    /**
     * Gets contract code changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * Note: Change is returned in a base64 encoded WASM file
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-code-changes)
     */
    async contractCodeChanges(
        accountIdArray: string[],
        blockQuery: BlockReference
    ): Promise<RpcStateChangesInBlockResponse> {
        const { finality } = blockQuery as any;
        const { blockId } = blockQuery as any;
        return this.sendJsonRpc('EXPERIMENTAL_changes', {
            changes_type: 'contract_code_changes',
            account_ids: accountIdArray,
            block_id: blockId,
            finality,
        });
    }

    /**
     * Directly call the RPC specifying the method and params
     *
     * @param method RPC method
     * @param params Parameters to the method
     */
    async sendJsonRpc<
        Method extends keyof Methods,
        Params = Methods[Method]['request']['params'],
        Result = Extract<Methods[Method]['response'], { result: object }>['result'],
    >(method: Method, params: Params): Promise<Result> {
        const request = {
            method,
            params,
            id: String(_nextId++),
            jsonrpc: '2.0',
        };
        const response = await fetchJsonRpc(
            this.connection.url,
            request as Methods[Method]['request'],
            this.connection.headers || {},
            retryConfig(this.options.retries, this.options.backoff, this.options.wait)
        );
        if ('error' in response && typeof response.error !== 'undefined') {
            throw parseRpcError(response.error);
        }

        if (!('result' in response)) {
            throw new Error(`JSON RPC response must include either "result", or "error" property`);
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

        // "null" is a valid result that shouldn't be treated as error
        if (response.result === null) return null as Result;

        if (
            typeof response.result === 'object' &&
            'error' in response.result &&
            typeof response.result.error === 'string'
        ) {
            if ('block_hash' in response.result && 'block_height' in response.result) {
                throw parseRpcErrorMessage(
                    response.result.error,
                    response.result.block_hash,
                    response.result.block_height
                );
            } else {
                throw new RpcError(response.result.error);
            }
        }

        return result as Result;
    }
}
