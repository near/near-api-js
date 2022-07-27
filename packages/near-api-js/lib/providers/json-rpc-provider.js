"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcProvider = exports.ErrorContext = exports.TypedError = void 0;
/**
 * This module contains the {@link JsonRpcProvider} client class
 * which can be used to interact with the NEAR RPC API.
 * @see {@link providers/provider} for a list of request and response types
 */
const provider_1 = require("./provider");
const web_1 = require("../utils/web");
const errors_1 = require("../utils/errors");
Object.defineProperty(exports, "TypedError", { enumerable: true, get: function () { return errors_1.TypedError; } });
Object.defineProperty(exports, "ErrorContext", { enumerable: true, get: function () { return errors_1.ErrorContext; } });
const borsh_1 = require("borsh");
const exponential_backoff_1 = __importDefault(require("../utils/exponential-backoff"));
const rpc_errors_1 = require("../utils/rpc_errors");
// Default number of retries before giving up on a request.
const REQUEST_RETRY_NUMBER = 12;
// Default wait until next retry in millis.
const REQUEST_RETRY_WAIT = 500;
// Exponential back off for waiting to retry.
const REQUEST_RETRY_WAIT_BACKOFF = 1.5;
/// Keep ids unique across all connections.
let _nextId = 123;
/**
 * Client class to interact with the NEAR RPC API.
 * @see {@link https://github.com/near/nearcore/tree/master/chain/jsonrpc}
 */
