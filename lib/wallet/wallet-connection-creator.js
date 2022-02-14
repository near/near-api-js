"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWalletConnection = exports.WalletConnectionType = void 0;
const index_1 = require("./index");
var WalletConnectionType;
(function (WalletConnectionType) {
    WalletConnectionType[WalletConnectionType["REDIRECT"] = 0] = "REDIRECT";
    WalletConnectionType[WalletConnectionType["INJECTED"] = 1] = "INJECTED";
    WalletConnectionType[WalletConnectionType["INJECTED_SENDER_WALLET"] = 2] = "INJECTED_SENDER_WALLET";
    WalletConnectionType[WalletConnectionType["INJECTED_WITH_FCK_MANAGEMENT"] = 3] = "INJECTED_WITH_FCK_MANAGEMENT";
})(WalletConnectionType = exports.WalletConnectionType || (exports.WalletConnectionType = {}));
function createWalletConnection(near, appKeyPrefix, { type, data }) {
    switch (type) {
        case WalletConnectionType.REDIRECT: {
            return new index_1.WalletConnectionRedirect(near, appKeyPrefix, data.walletBaseUrl);
        }
        case WalletConnectionType.INJECTED: {
            return new index_1.WalletConnectionInjected(near, appKeyPrefix, data.walletName);
        }
        case WalletConnectionType.INJECTED_SENDER_WALLET: {
            console.warn('Temporary implementation, should be relaced with WalletConnectionInjected');
            return new index_1.WalletConnectionSender(near, appKeyPrefix, data.walletName);
        }
        case WalletConnectionType.INJECTED_WITH_FCK_MANAGEMENT: {
            return new index_1.WalletConnectionInjectedWithFckManagement(near, appKeyPrefix, data.walletName);
        }
        default: {
            throw 'Unsupported WalletConnecitonType';
        }
    }
}
exports.createWalletConnection = createWalletConnection;
