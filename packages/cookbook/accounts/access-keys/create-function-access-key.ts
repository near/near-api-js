import {
  addFunctionCallAccessKey,
  generateRandomKeyPair,
  getSignerFromKeystore,
  getTestnetRpcProvider,
} from '@near-js/client';
import { UnencryptedFileSystemKeyStore } from '@near-js/keystores-node';
import chalk from 'chalk';
import { join } from 'node:path';
import { homedir } from 'node:os';

const CONTRACT_NAME = 'example-account.testnet';
const METHOD_NAMES = ['example_method'];

export default async function createFunctionCallAccessKey(accountId: string, contract = CONTRACT_NAME, methods = METHOD_NAMES) {
  if (!accountId) {
    console.log(chalk`{red bun run createFunctionCallAccessKey -- ACCOUNT_ID}`);
    return;
  }

  // initialize testnet RPC provider
  const rpcProvider = getTestnetRpcProvider();
  // initialize the transaction signer using a pre-existing key for ACCOUNT_ID
  const signer = await getSignerFromKeystore(accountId, 'testnet', new UnencryptedFileSystemKeyStore(join(homedir(), '.near-credentials')));

  // create a new key from random data
  const keyPair = generateRandomKeyPair('ed25519');

  // add the generated key to the account as a Function Call Access Key
  await addFunctionCallAccessKey({
    account: accountId,
    publicKey: keyPair.getPublicKey().toString(),
    contract,
    methodNames: methods,
    allowance: 2500000000000n,
    deps: {
      rpcProvider,
      signer,
    },
  });

  console.log(chalk`{white ------------------------------------------------------------------------ }`);
  console.log(chalk`{bold.green RESULTS} {white Added new function call access key}` );
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
  console.log(chalk`{bold.white New Key} {white |} {bold.yellow ${keyPair.getPublicKey().toString()}} {white |} {bold.yellow ${contract}} {white |} {bold.yellow ${methods}}`);
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
}
