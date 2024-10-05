import { KeyType } from '@near-js/crypto';

interface ED25519Signature {
  keyType: KeyType.ED25519;
  data: Uint8Array;
}

interface SECP256K1Signature {
  keyType: KeyType.SECP256K1;
  data: Uint8Array;
}

function resolveEnumKeyName(keyType: KeyType): string {
  switch (keyType) {
    case KeyType.ED25519:
      return 'ed25519Signature';
    case KeyType.SECP256K1:
      return 'secp256k1Signature';
    default:
      throw Error(`unknown type ${keyType}`);
  }
}

export interface ISignatureTx {
  ed25519Signature?: ED25519Signature;
  secp256k1Signature?: SECP256K1Signature;
}

export function createSignature(signature: {
  keyType: KeyType;
  data: Uint8Array;
}): ISignatureTx {
  const keyName = resolveEnumKeyName(signature.keyType);
  return { [keyName]: signature } as ISignatureTx;
}


// import { KeyType } from '@near-js/crypto';
// import { Enum } from '@near-js/types';
//
// class ED25519Signature { keyType: KeyType = KeyType.ED25519; data: Uint8Array; }
// class SECP256K1Signature { keyType: KeyType = KeyType.SECP256K1; data: Uint8Array; }
//
// function resolveEnumKeyName(keyType: KeyType) {
//     switch (keyType) {
//         case KeyType.ED25519: {
//             return 'ed25519Signature';
//         }
//         case KeyType.SECP256K1: {
//             return 'secp256k1Signature';
//         }
//         default: {
//             throw Error(`unknown type ${keyType}`);
//         }
//     }
// }
//
// export class Signature extends Enum {
//     enum: string;
//     ed25519Signature?: ED25519Signature;
//     secp256k1Signature?: SECP256K1Signature;
//
//     constructor(signature: { keyType: KeyType, data: Uint8Array }) {
//         const keyName = resolveEnumKeyName(signature.keyType);
//         super({ [keyName]: signature });
//         this[keyName] = signature;
//         this.enum = keyName;
//     }
//
//     get signature() {
//         return this.ed25519Signature || this.secp256k1Signature;
//     }
//
//     get signatureType(): KeyType {
//         return this.signature.keyType;
//     }
//
//     get data(): Uint8Array {
//         return this.signature.data;
//     }
// }
