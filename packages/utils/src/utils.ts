import { baseDecode } from './format';
import { type PublicKey } from "../../crypto/lib/esm/public_key";


export function sortBigIntAsc(a: bigint, b: bigint) {
    return (a < b ? -1 : a > b ? 1 : 0)
}


export function keyToImplicitAddress(publicKey: string | PublicKey): string {
    const publicKeyStr = typeof publicKey === 'string' ? publicKey : publicKey.toString();

    const publicKeyWithoutPrefix = publicKeyStr.replace(/^ed25519:/, '');
  
    const decoded = baseDecode(publicKeyWithoutPrefix);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
        const hex = decoded[i].toString(16);
        result += hex.length === 1 ? '0' + hex : hex;
    }
    return result;
}