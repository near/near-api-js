import base64 from '@hexagon/base64';
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

// This function is design to convert any existing Uint8Array properties inside AuthenticatorAssertionResponse to ArrayBuffer
export const convertUint8ArrayToBuffer = (obj) => {
    // Function to handle the conversion of each property
    function handleConversion(item) {
        if (item instanceof Uint8Array) {
            // Convert Uint8Array to ArrayBuffer
            return item.buffer.slice(item.byteOffset, item.byteOffset + item.byteLength);
        } else if (Array.isArray(item)) {
            // Process array items
            return item.map(handleConversion);
        } else if (item !== null && typeof item === 'object') {
            // Process object properties
            return Object.keys(item).reduce((acc, key) => {
                acc[key] = handleConversion(item[key]);
                return acc;
            }, {});
        }
        // Return the item if it's not a Uint8Array or an Object
        return item;
    }

    return handleConversion(obj);
};