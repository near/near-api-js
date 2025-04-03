import { sha256 } from '@noble/hashes/sha256';

import { SignedDelegate } from './actions';
import type { DelegateAction } from './delegate';
import { encodeDelegateAction } from './schema';
import { Signature } from './signature';
import { KeyType } from '@near-js/crypto';

interface MessageSigner {
    sign(message: Uint8Array): Promise<Uint8Array>;
}

interface SignDelegateOptions {
    delegateAction: DelegateAction;
    signer: MessageSigner;
}

export interface SignedDelegateWithHash {
    hash: Uint8Array;
    signedDelegateAction: SignedDelegate;
}


/**
 * Sign a delegate action
 * @options SignDelegate options
 * @param options.delegateAction Delegate action to be signed by the meta transaction sender
 * @param options.signer Signer instance for the meta transaction sender
 */
export async function signDelegateAction({
    delegateAction,
    signer,
}: SignDelegateOptions): Promise<SignedDelegateWithHash> {
    const message = encodeDelegateAction(delegateAction);
    const signature = await signer.sign(message);

    const keyType = delegateAction.publicKey.ed25519Key
        ? KeyType.ED25519
        : KeyType.SECP256K1;
    const signedDelegateAction = new SignedDelegate({
        delegateAction,
        signature: new Signature({
            keyType,
            data: signature,
        }),
    });

    return {
        hash: new Uint8Array(sha256(message)),
        signedDelegateAction,
    };
}
