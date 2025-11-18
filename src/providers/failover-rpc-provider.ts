/**
 * @module
 * @description
 * This module contains the {@link FailoverRpcProvider} client class
 * which can be used to interact with multiple [NEAR RPC APIs](https://docs.near.org/api/rpc/introduction).
 * @see {@link "@near-js/types".provider | provider} for a list of request and response types
 */
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
    RpcQueryRequest,
    AccessKeyView,
    AccessKeyList,
    AccountView,
    ContractCodeView,
    ContractStateView,
    CallContractViewFunctionResultRaw,
    ExecutionOutcomeReceiptDetail,
} from '../types';
import { SignedTransaction } from '../transactions';
import { Provider } from './provider';
import { TxExecutionStatus } from '../types';

/**
 * Client class to interact with the [NEAR RPC API](https://docs.near.org/api/rpc/introduction).
 * @see [https://github.com/near/nearcore/tree/master/chain/jsonrpc](https://github.com/near/nearcore/tree/master/chain/jsonrpc)
 */
export class FailoverRpcProvider implements Provider {
    /** @hidden */
    readonly providers: Provider[];

    private currentProviderIndex: number;

    /**
     * @param providers list of providers
     */
    constructor(providers: Provider[]) {
        if (providers.length === 0) {
            throw new Error('At least one provider must be specified');
        }

        this.providers = providers;
        this.currentProviderIndex = 0;
    }

    private switchToNextProvider(): void {
        if (this.providers.length === 1) return;

        if (this.providers.length - 1 <= this.currentProviderIndex) {
            this.currentProviderIndex = 0;
        } else {
            this.currentProviderIndex += 1;
        }
    }

    private get currentProvider(): Provider {
        const provider = this.providers[this.currentProviderIndex];

        if (!provider)
            throw new Error(
                `Provider wasn't found at index ${this.currentProviderIndex}`
            );

        return provider;
    }

    private async withBackoff(getResult: (provider: Provider) => Promise<any>) {
        for (let i = 0; i < this.providers.length; i++) {
            try {
                // each provider implements own retry logic
                const result = await getResult(this.currentProvider);

                if (typeof result === 'undefined') continue;

                return result;
            } catch (e) {
                console.error(e);
                this.switchToNextProvider();
            }
        }

        throw new TypedError(
            `Exceeded ${this.providers.length} providers to execute request`,
            'RetriesExceeded'
        );
    }

    async getNetworkId(): Promise<string> {
        return this.withBackoff((currentProvider) => currentProvider.getNetworkId());
    }

    public async getCurrentEpochSeatPrice(): Promise<bigint> {
        return this.withBackoff((currentProvider) => currentProvider.getCurrentEpochSeatPrice());
    }

    public async getNextEpochSeatPrice(): Promise<bigint> {
        return this.withBackoff((currentProvider) => currentProvider.getNextEpochSeatPrice());
    }

    public async viewAccessKey(params: import('./provider').ViewAccessKeyParams): Promise<AccessKeyView> {
        return this.withBackoff((currentProvider) => currentProvider.viewAccessKey(params));
    }

    public async viewAccessKeyList(params: import('./provider').ViewAccessKeyListParams): Promise<AccessKeyList> {
        return this.withBackoff((currentProvider) => currentProvider.viewAccessKeyList(params));
    }

    public async viewAccount(params: import('./provider').ViewAccountParams): Promise<AccountView> {
        return this.withBackoff((currentProvider) => currentProvider.viewAccount(params));
    }

    public async viewContractCode(params: import('./provider').ViewContractCodeParams): Promise<ContractCodeView> {
        return this.withBackoff((currentProvider) => currentProvider.viewContractCode(params));
    }

    public async viewContractState(params: import('./provider').ViewContractStateParams): Promise<ContractStateView> {
        return this.withBackoff((currentProvider) => currentProvider.viewContractState(params));
    }

    public async callFunction<T extends SerializedReturnValue>(params: import('./provider').CallFunctionParams): Promise<T | undefined> {
        return this.withBackoff((currentProvider) => currentProvider.callFunction<T>(params));
    }

    public async callFunctionRaw(params: import('./provider').CallFunctionParams): Promise<CallContractViewFunctionResultRaw> {
        return this.withBackoff((currentProvider) => currentProvider.callFunctionRaw(params));
    }

    public async viewBlock(params: { blockQuery: BlockReference }): Promise<BlockResult> {
        return this.withBackoff((currentProvider) => currentProvider.viewBlock(params));
    }

    public async viewChunk(params: { chunkId: ChunkId }): Promise<ChunkResult> {
        return this.withBackoff((currentProvider) => currentProvider.viewChunk(params));
    }

    public async viewGasPrice(params?: { blockId?: BlockId }): Promise<GasPrice> {
        return this.withBackoff((currentProvider) => currentProvider.viewGasPrice(params));
    }

    public async viewNodeStatus(): Promise<NodeStatusResult> {
        return this.withBackoff((currentProvider) => currentProvider.viewNodeStatus());
    }

    public async viewValidatorsV2(params: { blockId: string | number } | { epochId: string } | null): Promise<EpochValidatorInfo> {
        return this.withBackoff((currentProvider) => currentProvider.viewValidatorsV2(params));
    }

    public async viewTransactionStatus(params: { txHash: Uint8Array | string; accountId: string; waitUntil: TxExecutionStatus }): Promise<FinalExecutionOutcome> {
        return this.withBackoff((currentProvider) => currentProvider.viewTransactionStatus(params));
    }

    public async viewTransactionStatusWithReceipts(params: { txHash: Uint8Array | string; accountId: string; waitUntil: TxExecutionStatus }): Promise<FinalExecutionOutcome & Required<Pick<FinalExecutionOutcome, 'receipts'>>> {
        return this.withBackoff((currentProvider) => currentProvider.viewTransactionStatusWithReceipts(params));
    }

