import {
  formatNearAmount,
  functionCall,
  getSignerFromKeystore,
  getTestnetRpcProvider,
  MAX_GAS,
} from '@near-js/client';
import { UnencryptedFileSystemKeyStore } from '@near-js/keystores-node';
import chalk from 'chalk';
import { join } from 'node:path';
import { homedir } from 'node:os';

const CONTRACT_ID = "guest-book.testnet";
const METHOD_NAME = "addMessage";

export default async function calculateGas(accountId: string, method = METHOD_NAME, contract = CONTRACT_ID) {
  if (!accountId) {
    console.log(chalk`{red pnpm calculateGas -- ACCOUNT_ID}`);
    return;
  }

  // initialize testnet RPC provider
  const rpcProvider = getTestnetRpcProvider();
  // initialize the transaction signer using a pre-existing key for `accountId`
  const signer = await getSignerFromKeystore(accountId, 'testnet', new UnencryptedFileSystemKeyStore(join(homedir(), '.near-credentials')));

  const {
    outcome: {
      receipts_outcome: receiptsOutcome,
      transaction_outcome: { outcome: transactionOutcome },
    },
  } = await functionCall({
    sender: accountId,
    receiver: contract,
    method,
    args: {
      text: 'Howdy!',
    },
    gas: MAX_GAS,
    deps: {
      rpcProvider,
      signer,
    },
  });

  const { totalGasBurned, totalTokensBurned } = receiptsOutcome.reduce(
    (acc, receipt) => {
      acc.totalGasBurned += receipt.outcome.gas_burnt;
      acc.totalTokensBurned += BigInt(receipt.outcome.tokens_burnt);
      return acc;
    },
    {
      totalGasBurned: transactionOutcome.gas_burnt,
      totalTokensBurned: BigInt(transactionOutcome.tokens_burnt),
    }
  );

  console.log(chalk`{white ------------------------------------------------------------------------ }`);
  console.log(chalk`{bold.green RESULTS} {white for: [ {bold.blue ${method}} ] called on contract: [ {bold.blue ${contract}} ]}` );
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
  console.log(chalk`{bold.white Gas Burnt}     {white |}  {bold.yellow ${formatNearAmount(totalGasBurned.toString())}}`);
  console.log(chalk`{bold.white Tokens Burnt}  {white |}  {bold.yellow ${formatNearAmount(totalTokensBurned.toString())}}`);
  console.log(chalk`{white ------------------------------------------------------------------------ }`);
}
