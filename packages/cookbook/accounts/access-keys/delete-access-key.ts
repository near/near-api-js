import {
  deleteAccessKey,
  getSignerFromKeystore,
  getTestnetRpcProvider,
  parseKeyPair,
} from '@near-js/client';
import { UnencryptedFileSystemKeyStore } from '@near-js/keystores-node';
import { type KeyPairString } from '@near-js/crypto';
import chalk from 'chalk';
import { join } from 'node:path';
import { homedir } from 'node:os';

export default async function deleteAccessKeyCookbook(accountId: string, publicKey: string) {
  if (!accountId) {
    console.log(chalk`{red pnpm deleteAccessKey -- ACCOUNT_ID [PUBLIC_KEY]}`);
    return;
  }

  // initialize testnet RPC provider
  const rpcProvider = getTestnetRpcProvider();
  // initialize the transaction signer using a pre-existing key for ACCOUNT_ID
  const signer = await getSignerFromKeystore(accountId, 'testnet', new UnencryptedFileSystemKeyStore(join(homedir(), '.near-credentials')));

  // parse the target key from its string representation
  const keyPair = parseKeyPair(publicKey as KeyPairString);

  // add the generated key to the account as a Function Call Access Key
  await deleteAccessKey({
      account: accountId,
      publicKey: keyPair.getPublicKey().toString(),
      deps: {
          rpcProvider,
          signer,
      },
  });

  console.log(chalk`{white ------------------------------------------------------------------------ }`);
  console.log(chalk`{bold.green RESULTS} {white Deleted access key}` );
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
  console.log(chalk`{bold.white Deleted Key} {white |} {bold.yellow ${keyPair.getPublicKey().toString()}}`);
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
}
