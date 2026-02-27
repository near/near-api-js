import type {
    JsonRpcRequestForBlock,
    JsonRpcRequestForBlockEffects,
    JsonRpcRequestForBroadcastTxAsync,
    JsonRpcRequestForBroadcastTxCommit,
    JsonRpcRequestForChanges,
    JsonRpcRequestForChunk,
    JsonRpcRequestForClientConfig,
    JsonRpcRequestForExperimentalCallFunction,
    JsonRpcRequestForExperimentalChanges,
    JsonRpcRequestForExperimentalChangesInBlock,
    JsonRpcRequestForExperimentalCongestionLevel,
    JsonRpcRequestForExperimentalGenesisConfig,
    JsonRpcRequestForExperimentalLightClientBlockProof,
    JsonRpcRequestForExperimentalLightClientProof,
    JsonRpcRequestForExperimentalMaintenanceWindows,
    JsonRpcRequestForExperimentalProtocolConfig,
    JsonRpcRequestForExperimentalReceipt,
    JsonRpcRequestForExperimentalSplitStorageInfo,
    JsonRpcRequestForExperimentalTxStatus,
    JsonRpcRequestForExperimentalValidatorsOrdered,
    JsonRpcRequestForExperimentalViewAccessKey,
    JsonRpcRequestForExperimentalViewAccessKeyList,
    JsonRpcRequestForExperimentalViewAccount,
    JsonRpcRequestForExperimentalViewCode,
    JsonRpcRequestForExperimentalViewGasKey,
    JsonRpcRequestForExperimentalViewGasKeyList,
    JsonRpcRequestForExperimentalViewState,
    JsonRpcRequestForGasPrice,
    JsonRpcRequestForGenesisConfig,
    JsonRpcRequestForHealth,
    JsonRpcRequestForLightClientProof,
    JsonRpcRequestForMaintenanceWindows,
    JsonRpcRequestForNetworkInfo,
    JsonRpcRequestForNextLightClientBlock,
    JsonRpcRequestForQuery,
    JsonRpcRequestForSendTx,
    JsonRpcRequestForStatus,
    JsonRpcRequestForTx,
    JsonRpcRequestForValidators,
    JsonRpcResponseForArrayOfRangeOfUint64AndRpcMaintenanceWindowsError,
    JsonRpcResponseForArrayOfValidatorStakeViewAndRpcValidatorError,
    JsonRpcResponseForCryptoHashAndRpcTransactionError,
    JsonRpcResponseForGenesisConfigAndGenesisConfigError,
    JsonRpcResponseForNullableRpcHealthResponseAndRpcStatusError,
    JsonRpcResponseForRpcBlockResponseAndRpcBlockError,
    JsonRpcResponseForRpcCallFunctionResponseAndRpcCallFunctionError,
    JsonRpcResponseForRpcChunkResponseAndRpcChunkError,
    JsonRpcResponseForRpcClientConfigResponseAndRpcClientConfigError,
    JsonRpcResponseForRpcCongestionLevelResponseAndRpcChunkError,
    JsonRpcResponseForRpcGasPriceResponseAndRpcGasPriceError,
    JsonRpcResponseForRpcLightClientBlockProofResponseAndRpcLightClientProofError,
    JsonRpcResponseForRpcLightClientExecutionProofResponseAndRpcLightClientProofError,
    JsonRpcResponseForRpcLightClientNextBlockResponseAndRpcLightClientNextBlockError,
    JsonRpcResponseForRpcNetworkInfoResponseAndRpcNetworkInfoError,
    JsonRpcResponseForRpcProtocolConfigResponseAndRpcProtocolConfigError,
    JsonRpcResponseForRpcQueryResponseAndRpcQueryError,
    JsonRpcResponseForRpcReceiptResponseAndRpcReceiptError,
    JsonRpcResponseForRpcSplitStorageInfoResponseAndRpcSplitStorageInfoError,
    JsonRpcResponseForRpcStateChangesInBlockByTypeResponseAndRpcStateChangesError,
    JsonRpcResponseForRpcStateChangesInBlockResponseAndRpcStateChangesError,
    JsonRpcResponseForRpcStatusResponseAndRpcStatusError,
    JsonRpcResponseForRpcTransactionResponseAndRpcTransactionError,
    JsonRpcResponseForRpcValidatorResponseAndRpcValidatorError,
    JsonRpcResponseForRpcViewAccessKeyListResponseAndRpcViewAccessKeyListError,
    JsonRpcResponseForRpcViewAccessKeyResponseAndRpcViewAccessKeyError,
    JsonRpcResponseForRpcViewAccountResponseAndRpcViewAccountError,
    JsonRpcResponseForRpcViewCodeResponseAndRpcViewCodeError,
    JsonRpcResponseForRpcViewGasKeyListResponseAndRpcViewGasKeyListError,
    JsonRpcResponseForRpcViewGasKeyResponseAndRpcViewGasKeyError,
    JsonRpcResponseForRpcViewStateResponseAndRpcViewStateError,
} from '../rpc/types.gen.js';

