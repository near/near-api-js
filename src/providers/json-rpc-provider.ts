/**
 * @module
 * This module contains the {@link JsonRpcProvider} client class
 * which can be used to interact with the [NEAR RPC API](https://docs.near.org/api/rpc/introduction).
 * @see {@link JsonRpcProvider} for query, transaction, and network methods.
 */

import type {
    AccessKeyList,
    AccessKeyView,
    AccountView,
    CallResult,
    CryptoHash,
    GasKeyNoncesView,
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
import { RpcError } from '../rpc-errors/index.js';
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
import { base64Decode, base64Encode, baseEncode, bytesToString, findSeatPrice, stringToBytes } from '../utils/index.js';
import { parseRpcError, parseRpcErrorMessage } from './errors/parse.js';
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
 *
 * @remarks
 * Methods reject when an HTTP request or RPC operation fails. RPC errors are mapped to the
 * exported classes in `near-api-js/rpc-errors`; transport failures can throw other error types.
 * Convenience methods with an optional finality selector default to optimistic finality.
 *
 * @see [NEAR RPC API](https://docs.near.org/api/rpc/introduction)
 */
export class JsonRpcProvider implements Provider {
    /** @hidden */
    readonly connection: ConnectionInfo;

    /** @hidden */
    readonly options: RequestOptions;

    /** @hidden */
    private networkId: string | undefined;

    /**
     * Creates a provider for an RPC endpoint.
     *
     * @param connectionInfo - RPC URL and optional HTTP headers, such as an API authorization header.
     * @param options - Retry settings for retryable HTTP and fetch failures.
     * @param options.retries - Maximum number of request attempts, including the first. Defaults to 12.
     * @param options.wait - Initial delay between attempts in milliseconds. Defaults to 500.
     * @param options.backoff - Multiplier applied to the delay after each retry. Defaults to 1.5.
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

    /**
     * Gets the network identifier reported by the node and caches it for this provider instance.
     *
     * @returns The node's chain ID, such as `mainnet` or `testnet`.
     */
    public async getNetworkId(): Promise<string> {
        if (this.networkId) return this.networkId;

        const { chain_id } = await this.viewNodeStatus();

        this.networkId = chain_id;

        return this.networkId;
    }

    /**
     * Calculates the validator seat price from the current validator set and optimistic protocol configuration.
     *
     * @returns The calculated minimum stake in yoctoNEAR as a bigint.
     * @throws If the protocol configuration does not expose `minimum_stake_ratio`, or an RPC request fails.
     */
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

    /**
     * Calculates the validator seat price from the next validator set and optimistic protocol configuration.
     *
     * @returns The calculated minimum stake in yoctoNEAR as a bigint.
     * @throws If the protocol configuration does not expose `minimum_stake_ratio`, or an RPC request fails.
     */
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

    /**
     * Queries an account's access key.
     *
     * @param params - Access key query options.
     * @param params.accountId - Account that owns the key.
     * @param params.publicKey - Public key instance or curve-prefixed public key string.
     * @param params.finalityQuery - Finality to query. Defaults to `{ finality: 'optimistic' }`.
     * @returns Key permissions and block context, with `nonce` converted to a bigint.
     */
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

    /**
     * Queries one page of an account's access keys.
     *
     * @param params - Access key list query options.
     * @param params.accountId - Account whose keys to query.
     * @param params.limit - Maximum keys requested for this page. If omitted, the node applies its default.
     * @param params.finalityQuery - Finality to query. Defaults to `{ finality: 'optimistic' }`.
     * @returns The RPC key list, pagination fields, and block context. Does not fetch subsequent pages.
     */
    public async viewAccessKeyList({
        accountId,
        afterKey,
        limit,
        finalityQuery = { finality: DEFAULT_FINALITY },
    }: ViewAccessKeyListArgs) {
        return this.query<AccessKeyList>({
            finality: finalityQuery.finality,
            request_type: 'view_access_key_list',
            account_id: accountId,
            ...(afterKey === undefined ? {} : { after_key: afterKey }),
            ...(limit === undefined ? {} : { limit }),
        });
    }

    /**
     * Queries the nonce lanes of a gas key.
     *
     * @param params - Gas key query options.
     * @param params.accountId - Account that owns the gas key.
     * @param params.publicKey - Public key instance or curve-prefixed public key string.
     * @param params.finalityQuery - Finality to query. Defaults to `{ finality: 'optimistic' }`.
     * @returns The RPC nonce-lane data and block context, without numeric conversion.
     */
    public async viewGasKeyNonces({
        accountId,
        publicKey,
        finalityQuery = { finality: DEFAULT_FINALITY },
    }: ViewAccessKeyArgs) {
        return this.query<GasKeyNoncesView>({
            finality: finalityQuery.finality,
            request_type: 'view_gas_key_nonces',
            account_id: accountId,
            public_key: publicKey.toString(),
        });
    }

    /**
     * Queries an account's on-chain state.
     *
     * @param params - Account query options.
     * @param params.accountId - Account to query.
     * @param params.blockQuery - Block height/hash or finality to query. Defaults to `{ finality: 'optimistic' }`.
     * @returns Account state and block context, with `amount` and `locked` converted to bigints in yoctoNEAR.
     */
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

    /**
     * Queries the code deployed on a contract account.
     *
     * @param params - Contract code query options.
     * @param params.contractId - Account whose deployed code to query.
     * @param params.blockQuery - Block height/hash or finality to query. Defaults to `{ finality: 'optimistic' }`.
     * @returns The RPC code response and block context, plus decoded WASM bytes in `code`.
     */
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
            code: base64Decode(data.code_base64),
        };
    }

    /**
     * Queries a global contract by code hash or publishing account.
     *
     * @param params - Global contract query options.
     * @param params.identifier - Either `{ codeHash }` with a Base58 hash or raw hash bytes,
     * or `{ accountId }` with the publishing account ID.
     * @param params.blockQuery - Block height/hash or finality to query. Defaults to `{ finality: 'optimistic' }`.
     * @returns The RPC code response and block context, plus decoded WASM bytes in `code`.
     * @throws If the identifier has neither a code hash nor an account ID, or the RPC request fails.
     */
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
                    typeof identifier.codeHash === 'string' ? identifier.codeHash : baseEncode(identifier.codeHash),
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
            code: base64Decode(data.code_base64),
        };
    }

    /**
     * Queries a contract's raw storage entries matching a UTF-8 prefix.
     *
     * @param params - Contract storage query options.
     * @param params.contractId - Account whose storage to query.
     * @param params.prefix - UTF-8 key prefix, encoded to Base64 by this method. Defaults to an empty prefix.
     * @param params.blockQuery - Block height/hash or finality to query. Defaults to `{ finality: 'optimistic' }`.
     * @returns The RPC storage response and block context. Keys and values remain Base64-encoded.
     */
    public async viewContractState({
        contractId,
        prefix,
        blockQuery = { finality: DEFAULT_FINALITY },
    }: ViewContractStateArgs) {
        const prefixBase64 = base64Encode(stringToBytes(prefix || ''));

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

    /**
     * Calls a contract view method without submitting a transaction and decodes its result.
     *
     * @typeParam T - Expected result type. This does not validate the returned value at runtime.
     * @param params - View call options.
     * @param params.contractId - Account ID of the contract to query.
     * @param params.method - Name of the contract's view method.
     * @param params.args - Arguments serialized as JSON, or a Uint8Array containing already serialized arguments.
     * @param params.blockQuery - Block height/hash or finality to query. Defaults to `{ finality: 'optimistic' }`.
     * @returns The JSON-decoded result, or its UTF-8 string if it is not valid JSON.
     * Returns `undefined` when the contract returns no bytes.
     * @throws If the RPC request or contract execution fails.
     *
     * @remarks
     * RPC backends may be at different heights, so a view immediately after a transaction can return older state.
     * If you need to observe the write immediately, use bounded retries or pin the query
     * to the relevant execution receipt's block.
     *
     * @see [Reading after a transaction](https://github.com/near/near-api-js#reading-after-a-transaction)
     */
    public async callFunction<T extends SerializedReturnValue>({
        contractId,
        method,
        args,
        blockQuery = { finality: DEFAULT_FINALITY },
    }: CallFunctionArgs): Promise<T | undefined> {
        const { result } = await this.callFunctionRaw({ contractId, method, args, blockQuery });

        if (result.length === 0) return undefined;

        const serializedResult = bytesToString(new Uint8Array(result));

        try {
            return JSON.parse(serializedResult) as T;
        } catch {
            return serializedResult as T;
        }
    }

    /**
     * Calls a contract view method and returns its raw RPC response without decoding the result bytes.
     *
     * @param params - View call options.
     * @param params.contractId - Account ID of the contract to query.
     * @param params.method - Name of the contract's view method.
     * @param params.args - Arguments serialized as JSON, or a Uint8Array containing already serialized arguments.
     * @param params.blockQuery - Block height/hash or finality to query. Defaults to `{ finality: 'optimistic' }`.
     * @returns Result bytes as a number array, execution logs, and the queried block's hash and height.
     * @throws If the RPC request or contract execution fails, or the block reference is invalid.
     * @see {@link callFunction} for automatic result decoding and read-after-write considerations.
     */
    public async callFunctionRaw({
        contractId,
        method,
        args,
        blockQuery = { finality: DEFAULT_FINALITY },
    }: CallFunctionArgs) {
        const argsBytes = args instanceof Uint8Array ? args : stringToBytes(JSON.stringify(args));
        const argsBase64 = base64Encode(argsBytes);

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

    /**
     * Queries a block's header and chunk headers.
     *
     * @param blockQuery - Either `{ blockId }` with a block height/hash, or `{ finality }`.
     * @returns The RPC block response. Chunk contents require a separate {@link viewChunk} call.
     */
    public async viewBlock(blockQuery: BlockReference): Promise<RpcBlockResponse> {
        const { finality } = blockQuery as any;
        const { blockId } = blockQuery as any;
        return this.sendJsonRpc('block', { block_id: blockId, finality });
    }

    /**
     * Queries a chunk's contents.
     *
     * @param chunkId - A chunk hash, or a `[blockId, shardId]` tuple.
     * @returns The chunk header, transactions, and receipts reported by the node.
     */
    public async viewChunk(chunkId: ChunkId): Promise<RpcChunkResponse> {
        return this.sendJsonRpc('chunk', [chunkId]);
    }

    /**
     * Queries the gas price at a block.
     *
     * @param blockId - Block height or hash. If omitted, queries the node's latest block.
     * @returns The gas price in yoctoNEAR per unit of gas, as an RPC decimal string.
     */
    public async viewGasPrice(blockId?: BlockId): Promise<RpcGasPriceResponse> {
        return this.sendJsonRpc('gas_price', [blockId || null]);
    }

    /**
     * Queries node status, including its version, chain ID, and synchronization progress.
     *
     * @returns The RPC node status response.
     */
    public async viewNodeStatus(): Promise<RpcStatusResponse> {
        return this.sendJsonRpc('status', []);
    }

    /**
     * Queries validator information for an epoch.
     *
     * @param params - Either `{ blockId }` with a block height/hash or `{ epochId }` with an epoch hash.
     * Omit to query the current epoch.
     * @returns Current and next validator sets, proposals, and other validator statistics reported by the node.
     * @throws If the selector is invalid or the RPC request fails.
     * @see [NEAR RPC network methods](https://docs.near.org/api/rpc/network)
     */
    public async viewValidators(params?: ViewValidatorsArgs): Promise<RpcValidatorResponse> {
        if (typeof params === 'undefined') return this.sendJsonRpc('validators', [null]);

        if (typeof params === 'object' && 'blockId' in params)
            return this.sendJsonRpc('validators', { block_id: params.blockId });

        if (typeof params === 'object' && 'epochId' in params)
            return this.sendJsonRpc('validators', { epoch_id: params.epochId });

        throw new Error('Invalid parameters for validators');
    }

    /**
     * Queries a submitted transaction and waits for the requested execution milestone.
     *
     * @param params - Transaction status query options.
     * @param params.txHash - Transaction hash as a Base58 string or raw hash bytes.
     * @param params.accountId - Transaction signer's account ID, used to locate its shard.
     * @param params.waitUntil - Execution milestone to wait for. Defaults to `EXECUTED_OPTIMISTIC`.
     * @returns The RPC transaction response, including execution outcomes when available.
     * Execution failures are returned in the response; this method does not throw merely because a contract failed.
     * @see [Transaction execution milestones](https://docs.near.org/api/rpc/transactions#the-wait_until-field)
     */
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

    /**
     * Queries transaction status with receipt details using `EXPERIMENTAL_tx_status`.
     *
     * @param params - Transaction status query options.
     * @param params.txHash - Transaction hash as a Base58 string or raw hash bytes.
     * @param params.accountId - Transaction signer's account ID, used to locate its shard.
     * @param params.waitUntil - Execution milestone to wait for. Defaults to `EXECUTED_OPTIMISTIC`.
     * @returns The RPC transaction response, with execution outcomes and available receipt details.
     * Execution failures are returned in the response. Receipt details can be incomplete at early milestones.
     * @see {@link viewTransactionStatus}
     * @see [NEAR RPC transaction methods](https://docs.near.org/api/rpc/transactions)
     */
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

    /**
     * Queries a receipt by its ID using `EXPERIMENTAL_receipt`.
     *
     * @param receiptId - Base58 receipt ID.
     * @returns Receipt contents, rather than its execution outcome.
     * @see {@link viewTransactionStatus} for receipt execution outcomes.
     */
    public async viewTransactionReceipt(receiptId: string): Promise<RpcReceiptResponse> {
        return this.sendJsonRpc('EXPERIMENTAL_receipt', {
            receipt_id: receiptId,
        });
    }

    /**
     * Submits a signed transaction using `send_tx` and waits for the requested execution milestone.
     *
     * @param signedTransaction - Transaction signed with the sender's access key.
     * @param waitUntil - Execution milestone to wait for. `NONE` returns without waiting for inclusion or execution.
     * @returns The RPC transaction response. Available fields depend on the execution milestone reached.
     * Execution failures are returned in the response; this method does not throw merely because a contract failed.
     * @see [Transaction execution milestones](https://docs.near.org/api/rpc/transactions#the-wait_until-field)
     */
    async sendTransactionUntil(
        signedTransaction: SignedTransaction,
        waitUntil: TxExecutionStatus
    ): Promise<RpcTransactionResponse> {
        const bytes = encodeTransaction(signedTransaction);
        return this.sendJsonRpc('send_tx', {
            signed_tx_base64: base64Encode(bytes),
            wait_until: waitUntil,
        });
    }

    /**
     * Submits a signed transaction and waits for `EXECUTED_OPTIMISTIC`.
     *
     * @param signedTransaction - Transaction signed with the sender's access key.
     * @returns The RPC transaction response after non-refund receipts have executed, without waiting for finality.
     * Execution failures are returned in the response.
     * @see {@link sendTransactionUntil} to select a different execution milestone.
     */
    async sendTransaction(signedTransaction: SignedTransaction): Promise<RpcTransactionResponse> {
        return this.sendTransactionUntil(signedTransaction, 'EXECUTED_OPTIMISTIC');
    }

    /**
     * Submits a signed transaction using `send_tx` with `wait_until: 'NONE'`.
     *
     * @param signedTransaction - Transaction signed with the sender's access key.
     * @returns The immediate RPC response, without waiting for inclusion or execution.
     * This is not the hash-only response of `broadcast_tx_async`; compute the transaction hash locally if needed.
     * @see {@link sendTransactionUntil}
     */
    async sendTransactionAsync(signedTransaction: SignedTransaction): Promise<RpcTransactionResponse> {
        return this.sendTransactionUntil(signedTransaction, 'NONE');
    }

    /**
     * Sends a raw `query` request without the conversions performed by the convenience methods.
     *
     * @typeParam R - Expected RPC query result shape, excluding the block context added to the return type.
     * This does not validate the response at runtime.
     * @param params - RPC query parameters, using snake_case field names and an explicit block/finality selector.
     * @returns The RPC result with its block hash and height. Numeric strings and encoded bytes are left unchanged.
     * @see {@link callFunction}, {@link viewAccount}, and {@link viewAccessKey} for convenience methods.
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
     * Queries which accounts and state categories changed in a block.
     *
     * @param blockQuery - Either `{ blockId }` with a block height/hash, or `{ finality }`.
     * @returns The block hash and a summary of changes, rather than the changed values themselves.
     * @see {@link accountChanges}, {@link accessKeyChanges}, and {@link contractStateChanges} for changed values.
     */
    async blockChanges(blockQuery: BlockReference): Promise<RpcStateChangesInBlockByTypeResponse> {
        const { finality } = blockQuery as any;
        const { blockId } = blockQuery as any;
        return this.sendJsonRpc('EXPERIMENTAL_changes_in_block', { block_id: blockId, finality });
    }

    /**
     * Queries protocol configuration at a block using `EXPERIMENTAL_protocol_config`.
     *
     * @param blockReference - A `{ blockId }` or `{ finality }` selector, or `{ sync_checkpoint: 'genesis' }`.
     * @returns The node's protocol configuration for the selected block or checkpoint.
     */
    async experimental_protocolConfig(
        blockReference: BlockReference | { sync_checkpoint: 'genesis' }
    ): Promise<RpcProtocolConfigResponse> {
        const { blockId, ...otherParams } = blockReference as any;
        return await this.sendJsonRpc('EXPERIMENTAL_protocol_config', { ...otherParams, block_id: blockId });
    }

    /**
     * Queries a proof of a transaction or receipt execution outcome.
     *
     * @param request - Proof request using the RPC's snake_case field names.
     * @param request.type - Whether to prove a `transaction` or `receipt` outcome.
     * @param request.light_client_head - Block hash of the light client's trusted head.
     * @param request.transaction_hash - Transaction hash, required for a transaction proof.
     * @param request.sender_id - Transaction signer's account ID, required for a transaction proof.
     * @param request.receipt_id - Receipt ID, required for a receipt proof.
     * @param request.receiver_id - Receipt receiver's account ID, required for a receipt proof.
     * @returns The execution outcome and Merkle paths needed to verify it against the light client head.
     * @see [NEAR light client proofs](https://github.com/near/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof)
     */
    async lightClientProof(request: LightClientProofRequest): Promise<RpcLightClientExecutionProofResponse> {
        return await this.sendJsonRpc('EXPERIMENTAL_light_client_proof', request);
    }

    /**
     * Returns the next light client block as far in the future as possible from the last known hash
     * to still be able to validate from that hash. This will either return the last block of the
     * next epoch, or the last final known block.
     *
     * @param request - Light client update request.
     * @param request.last_block_hash - Last block hash already known to the light client.
     * @returns A verifiable light client block update from the node.
     * @see [NEAR light client blocks](https://github.com/near/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-block)
     */
    async nextLightClientBlock(request: NextLightClientBlockRequest): Promise<RpcLightClientNextBlockResponse> {
        return await this.sendJsonRpc('next_light_client_block', request);
    }

    /**
     * Queries access key changes for the selected accounts in one block.
     *
     * @param accountIdArray - Accounts whose access key changes to query.
     * @param blockQuery - Either `{ blockId }` with a block height/hash, or `{ finality }`.
     * @returns The RPC change records and block hash, with values left in their RPC representation.
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
     * Queries changes to specific access keys in one block.
     *
     * @param accessKeyArray - Keys to query, each with `account_id` and a curve-prefixed `public_key` string.
     * @param blockQuery - Either `{ blockId }` with a block height/hash, or `{ finality }`.
     * @returns The RPC change records and block hash, with values left in their RPC representation.
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
     * Queries account changes in one block.
     *
     * @param accountIdArray - Accounts whose changes to query.
     * @param blockQuery - Either `{ blockId }` with a block height/hash, or `{ finality }`.
     * @returns The RPC account change records and block hash; balances remain decimal strings in yoctoNEAR.
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
     * Queries contract storage changes in one block.
     *
     * @param accountIdArray - Contract accounts whose storage changes to query.
     * @param blockQuery - Either `{ blockId }` with a block height/hash, or `{ finality }`.
     * @param keyPrefix - Already Base64-encoded storage key prefix. Defaults to an empty prefix.
     * Unlike {@link viewContractState}, this method does not encode the prefix for you.
     * @returns The RPC storage change records and block hash; storage keys and values remain Base64-encoded.
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
     * Queries contract code changes in one block.
     *
     * @param accountIdArray - Contract accounts whose code changes to query.
     * @param blockQuery - Either `{ blockId }` with a block height/hash, or `{ finality }`.
     * @returns The RPC code change records and block hash; WASM code remains Base64-encoded.
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
     * Sends a JSON-RPC request, applying the provider's retry settings and RPC error parsing.
     *
     * @typeParam Method - RPC method name from the supported method map.
     * @typeParam Params - Request parameter type; defaults to the selected method's parameter type.
     * @typeParam Result - Response result type; defaults to the selected method's result type.
     * @param method - RPC method name.
     * @param params - Parameters in the RPC method's expected wire format.
     * @returns The response's `result`, without numeric or byte decoding. A JSON `null` result is preserved.
     * @throws If the transport fails, the RPC reports an error, or the response has no usable result.
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
