
import {
    WalletConnection,
    RequestSignTransactionsOptions,
    SignInOptions,
} from './wallet-connection';
import {
    WalletConnectionWithKeyManagement,
} from './wallet-connection-with-key-management';
import {
    WalletConnectionInjected,
} from './injected/wallet-connection-injected';
import {
    WalletConnectionInjectedWithLocalFckManagement,
} from './injected/wallet-connection-injected-with-local-fck-management';
import {
    WalletConnectionRedirect,
    ConnectedWalletAccountRedirect,
} from './redirect/wallet-connection-redirect';
import {
    createWalletConnection,
    WalletConnectionType,
    WalletConnectionParameterOptions,
} from './wallet-connection-creator';
import * as wallet_injected_interface from './injected/wallet-injected-interface';

export {
    createWalletConnection,
    WalletConnectionType,
    WalletConnectionParameterOptions,
    WalletConnection,
    RequestSignTransactionsOptions,
    SignInOptions,
    WalletConnectionWithKeyManagement,
    WalletConnectionInjected,
    WalletConnectionInjectedWithLocalFckManagement,
    WalletConnectionRedirect,
    ConnectedWalletAccountRedirect, //TODO: do we need this export?
    wallet_injected_interface,
};