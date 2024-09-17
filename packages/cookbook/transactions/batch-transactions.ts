import {
  getPlaintextFilesystemSigner,
  getTestnetRpcProvider,
  SignedTransactionComposer,
} from '@near-js/client';
import chalk from 'chalk';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';

// NOTE: replace "example" with your accountId
const CONTRACT_NAME = 'contract.example.testnet';
const WHITELIST_ACCOUNT_ID = 'whitelisted-account.example.testnet';
const WASM_PATH = join(__dirname, '../utils/wasm-files/staking_pool_factory.wasm');

export default async function batchTransactions(accountId: string = CONTRACT_NAME, whitelistAccountId: string = WHITELIST_ACCOUNT_ID, wasmPath: string = WASM_PATH) {
  if (!accountId || !whitelistAccountId || !wasmPath) {
    console.log(chalk`{red pnpm batchTransactions -- [ACCOUNT_ID] [WHITELIST_ACCOUNT_ID] [WASM_PATH]}`);
    return;
  }

  const credentialsPath = join(homedir(), '.near-credentials');

  // initialize testnet RPC provider
  const rpcProvider = getTestnetRpcProvider();
  // initialize the transaction signer using a pre-existing key for `accountId`
  const { signer } = getPlaintextFilesystemSigner({ account: accountId, network: 'testnet', filepath: credentialsPath });

  const { result } = await SignedTransactionComposer.init({
    sender: accountId,
    receiver: accountId,
    deps: { rpcProvider, signer },
  })
    .deployContract(await readFile(wasmPath))
    .functionCall(
      'new',
      Buffer.from(JSON.stringify({ staking_pool_whitelist_account_id: WHITELIST_ACCOUNT_ID })),
      10000000000000n,
    )
    .signAndSend();

  console.log(chalk`{white ------------------------------------------------------------------------ }`);
  console.log(chalk`{bold.green RESULTS} {white Deployed contract at ${wasmPath} to ${accountId}}`);
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
  console.log(chalk`{bold.white Call result} {white |}  {bold.yellow ${JSON.stringify(result, null, 2)}}`);
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
}
