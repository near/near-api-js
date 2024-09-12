import {
  addFullAccessKey,
  generateRandomKeyPair,
  getPlaintextFilesystemSigner,
  getTestnetRpcProvider,
} from '@near-js/client';
import chalk from 'chalk';
import { join } from 'node:path';
import { homedir } from 'node:os';

export default async function createFullAccessKey(accountId: string) {
  if (!accountId) {
    console.log(chalk`{red pnpm createFullAccessKey -- ACCOUNT_ID}`);
    return;
  }

  const credentialsPath = join(homedir(), '.near-credentials');
    // initialize testnet RPC provider
    const rpcProvider = getTestnetRpcProvider();
    // initialize the transaction signer using a pre-existing key for `accountId`
    const { keystore, signer } = getPlaintextFilesystemSigner({ account: accountId, network: 'testnet', filepath: credentialsPath });
    const previousKey = await signer.getPublicKey();

    // create a new key from random data
    const keyPair = generateRandomKeyPair('ed25519');

    // add the generated key to the account as a Full Access Key (FAK)
    await addFullAccessKey({
        account: accountId,
        publicKey: keyPair.getPublicKey().toString(),
        deps: {
            rpcProvider,
            signer,
        },
    });

    // overwrite the key used to sign the transaction
    // above with the new FAK in the key store
    await keystore.setKey('testnet', accountId, keyPair);

  console.log(chalk`{white ------------------------------------------------------------------------ }`);
  console.log(chalk`{bold.green RESULTS} {white Added new full access key and set in keystore}` );
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
  console.log(chalk`{bold.white Previous Key} {white |} {bold.yellow ${previousKey.toString()}}`);
  console.log(chalk`{bold.white New Key}      {white |} {bold.yellow ${keyPair.getPublicKey().toString()}}`);
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
}
