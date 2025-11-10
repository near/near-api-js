import { expect, test } from 'bun:test';
import { keyToImplicitAddress, PublicKey } from '../src/index.js';

const implicitAddressCases = [
    {
        publicKey: 'ed25519:DcA2MzgpJbrUATQLLceocVckhhAqrkingax4oJ9kZ847',
        expected:
            'bb4dc639b212e075a751685b26bdcea5920a504181ff2910e8549742127092a0',
    },
    {
        publicKey: 'DcA2MzgpJbrUATQLLceocVckhhAqrkingax4oJ9kZ847',
        expected:
            'bb4dc639b212e075a751685b26bdcea5920a504181ff2910e8549742127092a0',
    },
    {
        publicKey: 'ed25519:6E8sCci9badyRkXb3JoRpBj5p8C6Tw41ELDZoiihKEtp',
        expected:
            '4da7e0f4096aaf2ce55e371657cd3089ba1e9f59f4d6e27bd02e472a16a61dc1',
    },
    {
        publicKey: '6E8sCci9badyRkXb3JoRpBj5p8C6Tw41ELDZoiihKEtp',
        expected:
            '4da7e0f4096aaf2ce55e371657cd3089ba1e9f59f4d6e27bd02e472a16a61dc1',
    },
    {
        publicKey: 'ed25519:5TdhJVkBRc9YWQdRZJXjYkfNNb8FYhPnJbGJk4zE5kDN',
        expected:
            '424156f9ae27087a5de6b42f44d7f96db75d73ff6f3b9aa45f4cbe1259234829',
    },
];

for (const { publicKey, expected } of implicitAddressCases) {
    test(`keyToImplicitAddress(${publicKey}) returns ${expected}`, () => {
        expect(keyToImplicitAddress(publicKey)).toEqual(expected);
    });
}

test('keyToImplicitAddress accepts object with toString method', () => {
    const pk = PublicKey.fromString(
        'ed25519:DcA2MzgpJbrUATQLLceocVckhhAqrkingax4oJ9kZ847',
    );

    const result = keyToImplicitAddress(pk);
    expect(result).toEqual(
        'bb4dc639b212e075a751685b26bdcea5920a504181ff2910e8549742127092a0',
    );
});

test('keyToImplicitAddress handles object with toString returning key without prefix', () => {
    const pk = PublicKey.fromString(
        'DcA2MzgpJbrUATQLLceocVckhhAqrkingax4oJ9kZ847',
    );

    const result = keyToImplicitAddress(pk);
    expect(result).toEqual(
        'bb4dc639b212e075a751685b26bdcea5920a504181ff2910e8549742127092a0',
    );
});

test('keyToImplicitAddress returns hex string with proper padding', () => {
    const result = keyToImplicitAddress(
        'ed25519:DcA2MzgpJbrUATQLLceocVckhhAqrkingax4oJ9kZ847',
    );

    expect(result.length).toEqual(64);
    expect(result).toMatch(/^[0-9a-f]+$/);
});
