import {
  createTopLevelAccount,
  generateRandomKeyPair,
  getMainnetRpcProvider,
  getSignerFromKeystore,
} from '@near-js/client';
import { UnencryptedFileSystemKeyStore } from '@near-js/keystores-node';
import chalk from 'chalk';
import { join } from 'node:path';
import { homedir } from 'node:os';

export default async function createMainnetAccountCookbook(accountId: string, newAccountId?: string) {
  if (!accountId) {
    console.log(chalk`{red pnpm createMainnetAccount -- CREATOR_ACCOUNT_ID [NEW_ACCOUNT_ID]}`);
    return;
  }

  // initialize testnet RPC provider
  const rpcProvider = getMainnetRpcProvider();
  // initialize the transaction signer using a pre-existing key for `accountId`
  const keystore = new UnencryptedFileSystemKeyStore(join(homedir(), '.near-credentials'));
  const signer = await getSignerFromKeystore(accountId, 'mainnet', keystore);

  // create a new key from random data
  const keyPair = generateRandomKeyPair('ed25519');

  const newAccount = newAccountId || `${new Date().valueOf()}-${Math.ceil(Math.random() * 10e12)}.near`;

  await createTopLevelAccount({
    account: accountId,
    contract: 'mainnet',
    initialBalance: 100n,
    newAccount,
    newPublicKey: keyPair.getPublicKey().toString(),
    deps: {
      rpcProvider,
      signer,
    },
  });

  // save new account in plaintext filesystem keystore
  await keystore.setKey('mainnet', accountId, keyPair);

  console.log(chalk`{white ------------------------------------------------------------------------ }`);
  console.log(chalk`{bold.green RESULTS} {white Created mainnet account}`);
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
  console.log(chalk`{bold.white New Account} {white |} {bold.yellow ${accountId}} {white |} {bold.yellow ${keyPair.getPublicKey().toString()}}`);
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
}
