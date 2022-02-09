import { WalletConnectionWithKeyManagement } from './wallet-connection';
import { WalletConnectionInjected } from './injected/wallet-connection-injected';
import { WalletConnectionInjectedWithLocalFckManagement } from './injected/wallet-connection-injected-with-local-fck-management';
import { WalletConnectionRedirect, ConnectedWalletAccountRedirect } from './redirect/wallet-connection-redirect';
import * as wallet_injected_interface from './injected/wallet-injected-interface';
export { WalletConnectionWithKeyManagement, WalletConnectionInjected, WalletConnectionInjectedWithLocalFckManagement, WalletConnectionRedirect, ConnectedWalletAccountRedirect, //TODO: do we need this export?
wallet_injected_interface, };
