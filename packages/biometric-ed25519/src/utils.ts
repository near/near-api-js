import base64 from "@hexagon/base64";

export const cleanName = (name: string): string | Error => {
  try {
    return name.toString();
  } catch (e) {
    throw Error('Invalid username');
  }
};

export const preformatMakeCredReq = (makeCredReq) => {
  makeCredReq.challenge = base64.toArrayBuffer(makeCredReq.challenge,true);
  makeCredReq.user.id = base64.toArrayBuffer(makeCredReq.user.id,true);

  // Decode id of each excludeCredentials
  if (makeCredReq.excludeCredentials) {
      makeCredReq.excludeCredentials = makeCredReq.excludeCredentials.map((e) => { return { id: base64.toArrayBuffer(e.id, true), type: e.type };});
  }

  return makeCredReq;
};