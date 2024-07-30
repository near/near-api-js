import { KeyType } from '@near-js/crypto';
import { Assignable } from '@near-js/types';

class ED25519Signature extends Assignable { keyType: KeyType = KeyType.ED25519; data: Uint8Array; }
class SECP256K1Signature extends Assignable { keyType: KeyType = KeyType.SECP256K1; data: Uint8Array; }

export class Signature extends Assignable {
    ed25519Signature?: ED25519Signature;
    secp256k1Signature?: SECP256K1Signature;

    constructor({ keyType, data }: { keyType: KeyType, data: Uint8Array }) {
        super({});
        if (keyType === KeyType.ED25519) {
            this.ed25519Signature = { keyType, data };
        } else if (keyType === KeyType.SECP256K1) {
            this.secp256k1Signature = { keyType, data };
        }
    }

    get signature() {
        return this.ed25519Signature || this.secp256k1Signature;
    }
      
    get signatureType(): KeyType {
        return this.signature.keyType;
    }
    
    get data(): Uint8Array {
        return this.signature.data;
    }
}
