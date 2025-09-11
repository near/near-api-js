import base64 from '@hexagon/base64';
import { ed25519 } from '@noble/curves/ed25519';
import { sha256 } from '@noble/hashes/sha256';
import { Buffer } from 'buffer';
import asn1 from 'asn1-parser';
import { KeyPair, KeyPairEd25519 } from '@near-js/crypto';
import { baseEncode } from '@near-js/utils';
import {
    validateUsername,
    preformatMakeCredReq,
    get64BytePublicKeyFromPEM,
    preformatGetAssertReq,
    publicKeyCredentialToJSON,
    recoverPublicKey,
    uint8ArrayToBigInt,
    sanitizeCreateKeyResponse,
    sanitizeGetKeyResponse
} from './utils';
import { Fido2 } from './fido2';
import { AssertionResponse } from './index.d';

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
    if (window && !window.Buffer) {
        window.Buffer = Buffer;
    }
}

export class PasskeyProcessCanceled extends Error {
    constructor(message) {
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
    return navigator.credentials.create({ publicKey })
        .then(async (res) => {
            if (!res) {
                throw new PasskeyProcessCanceled('Failed to retrieve response from navigator.credentials.create');
            }

            const sanitizedResponse = sanitizeCreateKeyResponse(res);

            const alg = await f2l.checkAlg(sanitizedResponse, {
                challenge: challengeMakeCred.challenge,
                origin,
                factor: 'either'
            });

            if (+alg === -257) {
                throw new Error('Unsupported device');
            }

            const result = await f2l.attestation({
                clientAttestationResponse: sanitizedResponse,
                origin,
                challenge: challengeMakeCred.challenge
            });
            const publicKey = result.authnrData.get('credentialPublicKeyPem');
            const publicKeyBytes = get64BytePublicKeyFromPEM(publicKey);
            const secretKey = sha256.create().update(Buffer.from(publicKeyBytes)).digest();
            const pubKey = ed25519.getPublicKey(secretKey);
            return new KeyPairEd25519(baseEncode(Buffer.concat([Buffer.from(secretKey), Buffer.from(pubKey)])));
        });
};

// Ecrecover returns two possible public keys for a given signature
export const getKeys = async (username: string): Promise<[KeyPair, KeyPair]> => {
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
    return navigator.credentials.get({ publicKey })
        .then(async (response) => {
            const sanitizedResponse = sanitizeGetKeyResponse(response);
            const getAssertionResponse: AssertionResponse = publicKeyCredentialToJSON(sanitizedResponse);
            const signature = base64.toArrayBuffer(getAssertionResponse.response.signature, true);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const parser = asn1?.ASN1?.parse || window?.ASN1?.parse;
            const rAndS = parser(new Uint8Array(signature));
            const clientDataJSONHash = sha256.create().update(
                Buffer.from(new Uint8Array(base64.toArrayBuffer(getAssertionResponse.response.clientDataJSON, true)))
            ).digest();
            const authenticatorDataJSONHash = Buffer.from(new Uint8Array(base64.toArrayBuffer(getAssertionResponse.response.authenticatorData, true)));
            const authenticatorAndClientDataJSONHash = Buffer.concat([Buffer.from(authenticatorDataJSONHash), Buffer.from(clientDataJSONHash)]);

            const r = rAndS.children[0].value;
            const s = rAndS.children[1].value;
            const correctPKs = await recoverPublicKey(uint8ArrayToBigInt(r), uint8ArrayToBigInt(s), authenticatorAndClientDataJSONHash, 0);

            const firstEDSecret = sha256.create().update(Buffer.from(correctPKs[0])).digest();
            const firstEDPublic = ed25519.getPublicKey(firstEDSecret);
            const secondEDSecret = sha256.create().update(Buffer.from(correctPKs[1])).digest();
            const secondEDPublic = ed25519.getPublicKey(secondEDSecret);
            const firstKeyPair = new KeyPairEd25519(baseEncode(Buffer.concat([Buffer.from(firstEDSecret), Buffer.from(firstEDPublic)])));
            const secondKeyPair = new KeyPairEd25519(baseEncode(Buffer.concat([Buffer.from(secondEDSecret), Buffer.from(secondEDPublic)])));
            return [firstKeyPair, secondKeyPair];
        });
};

// To check if current browser supports WebAuthn
export const isPassKeyAvailable = async (): Promise<boolean> => {
    return window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable?.() || false;
};

// To check if current device supports biometric ed25519 authentication
export const isDeviceSupported = async (): Promise<boolean> => {
    try {
        await createKey('test-device');
        return true;
    } catch (e) {
        return false;
    }
};