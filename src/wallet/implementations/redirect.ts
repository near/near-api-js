import { RequestSignTransactionsOptions, SignInOptions, Wallet } from '../interface';

class WalletRedirect implements Wallet {
    requestSignIn: ({ contractId, methodNames }: SignInOptions) => void;
    isSignedIn: () => boolean;
    signOut: () => boolean;
    getAccountId: () => string;
    requestSignTransactions: (params: RequestSignTransactionsOptions) => void;
}