import base64 from '@hexagon/base64';
import { ed25519 } from '@noble/curves/ed25519';
import { Sha256 } from '@aws-crypto/sha256-js';
import { Buffer } from 'buffer';
import asn1 from 'asn1-parser';
import { KeyPair } from '@near-js/crypto';
import { baseEncode } from '@near-js/utils';
import {
    validateUsername,
    preformatMakeCredReq,
    get64BytePublicKeyFromPEM,
    preformatGetAssertReq,
    publicKeyCredentialToJSON,
    recoverPublicKey
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

            const result = await f2l.attestation({
                clientAttestationResponse: res,
                origin,
                challenge: challengeMakeCred.challenge
            });
            const publicKey = result.authnrData.get('credentialPublicKeyPem');
            const publicKeyBytes = get64BytePublicKeyFromPEM(publicKey);
            const edSha256 = new Sha256();
            edSha256.update(Buffer.from(publicKeyBytes));
            const secretKey = await edSha256.digest();
            const pubKey = ed25519.getPublicKey(secretKey);
            return KeyPair.fromString(baseEncode(new Uint8Array(Buffer.concat([secretKey, Buffer.from(pubKey)]))));
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
        .then(async (response: Credential) => {
            const getAssertionResponse: AssertionResponse = publicKeyCredentialToJSON(response);
            const signature = base64.toArrayBuffer(getAssertionResponse.response.signature, true);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const parser = asn1?.ASN1?.parse || window?.ASN1?.parse;
            const rAndS = parser(new Uint8Array(signature));
            const clientDataSha256 = new Sha256();
            clientDataSha256.update(
                Buffer.from(new Uint8Array(base64.toArrayBuffer(getAssertionResponse.response.clientDataJSON, true)))
            );
            const clientDataJSONHash = await clientDataSha256.digest();
            const AuthenticatiorDataJSONHash = Buffer.from(new Uint8Array(base64.toArrayBuffer(getAssertionResponse.response.authenticatorData, true)));
            const authenticatorAndClientDataJSONHash = Buffer.concat([AuthenticatiorDataJSONHash, clientDataJSONHash]);

            const correctPKs = await recoverPublicKey(rAndS.children[0].value, rAndS.children[1].value, authenticatorAndClientDataJSONHash, 0);
            
            const firstEdSha256 = new Sha256();
            firstEdSha256.update(Buffer.from(correctPKs[0]));
            const secondEdSha256 = new Sha256();
            secondEdSha256.update(Buffer.from(correctPKs[1]));

            const firstEDSecret = await firstEdSha256.digest();
            const firstEDPublic = ed25519.getPublicKey(firstEDSecret);
            const secondEDSecret = await secondEdSha256.digest();
            const secondEDPublic = ed25519.getPublicKey(secondEDSecret);
            const firstKeyPair = KeyPair.fromString(baseEncode(new Uint8Array(Buffer.concat([firstEDSecret, Buffer.from(firstEDPublic)]))));
            const secondKeyPair = KeyPair.fromString(baseEncode(new Uint8Array(Buffer.concat([secondEDSecret, Buffer.from(secondEDPublic)]))));
            return [firstKeyPair, secondKeyPair];
        });
};

// To check if current browser supports WebAuthn
export const isPassKeyAvailable = async (): Promise<boolean> => {
    return window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable?.() || false;
};