export type JsonRpcRequest = {
    [Method in keyof Methods]: Methods[Method]['request'];
}[keyof Methods];

export type JsonRpcResponse<Method extends keyof Methods> = Methods[Method]['response'];

export interface Methods {
    block: {
        request: JsonRpcRequestForBlock;
        response: JsonRpcResponseForRpcBlockResponseAndRpcBlockError;
    };
    block_effects: {
        request: JsonRpcRequestForBlockEffects;
        response: JsonRpcResponseForRpcStateChangesInBlockResponseAndRpcStateChangesError;
    };
    chunk: {
        request: JsonRpcRequestForChunk;
        response: JsonRpcResponseForRpcChunkResponseAndRpcChunkError;
    };
    tx: {
        request: JsonRpcRequestForTx;
        response: JsonRpcResponseForRpcTransactionResponseAndRpcTransactionError;
    };
    validators: {
        request: JsonRpcRequestForValidators;
        response: JsonRpcResponseForRpcValidatorResponseAndRpcValidatorError;
    };
    send_tx: {
        request: JsonRpcRequestForSendTx;
        response: JsonRpcResponseForCryptoHashAndRpcTransactionError;
    };
    broadcast_tx_async: {
        request: JsonRpcRequestForBroadcastTxAsync;
        response: JsonRpcResponseForCryptoHashAndRpcTransactionError;
    };
    broadcast_tx_commit: {
        request: JsonRpcRequestForBroadcastTxCommit;
        response: JsonRpcResponseForRpcTransactionResponseAndRpcTransactionError;
    };
    query: {
        request: JsonRpcRequestForQuery;
        response: JsonRpcResponseForRpcQueryResponseAndRpcQueryError;
    };
    changes: {
        request: JsonRpcRequestForChanges;
        response: JsonRpcResponseForRpcStateChangesInBlockByTypeResponseAndRpcStateChangesError;
    };
    gas_price: {
        request: JsonRpcRequestForGasPrice;
        response: JsonRpcResponseForRpcGasPriceResponseAndRpcGasPriceError;
    };
    status: {
        request: JsonRpcRequestForStatus;
        response: JsonRpcResponseForRpcStatusResponseAndRpcStatusError;
    };
    health: {
        request: JsonRpcRequestForHealth;
        response: JsonRpcResponseForNullableRpcHealthResponseAndRpcStatusError;
    };
    network_info: {
        request: JsonRpcRequestForNetworkInfo;
        response: JsonRpcResponseForRpcNetworkInfoResponseAndRpcNetworkInfoError;
    };
    client_config: {
        request: JsonRpcRequestForClientConfig;
        response: JsonRpcResponseForRpcClientConfigResponseAndRpcClientConfigError;
    };
    genesis_config: {
        request: JsonRpcRequestForGenesisConfig;
        response: JsonRpcResponseForGenesisConfigAndGenesisConfigError;
    };
    maintenance_windows: {
        request: JsonRpcRequestForMaintenanceWindows;
        response: JsonRpcResponseForArrayOfRangeOfUint64AndRpcMaintenanceWindowsError;
    };
    next_light_client_block: {
        request: JsonRpcRequestForNextLightClientBlock;
        response: JsonRpcResponseForRpcLightClientNextBlockResponseAndRpcLightClientNextBlockError;
    };
    light_client_proof: {
        request: JsonRpcRequestForLightClientProof;
        response: JsonRpcResponseForRpcLightClientExecutionProofResponseAndRpcLightClientProofError;
    };
    EXPERIMENTAL_call_function: {
        request: JsonRpcRequestForExperimentalCallFunction;
        response: JsonRpcResponseForRpcCallFunctionResponseAndRpcCallFunctionError;
    };
    EXPERIMENTAL_changes: {
        request: JsonRpcRequestForExperimentalChanges;
        response: JsonRpcResponseForRpcStateChangesInBlockByTypeResponseAndRpcStateChangesError;
    };
    EXPERIMENTAL_changes_in_block: {
        request: JsonRpcRequestForExperimentalChangesInBlock;
        response: JsonRpcResponseForRpcStateChangesInBlockResponseAndRpcStateChangesError;
    };
    EXPERIMENTAL_congestion_level: {
        request: JsonRpcRequestForExperimentalCongestionLevel;
        response: JsonRpcResponseForRpcCongestionLevelResponseAndRpcChunkError;
    };
    EXPERIMENTAL_genesis_config: {
        request: JsonRpcRequestForExperimentalGenesisConfig;
        response: JsonRpcResponseForGenesisConfigAndGenesisConfigError;
    };
    EXPERIMENTAL_light_client_block_proof: {
        request: JsonRpcRequestForExperimentalLightClientBlockProof;
        response: JsonRpcResponseForRpcLightClientBlockProofResponseAndRpcLightClientProofError;
    };
    EXPERIMENTAL_light_client_proof: {
        request: JsonRpcRequestForExperimentalLightClientProof;
        response: JsonRpcResponseForRpcLightClientExecutionProofResponseAndRpcLightClientProofError;
    };
    EXPERIMENTAL_maintenance_windows: {
        request: JsonRpcRequestForExperimentalMaintenanceWindows;
        response: JsonRpcResponseForArrayOfRangeOfUint64AndRpcMaintenanceWindowsError;
    };
    EXPERIMENTAL_protocol_config: {
        request: JsonRpcRequestForExperimentalProtocolConfig;
        response: JsonRpcResponseForRpcProtocolConfigResponseAndRpcProtocolConfigError;
    };
    EXPERIMENTAL_receipt: {
        request: JsonRpcRequestForExperimentalReceipt;
        response: JsonRpcResponseForRpcReceiptResponseAndRpcReceiptError;
    };
    EXPERIMENTAL_split_storage_info: {
        request: JsonRpcRequestForExperimentalSplitStorageInfo;
        response: JsonRpcResponseForRpcSplitStorageInfoResponseAndRpcSplitStorageInfoError;
    };
    EXPERIMENTAL_tx_status: {
        request: JsonRpcRequestForExperimentalTxStatus;
        response: JsonRpcResponseForRpcTransactionResponseAndRpcTransactionError;
    };
    EXPERIMENTAL_validators_ordered: {
        request: JsonRpcRequestForExperimentalValidatorsOrdered;
        response: JsonRpcResponseForArrayOfValidatorStakeViewAndRpcValidatorError;
    };
    EXPERIMENTAL_view_access_key: {
        request: JsonRpcRequestForExperimentalViewAccessKey;
        response: JsonRpcResponseForRpcViewAccessKeyResponseAndRpcViewAccessKeyError;
    };
    EXPERIMENTAL_view_access_key_list: {
        request: JsonRpcRequestForExperimentalViewAccessKeyList;
        response: JsonRpcResponseForRpcViewAccessKeyListResponseAndRpcViewAccessKeyListError;
    };
    EXPERIMENTAL_view_account: {
        request: JsonRpcRequestForExperimentalViewAccount;
        response: JsonRpcResponseForRpcViewAccountResponseAndRpcViewAccountError;
    };
    EXPERIMENTAL_view_code: {
        request: JsonRpcRequestForExperimentalViewCode;
        response: JsonRpcResponseForRpcViewCodeResponseAndRpcViewCodeError;
    };
    EXPERIMENTAL_view_gas_key: {
        request: JsonRpcRequestForExperimentalViewGasKey;
        response: JsonRpcResponseForRpcViewGasKeyResponseAndRpcViewGasKeyError;
    };
    EXPERIMENTAL_view_gas_key_list: {
        request: JsonRpcRequestForExperimentalViewGasKeyList;
        response: JsonRpcResponseForRpcViewGasKeyListResponseAndRpcViewGasKeyListError;
    };
    EXPERIMENTAL_view_state: {
        request: JsonRpcRequestForExperimentalViewState;
        response: JsonRpcResponseForRpcViewStateResponseAndRpcViewStateError;
    };
}
