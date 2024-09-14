import {
  functionCall,
  getPlaintextFilesystemSigner,
  getTestnetRpcProvider,
  view,
} from '@near-js/client';
import { formatNearAmount, parseNearAmount } from '@near-js/utils';
import chalk from 'chalk';
import { join } from 'node:path';
import { homedir } from 'node:os';

// On mainnet it's wrap.near, by the way
const WRAP_NEAR_CONTRACT_ID = "wrap.testnet";

export default async function unwrapNear(accountId: string, unwrapAmount: bigint, wrapContract = WRAP_NEAR_CONTRACT_ID) {
  if (!accountId || !unwrapAmount) {
    console.log(chalk`{red pnpm unwrapNear -- ACCOUNT_ID UNWRAP_AMOUNT [WRAP_CONTRACT]}`);
    return;
  }

  const credentialsPath = join(homedir(), '.near-credentials');

  // initialize testnet RPC provider
  const rpcProvider = getTestnetRpcProvider();
  // initialize the transaction signer using a pre-existing key for `accountId`
  const { signer } = getPlaintextFilesystemSigner({ account: accountId, network: 'testnet', filepath: credentialsPath });

  const getStorageBalance = () => view({
    account: wrapContract,
    method: 'storage_balance_of',
    args: { account_id: accountId },
    deps: { rpcProvider },
  }) as Promise<{ available: string, total: string }>;

  const { total: preTotal, available: preAvailable } = (await getStorageBalance()) || {};

  await functionCall({
    sender: accountId,
    receiver: wrapContract,
    method: 'near_withdraw',
    args: { amount: parseNearAmount(unwrapAmount.toString()) },
    deposit: 1n,
    deps: {
      rpcProvider,
      signer,
    },
  });

  const { total: postTotal, available: postAvailable } = await getStorageBalance();
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
  console.log(chalk`{bold.green RESULTS} {white Unwrapped ${unwrapAmount}yN with ${wrapContract}}`);
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
  console.log(chalk`{bold.white Starting Balance} {white |}  {bold.yellow ${formatNearAmount(preAvailable)} / ${formatNearAmount(preTotal)}}`);
  console.log(chalk`{bold.white Ending Balance}   {white |}  {bold.yellow ${formatNearAmount(postAvailable)} / ${formatNearAmount(postTotal)}}`);
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
}
