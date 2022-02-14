import { Wallet, RequestSignTransactionsOptions, SignInOptions } from './wallet-interface';
import { WalletConnection } from './wallet-connection';
import { WalletConnectionWithKeyManagement } from './wallet-connection-with-key-management';
import { WalletConnectionInjected } from './injected/wallet-connection-injected';
import { WalletConnectionSender } from './injected/wallet-connection-sender';
import { WalletConnectionInjectedWithFckManagement } from './injected/wallet-connection-injected-with-fck-management';
import { WalletConnectionRedirect, ConnectedWalletAccountRedirect } from './redirect/wallet-connection-redirect';
import { createWalletConnection, WalletConnectionType, WalletConnectionParameterOptions } from './wallet-connection-creator';
import * as wallet_injected_interface from './injected/wallet-injected-interface';
export { Wallet, RequestSignTransactionsOptions, SignInOptions, createWalletConnection, WalletConnectionType, WalletConnectionParameterOptions, WalletConnection, WalletConnectionWithKeyManagement, WalletConnectionInjected, WalletConnectionSender, WalletConnectionInjectedWithFckManagement, WalletConnectionRedirect, ConnectedWalletAccountRedirect, //TODO: do we need this export?
wallet_injected_interface, };
