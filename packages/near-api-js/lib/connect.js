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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
/**
 * Connect to NEAR using the provided configuration.
 *
 * {@link ConnectConfig.networkId} and {@link ConnectConfig.nodeUrl} are required.
 *
 * To sign transactions you can also pass:
 * 1. {@link ConnectConfig.keyStore}
 * 2. {@link ConnectConfig.keyPath}
 *
 * If all three are passed they are prioritize in that order.
 *
 * @see {@link ConnectConfig}
 * @example
 * ```js
 * async function initNear() {
 *   const near = await connect({
 *      networkId: 'testnet',
 *      nodeUrl: 'https://rpc.testnet.near.org'
 *   })
 * }
 * ```
 * @module connect
 */
const unencrypted_file_system_keystore_1 = require("./key_stores/unencrypted_file_system_keystore");
const key_stores_1 = require("./key_stores");
const near_1 = require("./near");
const setup_node_fetch_1 = __importDefault(require("./utils/setup-node-fetch"));
const utils_1 = require("./utils");
global.fetch = setup_node_fetch_1.default;
/**
 * Initialize connection to Near network.
 */
function connect(config) {
    return __awaiter(this, void 0, void 0, function* () {
        // Try to find extra key in `KeyPath` if provided.
        if (config.keyPath && config.keyStore) {
            try {
                const accountKeyFile = yield (0, unencrypted_file_system_keystore_1.readKeyFile)(config.keyPath);
                if (accountKeyFile[0]) {
                    // TODO: Only load key if network ID matches
                    const keyPair = accountKeyFile[1];
                    const keyPathStore = new key_stores_1.InMemoryKeyStore();
                    yield keyPathStore.setKey(config.networkId, accountKeyFile[0], keyPair);
                    if (!config.masterAccount) {
                        config.masterAccount = accountKeyFile[0];
                    }
                    config.keyStore = new key_stores_1.MergeKeyStore([
                        keyPathStore,
                        config.keyStore
                    ], { writeKeyStoreIndex: 1 });
                    if (!process.env["NEAR_NO_LOGS"]) {
                        console.log(`Loaded master account ${accountKeyFile[0]} key from ${config.keyPath} with public key = ${keyPair.getPublicKey()}`);
                    }
                }
            }
            catch (error) {
                (0, utils_1.logWarning)(`Failed to load master account key from ${config.keyPath}: ${error}`);
            }
        }
        return new near_1.Near(config);
    });
}
exports.connect = connect;
