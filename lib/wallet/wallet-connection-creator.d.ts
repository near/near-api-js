import { Near } from '../near';
import { WalletConnection } from './wallet-connection';
export declare enum WalletConnectionType {
    REDIRECT = 0,
    INJECTED = 1,
    INJECTED_SENDER_WALLET = 2,
    INJECTED_WITH_FCK_MANAGEMENT = 3
}
export interface WalletConnectionParameterOptions {
    type: WalletConnectionType;
    data: any;
}
export declare function createWalletConnection(near: Near, appKeyPrefix: string, { type, data }: WalletConnectionParameterOptions): WalletConnection;