    public async viewTransactionReceipt(params: { receiptId: string }): Promise<ExecutionOutcomeReceiptDetail> {
        return this.withBackoff((currentProvider) => currentProvider.viewTransactionReceipt(params));
    }

    async sendTransactionUntil(params: { signedTransaction: SignedTransaction; waitUntil: TxExecutionStatus }): Promise<FinalExecutionOutcome> {
        return this.withBackoff((currentProvider) => currentProvider.sendTransactionUntil(params));
    }

    /**
     * Sends a signed transaction to the RPC and waits until transaction is fully complete
     * @see [https://docs.near.org/docs/develop/front-end/rpc#send-transaction-await](https://docs.near.org/docs/develop/front-end/rpc#general-validator-status)
     *
     * @param params Object containing signedTransaction
     */
    async sendTransaction(params: { signedTransaction: SignedTransaction }): Promise<FinalExecutionOutcome> {
        return this.withBackoff((currentProvider) => currentProvider.sendTransaction(params)
        );
    }

    /**
     * Sends a signed transaction to the RPC and immediately returns transaction hash
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#send-transaction-async)
     * @param params Object containing signedTransaction
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async sendTransactionAsync(params: { signedTransaction: SignedTransaction }): Promise<FinalExecutionOutcome> {
        return this.withBackoff((currentProvider) => currentProvider.sendTransactionAsync(params)
        );
    }

    /**
     * Query the RPC by passing an {@link "@near-js/types".provider/request.RpcQueryRequest | RpcQueryRequest }
     * @see [https://docs.near.org/api/rpc/contracts](https://docs.near.org/api/rpc/contracts)
     *
     * @typeParam T the shape of the returned query response
     */
    async query<T extends QueryResponseKind>(
        params: RpcQueryRequest | { path: string; data: string }
    ): Promise<T> {
        return this.withBackoff((currentProvider) => currentProvider.query<T>(params as any)
        );
    }



    /**
     * Query changes in block from the RPC
     * pass block_id OR finality as blockQuery, not both
     * @see [https://docs.near.org/api/rpc/block-chunk](https://docs.near.org/api/rpc/block-chunk)
     */
    async blockChanges(params: { blockQuery: BlockId | BlockReference }): Promise<BlockChangeResult> {
        return this.withBackoff((currentProvider) => currentProvider.blockChanges(params)
        );
    }

    /**
     * Gets the protocol config at a block from RPC
     *
     * @param params Object containing blockReference which specifies the block to get the protocol config for
     */
    async experimental_protocolConfig(params: { blockReference: BlockReference | { sync_checkpoint: 'genesis' } }): Promise<NearProtocolConfig> {
        return this.withBackoff((currentProvider) => currentProvider.experimental_protocolConfig(params)
        );
    }

    /**
     * Gets a light client execution proof for verifying execution outcomes
     * @see [https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof](https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof)
     */
    async lightClientProof(params: { request: LightClientProofRequest }): Promise<LightClientProof> {
        return this.withBackoff((currentProvider) => currentProvider.lightClientProof(params)
        );
    }

    /**
     * Returns the next light client block as far in the future as possible from the last known hash
     * to still be able to validate from that hash. This will either return the last block of the
     * next epoch, or the last final known block.
     *
     * @see [https://github.com/near/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-block](https://github.com/near/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-block)
     */
    async nextLightClientBlock(params: { request: NextLightClientBlockRequest }): Promise<NextLightClientBlockResponse> {
        return this.withBackoff((currentProvider) => currentProvider.nextLightClientBlock(params)
        );
    }

    /**
     * Gets access key changes for a given array of accountIds
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-all)
     * @returns {Promise<ChangeResult>}
     */
    async accessKeyChanges(params: { accountIdArray: string[]; blockQuery: BlockId | BlockReference }): Promise<ChangeResult> {
        return this.withBackoff((currentProvider) => currentProvider.accessKeyChanges(params)
        );
    }

    /**
     * Gets single access key changes for a given array of access keys
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-single)
     * @returns {Promise<ChangeResult>}
     */
    async singleAccessKeyChanges(params: { accessKeyArray: AccessKeyWithPublicKey[]; blockQuery: BlockId | BlockReference }): Promise<ChangeResult> {
        return this.withBackoff((currentProvider) => currentProvider.singleAccessKeyChanges(params)
        );
    }

    /**
     * Gets account changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-account-changes)
     * @returns {Promise<ChangeResult>}
     */
    async accountChanges(params: { accountIdArray: string[]; blockQuery: BlockId | BlockReference }): Promise<ChangeResult> {
        return this.withBackoff((currentProvider) => currentProvider.accountChanges(params)
        );
    }

    /**
     * Gets contract state changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * Note: If you pass a keyPrefix it must be base64 encoded
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-state-changes)
     * @returns {Promise<ChangeResult>}
     */
    async contractStateChanges(params: { accountIdArray: string[]; blockQuery: BlockId | BlockReference; keyPrefix?: string }): Promise<ChangeResult> {
        return this.withBackoff((currentProvider) => currentProvider.contractStateChanges(params)
        );
    }

    /**
     * Gets contract code changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * Note: Change is returned in a base64 encoded WASM file
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-code-changes)
     * @returns {Promise<ChangeResult>}
     */
    async contractCodeChanges(params: { accountIdArray: string[]; blockQuery: BlockId | BlockReference }): Promise<ChangeResult> {
        return this.withBackoff((currentProvider) => currentProvider.contractCodeChanges(params)
        );
    }
}
