import { describe, expect, it } from 'bun:test';
import {
    sanitizeCreateKeyResponse,
    sanitizeGetKeyResponse,
} from '../src/utils.js';

// Define a mock PublicKeyCredential
class PublicKeyCredentialMock {
    rawId: string;
    response: any;
    id: string;
    type: string;
    authenticatorAttachment: string;

    constructor({
        rawId,
        clientDataJSON,
        attestationObject,
        authenticatorData,
        signature,
        userHandle,
    }: {
        rawId?: any;
        clientDataJSON?: any;
        attestationObject?: any;
        authenticatorData?: any;
        signature?: any;
        userHandle?: any;
    }) {
        this.rawId = rawId;
        this.response = {
            clientDataJSON,
            ...(attestationObject ? { attestationObject } : {}),
            ...(signature ? { signature } : {}),
            ...(userHandle ? { userHandle } : {}),
            ...(authenticatorData ? { authenticatorData } : {}),
        };
        this.id = 'mock-credential-id';
        this.type = 'public-key';
        this.authenticatorAttachment = 'platform';
    }

    getClientExtensionResults(): AuthenticationExtensionsClientOutputs {
        return {};
    }

    toJSON(): any {
        return {
            id: this.id,
            rawId: this.rawId,
            response: this.response,
            type: this.type,
            authenticatorAttachment: this.authenticatorAttachment,
        };
    }
}

// Define global PublicKeyCredential to make it available during tests
// @ts-expect-error test input
global.PublicKeyCredential = PublicKeyCredentialMock;

describe('sanitizeCreateKeyResponse', () => {
    it('should convert Uint8Array properties to ArrayBuffer for PublicKeyCredential', () => {
        const mockCredential = new PublicKeyCredentialMock({
            rawId: new Uint8Array([10, 20, 30]),
            clientDataJSON: new Uint8Array([40, 50, 60]),
            attestationObject: new Uint8Array([70, 80, 90]),
        });

        const result: any = sanitizeCreateKeyResponse(mockCredential);
        expect(result.rawId.constructor.name).toBe('ArrayBuffer');
        expect(result.response.clientDataJSON.constructor.name).toBe(
            'ArrayBuffer',
        );
        expect(result.response.attestationObject.constructor.name).toBe(
            'ArrayBuffer',
        );
    });

    it('should return the input unchanged if not PublicKeyCredential or without Uint8Arrays', () => {
        const mockCredential = new PublicKeyCredentialMock({
            rawId: [10, 20, 30],
            clientDataJSON: [40, 50, 60],
            attestationObject: [70, 80, 90],
        });

        const result = sanitizeCreateKeyResponse(mockCredential);
        expect(result).toEqual(mockCredential);
    });

    it('should handle non-PublicKeyCredential input gracefully', () => {
        const nonPublicKeyCredential = {
            someProp: 'test',
        }; // No casting needed

        // @ts-expect-error test input
        const result = sanitizeCreateKeyResponse(nonPublicKeyCredential);
        // @ts-expect-error test input
        expect(result).toEqual(nonPublicKeyCredential);
    });
});

describe('sanitizeGetKeyResponse', () => {
    it('should convert Uint8Array properties to ArrayBuffer in PublicKeyCredential', () => {
        const mockCredential = new PublicKeyCredentialMock({
            rawId: new Uint8Array([10, 20, 30]),
            clientDataJSON: new Uint8Array([40, 50, 60]),
            authenticatorData: new Uint8Array([70, 80, 90]),
            signature: new Uint8Array([100, 110, 120]),
            userHandle: new Uint8Array([130, 140, 150]),
        });

        const result: any = sanitizeGetKeyResponse(mockCredential);
        expect(result.rawId.constructor.name).toBe('ArrayBuffer');
        expect(result.response.clientDataJSON.constructor.name).toBe(
            'ArrayBuffer',
        );
        expect(result.response.authenticatorData.constructor.name).toBe(
            'ArrayBuffer',
        );
        expect(result.response.signature.constructor.name).toBe('ArrayBuffer');
        expect(result.response.userHandle.constructor.name).toBe('ArrayBuffer');
    });

    it('should return the input unchanged if it does not meet conversion criteria', () => {
        const mockCredential = new PublicKeyCredentialMock({
            rawId: [10, 20, 30],
            clientDataJSON: [40, 50, 60],
            authenticatorData: [70, 80, 90],
            signature: [100, 110, 120],
            userHandle: [130, 140, 150],
        });

        const result = sanitizeGetKeyResponse(mockCredential);
        expect(result).toEqual(mockCredential);
    });

    it('should handle non-PublicKeyCredential input gracefully', () => {
        const nonPublicKeyCredential = {
            someProp: 'test value',
        };

        // @ts-expect-error test input
        const result = sanitizeGetKeyResponse(nonPublicKeyCredential);
        // @ts-expect-error test input
        expect(result).toEqual(nonPublicKeyCredential);
    });
});
