"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wallet_injected_interface = exports.ConnectedWalletAccountRedirect = exports.WalletConnectionRedirect = exports.WalletConnectionInjectedWithFckManagement = exports.WalletConnectionSender = exports.WalletConnectionInjected = exports.WalletConnectionWithKeyManagement = exports.WalletConnection = exports.WalletConnectionType = exports.createWalletConnection = void 0;
const wallet_connection_1 = require("./wallet-connection");
Object.defineProperty(exports, "WalletConnection", { enumerable: true, get: function () { return wallet_connection_1.WalletConnection; } });
const wallet_connection_with_key_management_1 = require("./wallet-connection-with-key-management");
Object.defineProperty(exports, "WalletConnectionWithKeyManagement", { enumerable: true, get: function () { return wallet_connection_with_key_management_1.WalletConnectionWithKeyManagement; } });
const wallet_connection_injected_1 = require("./injected/wallet-connection-injected");
Object.defineProperty(exports, "WalletConnectionInjected", { enumerable: true, get: function () { return wallet_connection_injected_1.WalletConnectionInjected; } });
const wallet_connection_sender_1 = require("./injected/wallet-connection-sender");
Object.defineProperty(exports, "WalletConnectionSender", { enumerable: true, get: function () { return wallet_connection_sender_1.WalletConnectionSender; } });
const wallet_connection_injected_with_fck_management_1 = require("./injected/wallet-connection-injected-with-fck-management");
Object.defineProperty(exports, "WalletConnectionInjectedWithFckManagement", { enumerable: true, get: function () { return wallet_connection_injected_with_fck_management_1.WalletConnectionInjectedWithFckManagement; } });
const wallet_connection_redirect_1 = require("./redirect/wallet-connection-redirect");
Object.defineProperty(exports, "WalletConnectionRedirect", { enumerable: true, get: function () { return wallet_connection_redirect_1.WalletConnectionRedirect; } });
Object.defineProperty(exports, "ConnectedWalletAccountRedirect", { enumerable: true, get: function () { return wallet_connection_redirect_1.ConnectedWalletAccountRedirect; } });
const wallet_connection_creator_1 = require("./wallet-connection-creator");
Object.defineProperty(exports, "createWalletConnection", { enumerable: true, get: function () { return wallet_connection_creator_1.createWalletConnection; } });
Object.defineProperty(exports, "WalletConnectionType", { enumerable: true, get: function () { return wallet_connection_creator_1.WalletConnectionType; } });
const wallet_injected_interface = __importStar(require("./injected/wallet-injected-interface"));
exports.wallet_injected_interface = wallet_injected_interface;
