export type AssertionResponse = {
  authenticatorAttachment: 'platform' | 'cross-platform';
  getClientExtensionResults: () => any;
  id: string;
  rawId: string;
  response: {
    authenticatorData: string;
    clientDataJSON: string;
    signature: string;
    userHandle: string;
  };
  type: 'public-key';
};
