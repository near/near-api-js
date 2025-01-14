import { describe, expect, it, jest } from '@jest/globals';
import { sanitizeCreateKeyResponse, sanitizeGetKeyResponse } from '../src/utils';

// Define a mock PublicKeyCredential
class PublicKeyCredentialMock {
    rawId: string;
    response: any;

    constructor({
        rawId,
        clientDataJSON,
        attestationObject,
        authenticatorData,
        signature,
        userHandle
    }) {
        this.rawId = rawId;
        this.response = {
            clientDataJSON,
            ...(attestationObject ? { attestationObject } : {}),
            ...(signature ? { signature } : {}),
            ...(userHandle ? { userHandle } : {}),
            ...(authenticatorData ? { authenticatorData } : {}),
        };
    }
}

// Define global PublicKeyCredential to make it available during tests
// @ts-expect-error test input
global.PublicKeyCredential = PublicKeyCredentialMock;

jest.mock('../src/utils', () => {
    const originalModule = jest.requireActual('../src/utils');
    return {
        ...originalModule,
        convertUint8ArrayToArrayBuffer: jest.fn().mockImplementation(input => input.buffer),
    };
});

describe('sanitizeCreateKeyResponse', () => {
    it('should convert Uint8Array properties to ArrayBuffer for PublicKeyCredential', () => {
    // @ts-expect-error test input
        const mockCredential = new PublicKeyCredentialMock({
            rawId: new Uint8Array([10, 20, 30]),
            clientDataJSON: new Uint8Array([40, 50, 60]),
            attestationObject: new Uint8Array([70, 80, 90]),
        });


        // @ts-expect-error test input
        const result = sanitizeCreateKeyResponse(mockCredential);
        // @ts-expect-error test input
        expect(result.rawId.constructor.name).toBe('ArrayBuffer');
        // @ts-expect-error test input
        expect(result.response.clientDataJSON.constructor.name).toBe('ArrayBuffer');
        // @ts-expect-error test input
        expect(result.response.attestationObject.constructor.name).toBe('ArrayBuffer');
    });

    it('should return the input unchanged if not PublicKeyCredential or without Uint8Arrays', () => {
    // @ts-expect-error test input
        const mockCredential = new PublicKeyCredentialMock({
            rawId: [10, 20, 30],
            clientDataJSON: [40, 50, 60],
            attestationObject: [70, 80, 90],
        });

        // @ts-expect-error test input
        const result = sanitizeCreateKeyResponse(mockCredential);
        expect(result).toEqual(mockCredential);
    });

    it('should handle non-PublicKeyCredential input gracefully', () => {
        const nonPublicKeyCredential = {
            someProp: 'test'
        }; // No casting needed

        // @ts-expect-error test input
        const result = sanitizeCreateKeyResponse(nonPublicKeyCredential);
        expect(result).toEqual(nonPublicKeyCredential);
    });
});

describe('sanitizeGetKeyResponse', () => {
    it('should convert Uint8Array properties to ArrayBuffer in PublicKeyCredential', () => {
    // @ts-expect-error test input
        const mockCredential = new PublicKeyCredentialMock({
            rawId: new Uint8Array([10, 20, 30]),
            clientDataJSON: new Uint8Array([40, 50, 60]),
            authenticatorData: new Uint8Array([70, 80, 90]),
            signature: new Uint8Array([100, 110, 120]),
            userHandle: new Uint8Array([130, 140, 150])
        });

        // @ts-expect-error test input
        const result: any = sanitizeGetKeyResponse(mockCredential);
        expect(result.rawId.constructor.name).toBe('ArrayBuffer');
        expect(result.response.clientDataJSON.constructor.name).toBe('ArrayBuffer');
        expect(result.response.authenticatorData.constructor.name).toBe('ArrayBuffer');
        expect(result.response.signature.constructor.name).toBe('ArrayBuffer');
        expect(result.response.userHandle.constructor.name).toBe('ArrayBuffer');
    });

    it('should return the input unchanged if it does not meet conversion criteria', () => {
    // @ts-expect-error test input
        const mockCredential = new PublicKeyCredentialMock({
            rawId: [10, 20, 30],
            clientDataJSON: [40, 50, 60],
            authenticatorData: [70, 80, 90],
            signature: [100, 110, 120],
            userHandle: [130, 140, 150]
        });

        // @ts-expect-error test input
        const result = sanitizeGetKeyResponse(mockCredential);
        expect(result).toEqual(mockCredential);
    });

    it('should handle non-PublicKeyCredential input gracefully', () => {
        const nonPublicKeyCredential = {
            someProp: 'test value'
        };

        // @ts-expect-error test input
        const result = sanitizeGetKeyResponse(nonPublicKeyCredential);
        expect(result).toEqual(nonPublicKeyCredential);
    });
});