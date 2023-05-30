import base64 from '@hexagon/base64';
import { eddsa as EDDSA } from 'elliptic';
import { Sha256 } from '@aws-crypto/sha256-js';
import { Buffer } from 'buffer';
import asn1 from 'asn1-parser';
import { KeyPair } from '@near-js/crypto';
import { baseEncode } from 'borsh';
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
            const result = await f2l.attestation({
                clientAttestationResponse: res,
                origin,
                challenge: challengeMakeCred.challenge
            });
            const publicKey = result.authnrData.get('credentialPublicKeyPem');
            const publicKeyBytes = get64BytePublicKeyFromPEM(publicKey);
            const ed = new EDDSA('ed25519');
            const edSha256 = new Sha256();
            edSha256.update(Buffer.from(publicKeyBytes));
            const key = ed.keyFromSecret(await edSha256.digest());
            return KeyPair.fromString(baseEncode(new Uint8Array(Buffer.concat([key.getSecret(), Buffer.from(key.getPublic())]))));
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
            const ed = new EDDSA('ed25519');
            const firstEdSha256 = new Sha256();
            firstEdSha256.update(Buffer.from(correctPKs[0]));
            const secondEdSha256 = new Sha256();
            secondEdSha256.update(Buffer.from(correctPKs[1]));

            const firstED = ed.keyFromSecret(await firstEdSha256.digest());
            const secondED = ed.keyFromSecret(await secondEdSha256.digest());
            const firstKeyPair = KeyPair.fromString(baseEncode(new Uint8Array(Buffer.concat([firstED.getSecret(), Buffer.from(firstED.getPublic())]))));
            const secondKeyPair = KeyPair.fromString(baseEncode(new Uint8Array(Buffer.concat([secondED.getSecret(), Buffer.from(secondED.getPublic())]))));
            return [firstKeyPair, secondKeyPair];
        });
};

// To check if current browser supports WebAuthn
export const isPassKeyAvailable = async (): Promise<boolean> => {
    if (!PublicKeyCredential || !PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable) {  
        return Promise.resolve(false);
    }
    return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
};
