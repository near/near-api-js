import base64 from "@hexagon/base64";
import { cleanName, preformatMakeCredReq } from "./utils";
import { Fido2 } from "./fido2";

const USER_NAME_MAX_LENGTH = 25;

export const createKey = async (username) => {
  if (!username) {
    throw new Error("username is required");
  }
  const cleanUserName = cleanName(username);
  if (!cleanUserName || typeof cleanUserName !== 'string') {
    throw new Error("Invalid username");
  };
  if (typeof cleanUserName === 'string' && cleanUserName.length > USER_NAME_MAX_LENGTH) {
    throw new Error("username should be less than 25 characters");
  }
  console.log('cleanUserName', cleanUserName);
  console.log('base64', base64);

  console.log('base64.fromString', base64.fromString);
  const id = base64.fromString(cleanUserName, true);
  const f2l = new Fido2();
  const challengeMakeCred = await f2l.registration(cleanUserName, cleanUserName, id);
  const publicKey = preformatMakeCredReq(challengeMakeCred);
//   const transports = publicKey.response.getTransports ? publicKey.response.getTransports() : undefined;
//   const makeCredResponse = {
//     id: publicKey.response.id,
//     rawId: base64.fromArrayBuffer(publicKey.response.rawId, true),
//     transports: transports,
//     response: {
//         attestationObject: base64.fromArrayBuffer(publicKey.response.attestationObject, true),
//         clientDataJSON: base64.fromArrayBuffer(publicKey.response.clientDataJSON, true)
//     },
//     type: publicKey.response.type
// };
  return publicKey;
};

export const getPrivateKey = async () => {

};