import { base64 } from '@hexagon/base64';
import { type KeyPair, KeyPairEd25519 } from '@near-js/crypto';
import { baseEncode } from '@near-js/utils';
import { ed25519 } from '@noble/curves/ed25519';
import { sha256 } from '@noble/hashes/sha256';
import asn1 from 'asn1-parser';
import { Buffer } from 'buffer';
import type { AttestationResult } from 'fido2-lib';
import { Fido2 } from './fido2.js';
import type { AssertionResponse } from './type.js';
import {
    get64BytePublicKeyFromPEM,
    preformatGetAssertReq,
    preformatMakeCredReq,
    publicKeyCredentialToJSON,
    recoverPublicKey,
    sanitizeCreateKeyResponse,
    sanitizeGetKeyResponse,
    uint8ArrayToBigInt,
    validateUsername,
} from './utils.js';

const CHALLENGE_TIMEOUT_MS = 90 * 1000;
const RP_NAME = 'NEAR_API_JS_WEBAUTHN';

const f2l: Fido2 = new Fido2();
const init: () => Promise<void> = async () => {
    await f2l.init({
        rpId: location.hostname,
        rpName: RP_NAME,
        timeout: CHALLENGE_TIMEOUT_MS,
    });
};

function setBufferIfUndefined() {
    if (typeof window !== 'undefined' && !window.Buffer) {
        window.Buffer = Buffer;
    }
}

const concatUint8Arrays = (...arrays: Uint8Array[]): Uint8Array => {
    const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
};

export class PasskeyProcessCanceled extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PasskeyProcessCanceled';
    }
}

export const createKey = async (username: string): Promise<KeyPair> => {
    const cleanUserName = validateUsername(username);
    if (!f2l.f2l) {
        await init();
    }

    const id = base64.fromString(cleanUserName, true);
    const challengeMakeCred = await f2l.registration({
        username: cleanUserName,
        displayName: cleanUserName,
        id,
    });
    const publicKey = preformatMakeCredReq(challengeMakeCred);

    setBufferIfUndefined();
    return navigator.credentials.create({ publicKey }).then(async (res) => {
        if (!res) {
            throw new PasskeyProcessCanceled(
                'Failed to retrieve response from navigator.credentials.create',
            );
        }

        const sanitizedResponse = sanitizeCreateKeyResponse(
            res,
        ) as unknown as AttestationResult;

        const alg = await f2l.checkAlg(sanitizedResponse, {
            challenge: challengeMakeCred.challenge,
            origin,
            factor: 'either',
        });

        if (+alg === -257) {
            throw new Error('Unsupported device');
        }

        const result = await f2l.attestation({
            clientAttestationResponse: sanitizedResponse,
            origin,
            challenge: challengeMakeCred.challenge,
        });
        const publicKey = result.authnrData.get('credentialPublicKeyPem');
        const publicKeyBytes = get64BytePublicKeyFromPEM(publicKey);
        const secretKey = sha256.create().update(publicKeyBytes).digest();
        const pubKey = ed25519.getPublicKey(secretKey);
        return new KeyPairEd25519(
            baseEncode(concatUint8Arrays(secretKey, pubKey)),
        );
    });
};

// Ecrecover returns two possible public keys for a given signature
export const getKeys = async (
    username: string,
): Promise<[KeyPair, KeyPair]> => {
    const cleanUserName = validateUsername(username);
    if (!f2l.f2l) {
        await init();
    }
    const assertionOptions = await f2l.login();
    const options = {
        ...assertionOptions,
        username: cleanUserName,
        allowCredentials: [],
    };
    const publicKey = preformatGetAssertReq(options);

    setBufferIfUndefined();
    return navigator.credentials.get({ publicKey }).then(async (response) => {
        const sanitizedResponse = sanitizeGetKeyResponse(response);
        const getAssertionResponse: AssertionResponse =
            publicKeyCredentialToJSON(sanitizedResponse);
        const signature = new Uint8Array(
            base64.toArrayBuffer(getAssertionResponse.response.signature, true),
        );

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        const parser = asn1?.ASN1?.parse || window?.ASN1?.parse;
        const rAndS = parser(new Uint8Array(signature));
        const clientDataJSON = new Uint8Array(
            base64.toArrayBuffer(
                getAssertionResponse.response.clientDataJSON,
                true,
            ),
        );
        const clientDataJSONHash = sha256
            .create()
            .update(clientDataJSON)
            .digest();
        const authenticatorDataJSON = new Uint8Array(
            base64.toArrayBuffer(
                getAssertionResponse.response.authenticatorData,
                true,
            ),
        );
        const authenticatorAndClientDataJSONHash = concatUint8Arrays(
            authenticatorDataJSON,
            clientDataJSONHash,
        );

        const r = rAndS.children[0].value;
        const s = rAndS.children[1].value;
        const correctPKs = await recoverPublicKey(
            uint8ArrayToBigInt(r),
            uint8ArrayToBigInt(s),
            authenticatorAndClientDataJSONHash,
            0,
        );

        const firstEDSecret = sha256.create().update(correctPKs[0]).digest();
        const firstEDPublic = ed25519.getPublicKey(firstEDSecret);
        const secondEDSecret = sha256.create().update(correctPKs[1]).digest();
        const secondEDPublic = ed25519.getPublicKey(secondEDSecret);
        const firstKeyPair = new KeyPairEd25519(
            baseEncode(concatUint8Arrays(firstEDSecret, firstEDPublic)),
        );
        const secondKeyPair = new KeyPairEd25519(
            baseEncode(concatUint8Arrays(secondEDSecret, secondEDPublic)),
        );
        return [firstKeyPair, secondKeyPair];
    });
};

// To check if current browser supports WebAuthn
export const isPassKeyAvailable = async (): Promise<boolean> => {
    return (
        window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable?.() ||
        false
    );
};

// To check if current device supports biometric ed25519 authentication
export const isDeviceSupported = async (): Promise<boolean> => {
    try {
        await createKey('test-device');
        return true;
    } catch {
        return false;
    }
};
