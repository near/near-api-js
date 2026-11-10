import { deserialize } from 'borsh';
import { KeyType, PublicKey } from '../crypto/index.js';
import { Action, SignedDelegate } from './actions.js';
import { DelegateAction } from './delegate.js';
import { SCHEMA } from './schema.js';
import { Signature } from './signature.js';

type BorshSignature = {
    ed25519Signature?: { data: Uint8Array };
    secp256k1Signature?: { data: Uint8Array };
    mlDsa65Signature?: { data: Uint8Array };
};

/**
 * Borsh-decode a signed delegate into class instances suitable for inspection or relaying.
 * @param bytes Borsh-encoded signed delegate
 */
export function decodeSignedDelegate(bytes: Uint8Array): SignedDelegate {
    const { delegateAction, signature } = deserialize(SCHEMA.SignedDelegate, bytes) as {
        delegateAction: DelegateAction;
        signature: BorshSignature;
    };
    return new SignedDelegate({
        delegateAction: new DelegateAction({
            ...delegateAction,
            publicKey: PublicKey.from(delegateAction.publicKey),
            actions: delegateAction.actions.map((action) => new Action(action)),
        }),
        signature: signatureFromBorsh(signature),
    });
}

function signatureFromBorsh(signature: BorshSignature): Signature {
    if (signature.ed25519Signature)
        return new Signature({ keyType: KeyType.ED25519, data: Uint8Array.from(signature.ed25519Signature.data) });
    if (signature.secp256k1Signature)
        return new Signature({ keyType: KeyType.SECP256K1, data: Uint8Array.from(signature.secp256k1Signature.data) });
    if (signature.mlDsa65Signature)
        return new Signature({ keyType: KeyType.MLDSA65, data: Uint8Array.from(signature.mlDsa65Signature.data) });
    throw new Error('Unsupported signed delegate signature');
}
