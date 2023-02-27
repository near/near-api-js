import base64 from "@hexagon/base64";
import { eddsa as EDDSA } from "elliptic";
import { createHash } from "crypto";
import { Buffer } from "buffer";
import asn1 from "asn1-parser";
import { KeyPair } from "near-api-js";
import { base_encode } from "near-api-js/lib/utils/serialize";
import { getCleanName, preformatMakeCredReq, get64BytePublicKeyFromPEM, preformatGetAssertReq, publicKeyCredentialToJSON, recoverPublicKey1 } from "./utils";
import { Fido2 } from "./fido2";
import { AssertionResponse } from "./index.d";

const CHALLENGE_TIMEOUT_MS = 90 * 1000;
const RP_NAME = "NEAR_API_JS_WEBAUTHN";
const RP_ID = location.hostname;

const f2l: Fido2 = new Fido2();
const init: () => Promise<void> = async () => {
  await f2l.init(RP_ID, RP_NAME, CHALLENGE_TIMEOUT_MS);
};

if (window && !window.Buffer) {
  window.Buffer = Buffer;
}

export const createKey = async (username: string): Promise<KeyPair>  => {
  const cleanUserName = getCleanName(username);
  if (!f2l.f2l) {
    await init();
  }

  const id = base64.fromString(cleanUserName, true);
  const challengeMakeCred = await f2l.registration(cleanUserName, cleanUserName, id);
  const publicKey = preformatMakeCredReq(challengeMakeCred);

  return navigator.credentials.create({ publicKey })
    .then(async (res) => {
      const result = await f2l.attestation(res, origin, challengeMakeCred.challenge);
      const publicKey = result.authnrData.get("credentialPublicKeyPem");
      const publicKeyBytes = get64BytePublicKeyFromPEM(publicKey);
      const ed = new EDDSA("ed25519");
      const key = ed.keyFromSecret(createHash('sha256').update(Buffer.from(publicKeyBytes)).digest());
      return KeyPair.fromString(base_encode(new Uint8Array(Buffer.concat([key.getSecret(), Buffer.from(key.getPublic())]))));
    });
};

// Ecrecover returns two possible public keys for a given signature
export const getKeys = async (username: string): Promise<[KeyPair, KeyPair]> => {
  const cleanUserName = getCleanName(username);
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

  return navigator.credentials.get({ publicKey })
    .then(async (response: Credential)=> {
      const getAssertionResponse: AssertionResponse = publicKeyCredentialToJSON(response);
      const signature = base64.toArrayBuffer(getAssertionResponse.response.signature, true);

      //@ts-ignore
      const parser = asn1?.ASN1?.parse || window?.ASN1?.parse;
      const rAndS = parser(new Uint8Array(signature));
      const clientDataJSONHash = createHash('sha256').update(
        Buffer.from(new Uint8Array(base64.toArrayBuffer(getAssertionResponse.response.clientDataJSON, true)))
      ).digest();
      const AuthenticatiorDataJSONHash = Buffer.from(new Uint8Array(base64.toArrayBuffer(getAssertionResponse.response.authenticatorData, true)))
      const authenticatorAndClientDataJSONHash = Buffer.concat([AuthenticatiorDataJSONHash, clientDataJSONHash]);
    
      const correctPKs = recoverPublicKey1(rAndS.children[0].value, rAndS.children[1].value, authenticatorAndClientDataJSONHash, 0);
      const ed = new EDDSA("ed25519");
      const firstED = ed.keyFromSecret(createHash('sha256').update(correctPKs[0]).digest());
      const secondED = ed.keyFromSecret(createHash('sha256').update(correctPKs[1]).digest());
      const firstKeyPair = KeyPair.fromString(base_encode(new Uint8Array(Buffer.concat([firstED.getSecret(), Buffer.from(firstED.getPublic())]))));
      const secondKeyPair = KeyPair.fromString(base_encode(new Uint8Array(Buffer.concat([secondED.getSecret(), Buffer.from(secondED.getPublic())]))));
      return [firstKeyPair, secondKeyPair];
    });
};