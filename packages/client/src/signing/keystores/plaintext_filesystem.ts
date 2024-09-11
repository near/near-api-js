/*
  THIS MODULE IS PROVIDED FOR BACKWARD COMPATIBILITY PURPOSES ONLY
  PRIVATE KEYS ARE STORED IN PLAINTEXT - DO NOT USE FOR NON-TEST ACCOUNTS
*/
import { UnencryptedFileSystemKeyStore } from '@near-js/keystores-node';

import { getSignerFromKeystore } from '../signers';

export function getPlaintextFilesystemSigner(account: string, network: string, filepath: string) {
  const keystore = new UnencryptedFileSystemKeyStore(filepath);
  return {
    keystore,
    signer: getSignerFromKeystore(account, network, keystore),
  };
}
