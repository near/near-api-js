import { KeyType } from '@near-js/crypto';

export class Signature {
    keyType: KeyType;
    data: Uint8Array;

    constructor({ keyType, data }: { keyType: KeyType, data: Uint8Array }) {
        this.keyType = keyType;
        this.data = data;
    }

}
