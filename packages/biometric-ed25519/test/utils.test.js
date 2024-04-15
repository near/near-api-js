const { sanitizeCreateKeyResponse, sanitizeGetKeyResponse } = require("../lib/utils");

// Define a mock PublicKeyCredential
class PublicKeyCredentialMock {
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
global.PublicKeyCredential = PublicKeyCredentialMock;

jest.mock('../lib/utils', () => {
  const originalModule = jest.requireActual('../lib/utils');
  return {
    ...originalModule,
    convertUint8ArrayToArrayBuffer: jest.fn().mockImplementation(input => input.buffer),
  };
});

describe('sanitizeCreateKeyResponse', () => {
  it('should convert Uint8Array properties to ArrayBuffer for PublicKeyCredential', () => {
    const mockCredential = new PublicKeyCredentialMock({
      rawId: new Uint8Array([10, 20, 30]),
      clientDataJSON: new Uint8Array([40, 50, 60]),
      attestationObject: new Uint8Array([70, 80, 90]),
    });


    const result = sanitizeCreateKeyResponse(mockCredential);
    expect(result.rawId).toBeInstanceOf(ArrayBuffer);
    expect(result.response.clientDataJSON).toBeInstanceOf(ArrayBuffer);
    expect(result.response.attestationObject).toBeInstanceOf(ArrayBuffer);
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
      someProp: 'test'
    }; // No casting needed

    const result = sanitizeCreateKeyResponse(nonPublicKeyCredential);
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
      userHandle: new Uint8Array([130, 140, 150])
    });

    const result = sanitizeGetKeyResponse(mockCredential);
    expect(result.rawId).toBeInstanceOf(ArrayBuffer);
    expect(result.response.authenticatorData).toBeInstanceOf(ArrayBuffer);
    expect(result.response.clientDataJSON).toBeInstanceOf(ArrayBuffer);
    expect(result.response.signature).toBeInstanceOf(ArrayBuffer);
    expect(result.response.userHandle).toBeInstanceOf(ArrayBuffer);
  });

  it('should return the input unchanged if it does not meet conversion criteria', () => {
    const mockCredential = new PublicKeyCredentialMock({
      rawId: [10, 20, 30],
      clientDataJSON: [40, 50, 60],
      authenticatorData: [70, 80, 90],
      signature: [100, 110, 120],
      userHandle: [130, 140, 150]
    });


    const result = sanitizeGetKeyResponse(mockCredential);
    expect(result).toEqual(mockCredential);
  });

  it('should handle non-PublicKeyCredential input gracefully', () => {
    const nonPublicKeyCredential = {
      someProp: 'test value'
    };

    const result = sanitizeGetKeyResponse(nonPublicKeyCredential);
    expect(result).toEqual(nonPublicKeyCredential);
  });
});