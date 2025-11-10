import { base64 } from '@hexagon/base64';
import cbor from 'cbor-js';
import {
    type AttestationResult,
    type ExpectedAttestationResult,
    type Fido2AttestationResult,
    Fido2Lib,
    type Fido2LibOptions,
    type PublicKeyCredentialCreationOptions,
    type PublicKeyCredentialRequestOptions,
} from 'fido2-lib';

export class Fido2 {
    f2l: Fido2Lib;

    async init({
        rpId,
        rpName,
        timeout,
    }: Pick<Fido2LibOptions, 'rpId' | 'rpName' | 'timeout'>): Promise<void> {
        this.f2l = new Fido2Lib({
            timeout,
            rpId,
            rpName,
            challengeSize: 128,
            attestation: 'none',
            cryptoParams: [-8, -7, -257],
            authenticatorAttachment: 'platform',
            authenticatorRequireResidentKey: true,
            authenticatorUserVerification: 'preferred',
        });
    }

    async registration({
        username,
        displayName,
        id,
    }: {
        username: string;
        displayName: string;
        id: string;
    }): Promise<
        Omit<PublicKeyCredentialCreationOptions, 'challenge'> & {
            status: 'ok';
            challenge: string;
        }
    > {
        const registrationOptions = await this.f2l.attestationOptions();
        const user = {
            id: id,
            name: username,
            displayName: displayName,
        };
        const challenge = base64.fromArrayBuffer(
            registrationOptions.challenge,
            true,
        );

        return {
            ...registrationOptions,
            user,
            status: 'ok',
            challenge,
        };
    }

    async attestation({
        clientAttestationResponse,
        origin,
        challenge,
    }: {
        clientAttestationResponse: AttestationResult;
        origin: string;
        challenge: string;
    }): Promise<Fido2AttestationResult> {
        const attestationExpectations: ExpectedAttestationResult = {
            challenge: challenge,
            origin: origin,
            factor: 'either',
        };

        const regResult = await this.f2l.attestationResult(
            clientAttestationResponse,
            attestationExpectations,
        );
        return regResult;
    }

    async login(): Promise<
        Omit<PublicKeyCredentialRequestOptions, 'challenge'> & {
            attestation: 'direct';
            challenge: string;
            status: 'ok';
        }
    > {
        const assertionOptions = await this.f2l.assertionOptions();
        const challenge = base64.fromArrayBuffer(
            assertionOptions.challenge,
            true,
        );

        return {
            ...assertionOptions,
            attestation: 'direct',
            challenge,
            status: 'ok',
        };
    }

    async checkAlg(
        res: AttestationResult,
        exp: ExpectedAttestationResult,
    ): Promise<number> {
        const result = await this.f2l.attestationResult(res, exp);
        const cosePublicKey = result.authnrData.get('credentialPublicKeyCose');
        const decodedKey = cbor.decode(cosePublicKey);
        const algKey = 3; // The key for the "alg" field in COSE
        return decodedKey[algKey];
    }
}
