import {
    WalletConnectionRedirect,
    WalletConnectionInjectedWithFckManagement,
    WalletConnectionInjected,
    WalletConnectionSender
} from './index';
import { Near } from '../near';
import { WalletConnection } from './wallet-connection';

export enum WalletConnectionType {
    REDIRECT,
    INJECTED,
    INJECTED_SENDER_WALLET, //TODO: tmp implementation, delete
    INJECTED_WITH_FCK_MANAGEMENT,
}

export interface WalletConnectionParameterOptions {
    type: WalletConnectionType;
    data: any;
}

export function createWalletConnection(near: Near, appKeyPrefix: string, { type, data }: WalletConnectionParameterOptions): WalletConnection {
    switch (type) {
        case WalletConnectionType.REDIRECT: {
            return new WalletConnectionRedirect(near, appKeyPrefix, data.walletBaseUrl);
        }
        case WalletConnectionType.INJECTED: {
            return new WalletConnectionInjected(near, appKeyPrefix, data.walletName);
        }
        case WalletConnectionType.INJECTED_SENDER_WALLET: {
            console.warn("Temporary implementation, should be relaced with WalletConnectionInjected");
            return new WalletConnectionSender(near, appKeyPrefix, data.walletName);
        }
        case WalletConnectionType.INJECTED_WITH_FCK_MANAGEMENT: {
            return new WalletConnectionInjectedWithFckManagement(near, appKeyPrefix, data.walletName);
        }
        default: {
            throw 'Unsupported WalletConnecitonType';
        }
    }
}