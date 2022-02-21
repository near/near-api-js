import { SignAndSendTransactionOptions } from '../../account';
import { SignInOptions, Wallet } from '../interface';

class WalletRedirect implements Wallet {
    requestSignIn: ({ contractId, methodNames }: SignInOptions) => void;
    isSignedIn: () => boolean;
    signOut: () => boolean;
    getAccountId: () => string;
    requestSignTransaction: (options: SignAndSendTransactionOptions) => void;
}