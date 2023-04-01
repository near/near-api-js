import { PublicKey } from '@near-js/crypto';
import BN from 'bn.js';
import { baseDecode } from 'borsh';

import { actionCreators } from './action_creators';
import { SignedDelegate } from './actions';
import { Transaction } from './schema';

const { signedDelegate: signedDelegateAction } = actionCreators;

interface MetaTransactionOptions {
    accountId: string;
    blockHash: string;
    signedDelegate: SignedDelegate;
    signerNonce: BN;
    signerPublicKey: PublicKey;
}

/**
 * Compose a meta transaction encapsulating a signed delegate action
 * @params.accountId Account ID for the sender of the transaction, i.e. the meta transaction relayer account
 * @params.blockHash Current block hash
 * @params.signedDelegate SignedDelegate action instance
 * @params.signerNonce Current nonce on the access key used to sign the meta transaction
 * @params.signerPublicKey Public key for the access key used to sign the meta transaction
 */
export function buildMetaTransaction({
    accountId,
    blockHash,
    signedDelegate,
    signerNonce,
    signerPublicKey,
}: MetaTransactionOptions): Transaction {
    const { delegateAction } = signedDelegate;

    return new Transaction({
        signerId: accountId,
        publicKey: signerPublicKey,
        nonce: signerNonce,
        receiverId: delegateAction.senderId,
        actions: [signedDelegateAction(signedDelegate)],
        blockHash: baseDecode(blockHash),
    });
}
