import {
  formatNearAmount,
  getSignerFromKeystore,
  getTestnetRpcProvider,
  SignedTransactionComposer,
  view,
} from '@near-js/client';
import { UnencryptedFileSystemKeyStore } from '@near-js/keystores-node';
import chalk from 'chalk';
import { join } from 'node:path';
import { homedir } from 'node:os';

// On mainnet it's wrap.near, by the way
const WRAP_NEAR_CONTRACT_ID = "wrap.testnet";

export default async function wrapNear(accountId: string, wrapAmount: bigint, wrapContract = WRAP_NEAR_CONTRACT_ID) {
  if (!accountId || !wrapAmount) {
    console.log(chalk`{red bun run wrapNear -- ACCOUNT_ID WRAP_AMOUNT [WRAP_CONTRACT]}`);
    return;
  }

  // initialize testnet RPC provider
  const rpcProvider = getTestnetRpcProvider();
  // initialize the transaction signer using a pre-existing key for `accountId`
  const signer = await getSignerFromKeystore(accountId, 'testnet', new UnencryptedFileSystemKeyStore(join(homedir(), '.near-credentials')));

  const getStorageBalance = () => view({
    account: wrapContract,
    method: 'storage_balance_of',
    args: { account_id: accountId },
    deps: { rpcProvider },
  }) as Promise<{ available: string, total: string }>;

  const wrapTransaction = SignedTransactionComposer.init({
    sender: accountId,
    receiver: wrapContract,
    deps: { rpcProvider, signer },
  });

  const { total: preTotal, available: preAvailable } = (await getStorageBalance()) || {};
  const _30tgas = BigInt(3e13);
  if (!preTotal) {
    wrapTransaction.functionCall('storage_deposit', {}, _30tgas, BigInt(1.25e21));
  }
  wrapTransaction.functionCall('near_deposit', {}, _30tgas, BigInt(wrapAmount));

  await wrapTransaction.signAndSend();

  const { total: postTotal, available: postAvailable } = await getStorageBalance();
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
  console.log(chalk`{bold.green RESULTS} {white Wrapped ${wrapAmount}yN with ${wrapContract}}`);
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
  console.log(chalk`{bold.white Starting Balance} {white |}  {bold.yellow ${formatNearAmount(preAvailable)} / ${formatNearAmount(preTotal)}}`);
  console.log(chalk`{bold.white Ending Balance}   {white |}  {bold.yellow ${formatNearAmount(postAvailable)} / ${formatNearAmount(postTotal)}}`);
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
}
