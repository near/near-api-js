import { base64 } from '@hexagon/base64';
import { p256 } from '@noble/curves/p256';
import { sha256 } from '@noble/hashes/sha256';
import { PublicKey } from '@near-js/crypto';

export const preformatMakeCredReq = (makeCredReq) => {
    const challenge = base64.toArrayBuffer(makeCredReq.challenge, true);
    const userId = base64.toArrayBuffer(makeCredReq.user.id, true);

    return {
        ...makeCredReq,
        challenge,
        user: {
            ...makeCredReq.user,
            id: userId,
        },
        ...(makeCredReq.excludeCredentials ? {
            excludeCredentials: makeCredReq.excludeCredentials.map((e) => {
                return { id: base64.toArrayBuffer(e.id, true), type: e.type };
            })
        } : {})
    };
};

export const get64BytePublicKeyFromPEM = (publicKey: PublicKey) => {
    const prefix = '\n';
    const publicKeyBase64 = publicKey.toString().split(prefix);
    return base64.toArrayBuffer(`${publicKeyBase64[1]}${publicKeyBase64[2]}`).slice(27, 59);
};

export const validateUsername = (name: string): string => {
    if (!name) {
        throw new Error('username is required');
    }
    return name;
};

export const preformatGetAssertReq = (getAssert) => {
    getAssert.challenge = base64.toArrayBuffer(getAssert.challenge, true);

    // Allow any credential, this will be handled later
    for (const allowCred of getAssert.allowCredentials) {
        allowCred.id = base64.toArrayBuffer(allowCred.id, true);
    }

    return getAssert;
};


export const publicKeyCredentialToJSON = (pubKeyCred) => {
    if (pubKeyCred instanceof Array) {
        const arr = [];
        for (const i of pubKeyCred)
            arr.push(publicKeyCredentialToJSON(i));

        return arr;
    }

    if (pubKeyCred instanceof ArrayBuffer) {
        return base64.fromArrayBuffer(pubKeyCred, true);
    }

    if (pubKeyCred instanceof Object) {
        const obj = {};

        for (const key in pubKeyCred) {
            obj[key] = publicKeyCredentialToJSON(pubKeyCred[key]);
        }

        return obj;
    }

    return pubKeyCred;
};

export const recoverPublicKey = async (r, s, message, recovery) => {
    if (recovery !== 0 && recovery !== 1) {
        throw new Error('Invalid recovery parameter');
    }

    const sigObjQ = new p256.Signature(r, s).addRecoveryBit(0);
    const sigObjP = new p256.Signature(r, s).addRecoveryBit(1);
    const hash = sha256.create().update(message).digest();

    const Q = sigObjQ.recoverPublicKey(hash);
    const P = sigObjP.recoverPublicKey(hash);
    return [Q.toRawBytes().subarray(1, 33), P.toRawBytes().subarray(1, 33)];
};

export const uint8ArrayToBigInt = (uint8Array: Uint8Array) => {
    const array = Array.from(uint8Array);
    return BigInt('0x' + array.map(byte => byte.toString(16).padStart(2, '0')).join(''));
};

const convertUint8ArrayToArrayBuffer = (obj: any) => {
    if (obj instanceof Uint8Array) {
        return obj.buffer.slice(obj.byteOffset, obj.byteOffset + obj.byteLength);
    }
    return obj;
};

// This function is used to sanitize the response from navigator.credentials.create(), seeking for any Uint8Array and converting them to ArrayBuffer
// This function has multiple @ts-ignore because types are not up to date with standard type below:
// https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAttestationResponse
// an AuthenticatorAttestationResponse (when the PublicKeyCredential is created via CredentialsContainer.create())
export const sanitizeCreateKeyResponse = (res: Credential) => {
    if (res instanceof PublicKeyCredential && (
        res.rawId instanceof Uint8Array ||
        res.response.clientDataJSON instanceof Uint8Array ||
        //  eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore - attestationObject is not defined in Credential
        res.response.attestationObject instanceof Uint8Array
    )) {
        return {
            ...res,
            rawId: convertUint8ArrayToArrayBuffer(res.rawId),
            response: {
                ...res.response,
                clientDataJSON: convertUint8ArrayToArrayBuffer(res.response.clientDataJSON),
                //  eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //  @ts-ignore - attestationObject is not defined in Credential
                attestationObject: convertUint8ArrayToArrayBuffer(res.response.attestationObject),
            }
        };
    }
    return res;  
};

// This function is used to sanitize the response from navigator.credentials.get(), seeking for any Uint8Array and converting them to ArrayBuffer
// This function has multiple @ts-ignore because types are not up to date with standard type below:
// https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAssertionResponse
// an AuthenticatorAssertionResponse (when the PublicKeyCredential is obtained via CredentialsContainer.get()).
export const sanitizeGetKeyResponse = (res: Credential) => {
    if (res instanceof PublicKeyCredential && (
        res.rawId instanceof Uint8Array ||
      //   eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //   @ts-ignore - authenticatorData is not defined in Credential
      res.response.authenticatorData instanceof Uint8Array ||
      res.response.clientDataJSON instanceof Uint8Array ||
      //   eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //   @ts-ignore - signature is not defined in Credential
      res.response.signature instanceof Uint8Array ||
      //   eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //   @ts-ignore - userHandle is not defined in Credential
      res.response.userHandle instanceof Uint8Array
    )) {
        return {
            ...res,
            rawId: convertUint8ArrayToArrayBuffer(res.rawId),
            response: {
                ...res.response,
                //   eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //   @ts-ignore - authenticatorData is not defined in Credential
                authenticatorData: convertUint8ArrayToArrayBuffer(res.response.authenticatorData),
                clientDataJSON: convertUint8ArrayToArrayBuffer(res.response.clientDataJSON),
                //   eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //   @ts-ignore - signature is not defined in Credential
                signature: convertUint8ArrayToArrayBuffer(res.response.signature),
                //   eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //   @ts-ignore - userHandle is not defined in Credential
                userHandle: convertUint8ArrayToArrayBuffer(res.response.userHandle),
            }
        };
    }
    return res;
};