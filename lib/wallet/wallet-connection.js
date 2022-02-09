"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnection = void 0;
class WalletConnection {
    /**
    * @param {Near} near Near object
    * @param {string} appKeyPrefix application identifier
    */
    constructor(near, appKeyPrefix) {
        this._near = near;
        appKeyPrefix = appKeyPrefix || near.config.contractName || 'default';
    }
}
exports.WalletConnection = WalletConnection;
