import { Fido2Lib } from "fido2-lib";
import { base64 } from "@hexagon/base64";

class Fido2 {
  constructor() { }
  async init(rpId, rpName, rpIcon, timeout) {
      this.f2l = new Fido2Lib({
          timeout,
          rpId,
          rpName,
          challengeSize: 128,
          attestation: "none",
          cryptoParams: [-8, -7],
          authenticatorAttachment: "platform",
          authenticatorRequireResidentKey: true,
          authenticatorUserVerification: "discouraged"
      })
  }

  async registration(username, displayName, id) {
      let registrationOptions = await this.f2l.attestationOptions();

      // make sure to add registrationOptions.user.id
      registrationOptions.user = {
          id: id,
          name: username,
          displayName: displayName
      };

      registrationOptions.status = "ok";

      registrationOptions.challenge = base64.fromArrayBuffer(registrationOptions.challenge, true);

      return registrationOptions;
  }

  async attestation(clientAttestationResponse, origin, challenge) {
      let attestationExpectations = {
          challenge: challenge,
          origin: origin,
          factor: "either"
      };
      let regResult = await this.f2l.attestationResult(clientAttestationResponse, attestationExpectations); // will throw on error
      return regResult;
  }

  async login() {
      let assertionOptions = await this.f2l.assertionOptions();
      assertionOptions.attestation = 'direct';
      assertionOptions.challenge = base64.fromArrayBuffer(assertionOptions.challenge, true);
      assertionOptions.status = "ok";
      return assertionOptions;
  }

  async assertion(assertionResult, expectedAssertionResult) {
      let authnResult = await this.f2l.assertionResult(assertionResult, expectedAssertionResult); // will throw on error
      return authnResult;
  }
}

module.exports = Fido2;
