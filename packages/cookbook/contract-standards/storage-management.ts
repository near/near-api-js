import {
  createFundedTestnetAccount,
  generateRandomKeyPair,
  getPlaintextFilesystemSigner,
  getTestnetRpcProvider,
  storageDeposit,
  storageUnregister,
} from '@near-js/client';
import chalk from 'chalk';
import { join } from 'node:path';
import { homedir } from 'node:os';

export default async function storageManagementStandard(contractAddress: string, accountId: string) {
  // run serially since calls may rely on previous calls
  await storageDepositCall(contractAddress, accountId);
  await storageUnregisterCall(contractAddress, accountId);
}

export async function storageDepositCall(contractAddress: string, accountId: string) {
  if (!contractAddress || !accountId) {
    console.log(chalk`{red pnpm storageManagementStorageDeposit -- CONTRACT_ADDRESS ACCOUNT_ID}`);
    return;
  }

  const credentialsPath = join(homedir(), '.near-credentials');

  // initialize testnet RPC provider
  const rpcProvider = getTestnetRpcProvider();
  // initialize the transaction signer using a pre-existing key for `accountId`
  const { signer } = getPlaintextFilesystemSigner({ account: accountId, network: 'testnet', filepath: credentialsPath });

  const {result} = await storageDeposit({
    receiver: contractAddress,
    sender: accountId,
    args: {
      account_id: accountId,
      registration_only: false,
    },
    deps: {
      rpcProvider,
      signer,
    },
    deposit: 1000000000000000000000000n,
  });

  const output = chalk`
  {white ------------------------------------------------------------------------ }
  {bold.green RESULTS} {white storage_deposit}
  {white ------------------------------------------------------------------------ }
  {bold.white Total}     {white |} {bold.yellow ${result.total}}
  {bold.white Available} {white |} {bold.yellow ${result.available}}
  {white ------------------------------------------------------------------------ }
  `;
  console.log(output);
}

export async function storageUnregisterCall(contractAddress: string, accountId: string) {
  if (!contractAddress || !accountId) {
    console.log(chalk`{red pnpm storageManagementStorageDeposit -- CONTRACT_ADDRESS ACCOUNT_ID}`);
    return;
  }

  const credentialsPath = join(homedir(), '.near-credentials');

  // initialize testnet RPC provider
  const rpcProvider = getTestnetRpcProvider();
  // initialize the transaction signer using a pre-existing key for `accountId`
  const { signer } = getPlaintextFilesystemSigner({ account: accountId, network: 'testnet', filepath: credentialsPath });

  const {result} = await storageUnregister({
    receiver: contractAddress,
    sender: accountId,
    args: {
      force: true,
    },
    deps: {
      rpcProvider,
      signer,
    },
    deposit: 1n,
  });
  console.log(`unregister result: ${result}`);
  console.log(`unregister result type: ${typeof result}`);

  const output = chalk`
  {white ------------------------------------------------------------------------ }
  {bold.green RESULTS} {white storage_unregister}
  {white ------------------------------------------------------------------------ }
  {bold.white Result}     {white |} {bold.yellow ${result}}
  {white ------------------------------------------------------------------------ }
  `;
  console.log(output);
}
