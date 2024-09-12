import {
  deployContract,
  getPlaintextFilesystemSigner,
  getTestnetRpcProvider,
} from '@near-js/client';
import chalk from 'chalk';
import { join } from 'node:path';
import { homedir } from 'node:os';
import * as fs from 'node:fs/promises';

const WASM_PATH = join(__dirname, '/wasm-files/status_message.wasm');

export default async function deployContractCookbook(accountId: string, wasmPath: string = WASM_PATH) {
  if (!accountId) {
    console.log(chalk`{red pnpm deployContract -- ACCOUNT_ID [WASM_PATH]}`);
    return;
  }

  const credentialsPath = join(homedir(), '.near-credentials');

  // initialize testnet RPC provider
  const rpcProvider = getTestnetRpcProvider();
  // initialize the transaction signer using a pre-existing key for `accountId`
  const { signer } = getPlaintextFilesystemSigner({ account: accountId, network: 'testnet', filepath: credentialsPath });

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
