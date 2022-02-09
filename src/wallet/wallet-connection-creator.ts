import {
    WalletConnectionRedirect,
    WalletConnectionInjectedWithLocalFckManagement,
    WalletConnectionInjected,
} from './index';
import { Near } from '../near';
import { WalletConnectionBase } from './wallet-connection';

export enum WalletConnectionType {
    REDIRECT,
    INJECTED,
    INJECTED_WITH_LOCAL_FCK_MANAGEMENT,
}

export interface WalletConnectionParameterOptions {
    type: WalletConnectionType;
    data: any;
}

export function createWalletConnection(near: Near, appKeyPrefix: string, { type, data }: WalletConnectionParameterOptions): WalletConnectionBase {
    switch (type) {
    case WalletConnectionType.REDIRECT: {
        return new WalletConnectionRedirect(near, appKeyPrefix, data.walletBaseUrl);
    }
    case WalletConnectionType.INJECTED: {
        return new WalletConnectionInjected(near, appKeyPrefix, data.walletName);
    }
    case WalletConnectionType.INJECTED_WITH_LOCAL_FCK_MANAGEMENT: {
        return new WalletConnectionInjectedWithLocalFckManagement(near, appKeyPrefix, data.walletName);
    }
    default: {
        throw 'Unsupported WalletConnecitonType';
    }
    }
}