class JsonRpcProvider extends provider_1.Provider {
    /**
     * @param connectionInfo Connection info
     */
    constructor(connectionInfo) {
        super();
        this.connection = connectionInfo || { url: '' };
    }
    /**
     * Gets the RPC's status
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#general-validator-status}
     */
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendJsonRpc('status', []);
        });
    }
    /**
     * Sends a signed transaction to the RPC and waits until transaction is fully complete
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#send-transaction-await}
     *
     * @param signedTransaction The signed transaction being sent
     */
    sendTransaction(signedTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const bytes = signedTransaction.encode();
            return this.sendJsonRpc('broadcast_tx_commit', [Buffer.from(bytes).toString('base64')]);
        });
    }
    /**
     * Sends a signed transaction to the RPC and immediately returns transaction hash
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#send-transaction-async)
     * @param signedTransaction The signed transaction being sent
     * @returns {Promise<FinalExecutionOutcome>}
     */
    sendTransactionAsync(signedTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const bytes = signedTransaction.encode();
            return this.sendJsonRpc('broadcast_tx_async', [Buffer.from(bytes).toString('base64')]);
        });
    }
    /**
     * Gets a transaction's status from the RPC
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#transaction-status}
     *
     * @param txHash A transaction hash as either a Uint8Array or a base58 encoded string
     * @param accountId The NEAR account that signed the transaction
     */
    txStatus(txHash, accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof txHash === 'string') {
                return this.txStatusString(txHash, accountId);
            }
            else {
                return this.txStatusUint8Array(txHash, accountId);
            }
        });
    }
    txStatusUint8Array(txHash, accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendJsonRpc('tx', [(0, borsh_1.baseEncode)(txHash), accountId]);
        });
    }
    txStatusString(txHash, accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendJsonRpc('tx', [txHash, accountId]);
        });
    }
    /**
     * Gets a transaction's status from the RPC with receipts
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#transaction-status-with-receipts)
     * @param txHash The hash of the transaction
     * @param accountId The NEAR account that signed the transaction
     * @returns {Promise<FinalExecutionOutcome>}
     */
    txStatusReceipts(txHash, accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof txHash === 'string') {
                return this.sendJsonRpc('EXPERIMENTAL_tx_status', [txHash, accountId]);
            }
            else {
                return this.sendJsonRpc('EXPERIMENTAL_tx_status', [(0, borsh_1.baseEncode)(txHash), accountId]);
            }
        });
    }
    /**
     * Query the RPC as [shown in the docs](https://docs.near.org/docs/develop/front-end/rpc#accounts--contracts)
     * Query the RPC by passing an {@link RpcQueryRequest}
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#accounts--contracts}
     *
     * @typeParam T the shape of the returned query response
     */
    query(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            if (args.length === 1) {
                const _a = args[0], { block_id, blockId } = _a, otherParams = __rest(_a, ["block_id", "blockId"]);
                result = yield this.sendJsonRpc('query', Object.assign(Object.assign({}, otherParams), { block_id: block_id || blockId }));
            }
            else {
                const [path, data] = args;
                result = yield this.sendJsonRpc('query', [path, data]);
            }
            if (result && result.error) {
                throw new errors_1.TypedError(`Querying ${args} failed: ${result.error}.\n${JSON.stringify(result, null, 2)}`, (0, rpc_errors_1.getErrorTypeFromErrorMessage)(result.error));
            }
            return result;
        });
    }
    /**
     * Query for block info from the RPC
     * pass block_id OR finality as blockQuery, not both
     * @see {@link https://docs.near.org/docs/interaction/rpc#block}
     *
     * @param blockQuery {@link BlockReference} (passing a {@link BlockId} is deprecated)
     */
    block(blockQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const { finality } = blockQuery;
            const { blockId } = blockQuery;
            return this.sendJsonRpc('block', { block_id: blockId, finality });
        });
    }
    /**
     * Query changes in block from the RPC
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#block-details)
     */
    blockChanges(blockQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const { finality } = blockQuery;
            const { blockId } = blockQuery;
            return this.sendJsonRpc('EXPERIMENTAL_changes_in_block', { block_id: blockId, finality });
        });
    }
    /**
     * Queries for details about a specific chunk appending details of receipts and transactions to the same chunk data provided by a block
     * @see {@link https://docs.near.org/docs/interaction/rpc#chunk}
     *
     * @param chunkId Hash of a chunk ID or shard ID
     */
    chunk(chunkId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendJsonRpc('chunk', [chunkId]);
        });
    }
    /**
     * Query validators of the epoch defined by the given block id.
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#detailed-validator-status}
     *
     * @param blockId Block hash or height, or null for latest.
     */
    validators(blockId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendJsonRpc('validators', [blockId]);
        });
    }
    /**
     * Gets the protocol config at a block from RPC
     * @see {@link }
     *
     * @param blockReference specifies the block to get the protocol config for
     */
    experimental_protocolConfig(blockReference) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendJsonRpc('EXPERIMENTAL_protocol_config', blockReference);
        });
    }
    /**
     * Gets a light client execution proof for verifying execution outcomes
     * @see {@link https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof}
     */
    lightClientProof(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendJsonRpc('EXPERIMENTAL_light_client_proof', request);
        });
    }
    /**
     * Gets access key changes for a given array of accountIds
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-all)
     * @returns {Promise<ChangeResult>}
     */
    accessKeyChanges(accountIdArray, blockQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const { finality } = blockQuery;
            const { blockId } = blockQuery;
            return this.sendJsonRpc('EXPERIMENTAL_changes', {
                changes_type: 'all_access_key_changes',
                account_ids: accountIdArray,
                block_id: blockId,
                finality
            });
        });
    }
    /**
     * Gets single access key changes for a given array of access keys
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-single)
     * @returns {Promise<ChangeResult>}
     */
    singleAccessKeyChanges(accessKeyArray, blockQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const { finality } = blockQuery;
            const { blockId } = blockQuery;
            return this.sendJsonRpc('EXPERIMENTAL_changes', {
                changes_type: 'single_access_key_changes',
                keys: accessKeyArray,
                block_id: blockId,
                finality
            });
        });
    }
    /**
     * Gets account changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-account-changes)
     * @returns {Promise<ChangeResult>}
     */
    accountChanges(accountIdArray, blockQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const { finality } = blockQuery;
            const { blockId } = blockQuery;
            return this.sendJsonRpc('EXPERIMENTAL_changes', {
                changes_type: 'account_changes',
                account_ids: accountIdArray,
                block_id: blockId,
                finality
            });
        });
    }
    /**
     * Gets contract state changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * Note: If you pass a keyPrefix it must be base64 encoded
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-state-changes)
     * @returns {Promise<ChangeResult>}
     */
    contractStateChanges(accountIdArray, blockQuery, keyPrefix = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const { finality } = blockQuery;
            const { blockId } = blockQuery;
            return this.sendJsonRpc('EXPERIMENTAL_changes', {
                changes_type: 'data_changes',
                account_ids: accountIdArray,
                key_prefix_base64: keyPrefix,
                block_id: blockId,
                finality
            });
        });
    }
    /**
     * Gets contract code changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * Note: Change is returned in a base64 encoded WASM file
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-code-changes)
     * @returns {Promise<ChangeResult>}
     */
    contractCodeChanges(accountIdArray, blockQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const { finality } = blockQuery;
            const { blockId } = blockQuery;
            return this.sendJsonRpc('EXPERIMENTAL_changes', {
                changes_type: 'contract_code_changes',
                account_ids: accountIdArray,
                block_id: blockId,
                finality
            });
        });
    }
    /**
     * Returns gas price for a specific block_height or block_hash.
     * @see {@link https://docs.near.org/docs/develop/front-end/rpc#gas-price}
     *
     * @param blockId Block hash or height, or null for latest.
     */
    gasPrice(blockId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sendJsonRpc('gas_price', [blockId]);
        });
    }
    /**
     * Directly call the RPC specifying the method and params
     *
     * @param method RPC method
     * @param params Parameters to the method
     */
    sendJsonRpc(method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, exponential_backoff_1.default)(REQUEST_RETRY_WAIT, REQUEST_RETRY_NUMBER, REQUEST_RETRY_WAIT_BACKOFF, () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const request = {
                        method,
                        params,
                        id: (_nextId++),
                        jsonrpc: '2.0'
                    };
                    const response = yield (0, web_1.fetchJson)(this.connection, JSON.stringify(request));
                    if (response.error) {
                        if (typeof response.error.data === 'object') {
                            if (typeof response.error.data.error_message === 'string' && typeof response.error.data.error_type === 'string') {
                                // if error data has error_message and error_type properties, we consider that node returned an error in the old format
                                throw new errors_1.TypedError(response.error.data.error_message, response.error.data.error_type);
                            }
                            throw (0, rpc_errors_1.parseRpcError)(response.error.data);
                        }
                        else {
                            const errorMessage = `[${response.error.code}] ${response.error.message}: ${response.error.data}`;
                            // NOTE: All this hackery is happening because structured errors not implemented
                            // TODO: Fix when https://github.com/nearprotocol/nearcore/issues/1839 gets resolved
                            if (response.error.data === 'Timeout' || errorMessage.includes('Timeout error')
                                || errorMessage.includes('query has timed out')) {
                                throw new errors_1.TypedError(errorMessage, 'TimeoutError');
                            }
                            throw new errors_1.TypedError(errorMessage, (0, rpc_errors_1.getErrorTypeFromErrorMessage)(response.error.data));
                        }
                    }
                    // Success when response.error is not exist
                    return response;
                }
                catch (error) {
                    if (error.type === 'TimeoutError') {
                        if (!process.env['NEAR_NO_LOGS']) {
                            console.warn(`Retrying request to ${method} as it has timed out`, params);
                        }
                        return null;
                    }
                    throw error;
                }
            }));
            const { result } = response;
            // From jsonrpc spec:
            // result
            //   This member is REQUIRED on success.
            //   This member MUST NOT exist if there was an error invoking the method.
            if (typeof result === 'undefined') {
                throw new errors_1.TypedError(`Exceeded ${REQUEST_RETRY_NUMBER} attempts for request to ${method}.`, 'RetriesExceeded');
            }
            return result;
        });
    }
}
exports.JsonRpcProvider = JsonRpcProvider;
