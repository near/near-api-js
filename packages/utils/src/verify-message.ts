import {
    SignedMessage,
} from '@near-js/signer'; // shared type maybe?

type SignedMessage {
    accountId: string; // The account name to which the publicKey corresponds as plain text (e.g. "alice.near")
    publicKey: PublicKey; // The public counterpart of the key used to sign, expressed as a string with format "<key-type>:<base58-key-bytes>" (e.g. "ed25519:6TupyNrcHGTt5XRLmHTc2KGaiSbjhQi1KHtCXTgbcr4Y")
    signature: Uint8Array; // The base64 representation of the signature.
    state?: string;
}

export function verifyNep413Message({ accountId, publicKey, signature, state }: SignedMessage) {
    // we need to be passed the payload (what the message SHOULD be)
    const dataThatWasHashed = createNEP413Payload(nep413PayloadToVerify);

    const payloadHash = hashPayload(dataThatWasHashed);
    const signatureBytes = base64.decode(signedMessage);

    // determine the keypair type from publicKey
    KeyPair.fromString(publicKey) 

    // if it is ed22519, then verify this way:
    const isValid = ed25519.verify(
        signatureBytes,
        payloadHash,
        base58.decode(publicKey.split(":")[1]),
    );
    if (!isValid) {
        throw new Error("Ed25519 signature verification failed.");
    }
    
    return true;    


    try { // I do think we should throw, because there may be an unsupported keypair type
        // return the verified payload on success, { success: true, payload: verifiedPayload }


        verifySignature(payloadHash, signatureBytes, publicKey);
    } catch (error) {
        throw new Error(
            `Cryptographic signature verification failed: ${error instanceof Error ? error.message : String(error)
            }`,
        );
    }
}

export function verifySignature(
    payloadHash: Uint8Array,
    signatureBytes: Uint8Array,
    publicKeyString: string,
): boolean {
    if (publicKeyString.startsWith(ED25519_PREFIX)) {
        const isValid = ed25519.verify(
            signatureBytes,
            payloadHash,
            base58.decode(publicKeyString.split(":")[1]),
        );
        if (!isValid) {
            throw new Error("Ed25519 signature verification failed.");
        }
        return true;
    }

    throw new Error(
        `Unsupported public key type: "${publicKeyString}". Must start with "${ED25519_PREFIX}".`,
    );
}
