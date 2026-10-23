import { shake128, shake256 } from '@noble/hashes/sha3.js';

const Q = 8380417;
const N = 256;
const K = 6;
const L = 5;
const ETA = 4;
const D = 13;
const POLY_ETA_BYTES = 128;
const POLY_T0_BYTES = 416;
const POLY_T1_BYTES = 320;
const N_INV = 8347681;

const mod = (a: number): number => {
    const r = a % Q;
    return r < 0 ? r + Q : r;
};
const mul = (a: number, b: number): number => (a * b) % Q;

const power = (base: number, exp: number): number => {
    let result = 1;
    let b = base;
    let e = exp;
    while (e > 0) {
        if (e & 1) result = mul(result, b);
        b = mul(b, b);
        e >>= 1;
    }
    return result;
};

const bitReverse8 = (x: number): number => {
    let r = 0;
    for (let i = 0; i < 8; i++) r |= ((x >> i) & 1) << (7 - i);
    return r;
};

const ZETAS = Array.from({ length: N }, (_, i) => power(1753, bitReverse8(i)));

function ntt(input: number[]): number[] {
    const w = input.slice();
    let m = 0;
    for (let len = 128; len >= 1; len >>= 1) {
        for (let start = 0; start < N; start += 2 * len) {
            const zeta = ZETAS[++m]!;
            for (let j = start; j < start + len; j++) {
                const t = mul(zeta, w[j + len]!);
                w[j + len] = mod(w[j]! - t);
                w[j] = mod(w[j]! + t);
            }
        }
    }
    return w;
}

function inverseNtt(input: number[]): number[] {
    const w = input.slice();
    let m = N;
    for (let len = 1; len < N; len <<= 1) {
        for (let start = 0; start < N; start += 2 * len) {
            const zeta = mod(-ZETAS[--m]!);
            for (let j = start; j < start + len; j++) {
                const t = w[j]!;
                w[j] = mod(t + w[j + len]!);
                w[j + len] = mul(zeta, mod(t - w[j + len]!));
            }
        }
    }
    return w.map((x) => mul(x, N_INV));
}

function sampleNttPoly(rho: Uint8Array, column: number, row: number): number[] {
    const out: number[] = [];
    const xof = shake128.create({});
    const input = new Uint8Array(34);
    input.set(rho);
    input[32] = column;
    input[33] = row;
    xof.update(input);
    while (out.length < N) {
        const b = xof.xof(3);
        const v = b[0]! | (b[1]! << 8) | ((b[2]! & 0x7f) << 16);
        if (v < Q) out.push(v);
    }
    return out;
}

function readBits(bytes: Uint8Array, offset: number, index: number, width: number): number {
    let v = 0;
    for (let b = 0; b < width; b++) {
        const bit = index * width + b;
        v |= ((bytes[offset + (bit >> 3)]! >> (bit & 7)) & 1) << b;
    }
    return v;
}

function unpackEta(bytes: Uint8Array, offset: number): number[] {
    const poly: number[] = [];
    for (let i = 0; i < N; i++) {
        const v = readBits(bytes, offset, i, 4);
        if (v > 2 * ETA) throw new Error('ML-DSA-65 secret key has a coefficient of s1 or s2 outside [-4, 4]');
        poly.push(ETA - v);
    }
    return poly;
}

/**
 * Checks an expanded ML-DSA-65 private key against FIPS 204 Algorithm 6. Every coefficient of
 * s1 and s2 must lie in [-4, 4], and t0, t1 and tr must equal the values recomputed from rho,
 * s1 and s2. Throws when the key is malformed.
 */
export function assertValidExpandedMLDSA65(secretKey: Uint8Array, publicKey: Uint8Array): void {
    if (secretKey.length !== 4032 || publicKey.length !== 1952) {
        throw new Error('ML-DSA-65 expanded key or public key has the wrong length');
    }
    const rho = secretKey.subarray(0, 32);
    const tr = secretKey.subarray(64, 128);
    const s1: number[][] = [];
    const s2: number[][] = [];
    for (let i = 0; i < L; i++) s1.push(unpackEta(secretKey, 128 + i * POLY_ETA_BYTES));
    for (let i = 0; i < K; i++) s2.push(unpackEta(secretKey, 128 + (L + i) * POLY_ETA_BYTES));
    const t0Offset = 128 + (L + K) * POLY_ETA_BYTES;
    const s1Hat = s1.map((p) => ntt(p.map(mod)));
    for (let row = 0; row < K; row++) {
        const acc = new Array<number>(N).fill(0);
        for (let column = 0; column < L; column++) {
            const a = sampleNttPoly(rho, column, row);
            const s = s1Hat[column]!;
            for (let j = 0; j < N; j++) acc[j] = mod(acc[j]! + mul(a[j]!, s[j]!));
        }
        const t = inverseNtt(acc);
        for (let j = 0; j < N; j++) {
            const r = mod(t[j]! + s2[row]![j]!);
            let r0 = r % (1 << D);
            if (r0 > 1 << (D - 1)) r0 -= 1 << D;
            const t1 = (r - r0) >> D;
            if ((1 << (D - 1)) - readBits(secretKey, t0Offset + row * POLY_T0_BYTES, j, D) !== r0) {
                throw new Error('ML-DSA-65 secret key t0 does not match rho, s1 and s2');
            }
            if (readBits(publicKey, 32 + row * POLY_T1_BYTES, j, 10) !== t1) {
                throw new Error('ML-DSA-65 public key t1 does not match the secret key');
            }
        }
    }
    for (let i = 0; i < 32; i++) {
        if (publicKey[i] !== rho[i]) throw new Error('ML-DSA-65 public key rho does not match the secret key');
    }
    const expectedTr = shake256(publicKey, { dkLen: 64 });
    for (let i = 0; i < 64; i++) {
        if (expectedTr[i] !== tr[i]) throw new Error('ML-DSA-65 secret key tr does not match the public key');
    }
}
