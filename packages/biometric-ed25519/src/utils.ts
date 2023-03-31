import base64 from "@hexagon/base64";
import { ec as EC } from "elliptic";
import { Sha256 } from "@aws-crypto/sha256-js";
import { PublicKey } from "@near-js/crypto";

const USER_NAME_MAX_LENGTH = 25;

export const cleanName = (name: string): string => {
  try {
    return name.toString();
  } catch (e) {
    throw Error('Invalid username');
  }
};

export const preformatMakeCredReq = (makeCredReq) => {
  const challenge = base64.toArrayBuffer(makeCredReq.challenge,true);
  const userId = base64.toArrayBuffer(makeCredReq.user.id,true);

  return {
    ...makeCredReq,
    challenge,
    user: {
        ...makeCredReq.user,
        id: userId,
    },
    ...(makeCredReq.excludeCredentials ? { excludeCredentials:  makeCredReq.excludeCredentials.map((e) => { return { id: base64.toArrayBuffer(e.id, true), type: e.type }})} : {})
  }
};

export const get64BytePublicKeyFromPEM = (publicKey: PublicKey) => {
  var prefix = '\n';
  const publicKeyBase64 = publicKey.toString().split(prefix)
  return base64.toArrayBuffer(`${publicKeyBase64[1]}${publicKeyBase64[2]}`).slice(27);
};

export const getCleanName = (name: string): string => {
  if (!name) {
    throw new Error("username is required");
  }
  const cleanUserName = cleanName(name);
  if (!cleanUserName || typeof cleanUserName !== 'string') {
    throw new Error("Invalid username");
  };
  if (typeof cleanUserName === 'string' && cleanUserName.length > USER_NAME_MAX_LENGTH) {
    throw new Error("username should be less than 25 characters");
  }
  return cleanUserName;
};

export const preformatGetAssertReq = (getAssert) => {
  getAssert.challenge = base64.toArrayBuffer(getAssert.challenge,true);
    
	// Allow any credential, this will be handled later
	for(let allowCred of getAssert.allowCredentials) {
		allowCred.id = base64.toArrayBuffer(allowCred.id,true);
	}

	return getAssert;
};


export const publicKeyCredentialToJSON = (pubKeyCred) => {
  if(pubKeyCred instanceof Array) {
      let arr = [];
      for(let i of pubKeyCred)
          arr.push(publicKeyCredentialToJSON(i));

      return arr;
  }

  if(pubKeyCred instanceof ArrayBuffer) {
      return base64.fromArrayBuffer(pubKeyCred,true);
  }

  if(pubKeyCred instanceof Object) {
      let obj = {};

      for (let key in pubKeyCred) {
          obj[key] = publicKeyCredentialToJSON(pubKeyCred[key]);
      }

      return obj;
  }

  return pubKeyCred;
};

export const recoverPublicKey = async (r, s, message, recovery) => {
  const ec = new EC("p256");
  const sigObj = { r, s };

  if (recovery !== 0 && recovery !== 1) {
      throw new Error('Invalid recovery parameter');
  }
  const hash = new Sha256();
  hash.update(message);
  const h = await hash.digest();
  let Q, P;
  try {
      Q = ec.recoverPubKey(h, sigObj, 0);
      P = ec.recoverPubKey(h, sigObj, 1);
  } catch (err) {
      throw err;
  }
  let publicKeys = [Buffer.from(new Uint8Array(Buffer.from(Q.encode(true, false))).subarray(1, 65)), Buffer.from(new Uint8Array(Buffer.from(P.encode(true, false))).subarray(1, 65))]
  return publicKeys;
};