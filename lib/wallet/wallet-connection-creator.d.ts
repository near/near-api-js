import { Near } from '../near';
import { WalletConnection } from './wallet-connection';
export declare enum WalletConnectionType {
    REDIRECT = 0,
    INJECTED = 1,
    INJECTED_WITH_LOCAL_FCK_MANAGEMENT = 2
}
export interface WalletConnectionParameterOptions {
    type: WalletConnectionType;
    data: any;
}
export declare function createWalletConnection(near: Near, appKeyPrefix: string, { type, data }: WalletConnectionParameterOptions): WalletConnection;
