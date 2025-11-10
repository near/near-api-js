import {
  deployContract,
  getSignerFromKeystore,
  getTestnetRpcProvider,
} from '@near-js/client';
import { UnencryptedFileSystemKeyStore } from '@near-js/keystores-node';
import chalk from 'chalk';
import { join } from 'node:path';
import { homedir } from 'node:os';
import * as fs from 'node:fs/promises';

const WASM_PATH = join(__dirname, '/wasm-files/status_message.wasm');

export default async function deployContractCookbook(accountId: string, wasmPath: string = WASM_PATH) {
  if (!accountId) {
    console.log(chalk`{red bun run deployContract -- ACCOUNT_ID [WASM_PATH]}`);
    return;
  }

  // initialize testnet RPC provider
  const rpcProvider = getTestnetRpcProvider();
  // initialize the transaction signer using a pre-existing key for `accountId`
  const signer = await getSignerFromKeystore(accountId, 'testnet', new UnencryptedFileSystemKeyStore(join(homedir(), '.near-credentials')));

  await deployContract({
    account: accountId,
    code: await fs.readFile(wasmPath),
    deps: {
      rpcProvider,
      signer,
    },
  });

  console.log(chalk`{white ------------------------------------------------------------------------ }`);
  console.log(chalk`{bold.green RESULTS} {white Deployed contract}` );
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
  console.log(chalk`{bold.white Contract Deployed} {white |} {bold.yellow WASM at ${wasmPath} deployed to ${accountId}}`);
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
}
