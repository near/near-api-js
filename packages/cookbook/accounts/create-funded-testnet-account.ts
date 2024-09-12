import {
  createFundedTestnetAccount,
  generateRandomKeyPair,
  getPlaintextFilesystemSigner,
} from '@near-js/client';
import chalk from 'chalk';
import { join } from 'node:path';
import { homedir } from 'node:os';

export default async function createFundedTestnetAccountCookbook(accountId: string) {
  if (!accountId) {
    console.log(chalk`{red pnpm createFundedTestnetAccount -- ACCOUNT_ID}`);
    return;
  }

  const credentialsPath = join(homedir(), '.near-credentials');
  // initialize the transaction signer using a pre-existing key for ACCOUNT_ID
  const { keystore } = getPlaintextFilesystemSigner({ account: accountId, network: 'testnet', filepath: credentialsPath });

  // create new keypair and persist it to filesystem keystore
  const keyPair = generateRandomKeyPair('ed25519');
  await keystore.setKey('testnet', accountId, keyPair);

  // call funded testnet creation endpoint
  await createFundedTestnetAccount({
    newAccount: accountId,
    newPublicKey: keyPair.getPublicKey().toString(),
  });

  console.log(chalk`{white ------------------------------------------------------------------------ }`);
  console.log(chalk`{bold.green RESULTS} {white Created funded testnet account}` );
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
  console.log(chalk`{bold.white New Account} {white |} {bold.yellow ${accountId}} {white |} {bold.yellow ${keyPair.getPublicKey().toString()}}`);
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
}
