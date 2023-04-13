import { KeyType } from '@near-js/crypto';
import { Assignable } from '@near-js/types';

export class Signature extends Assignable {
    keyType: KeyType;
    data: Uint8Array;
}
