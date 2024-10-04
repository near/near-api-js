import type { ISignatureCrypto } from "./key_pair_base";
import {PublicKey} from "./public_key";

export type KeyPairString = string;
export interface IKeyPair {
  publicKey: string;
  secretKey: string;

  sign(message: Uint8Array): ISignatureCrypto;
  verify(message: Uint8Array, signature: Uint8Array): boolean;
  toString(): KeyPairString;
  getPublicKey(): PublicKey;
}
