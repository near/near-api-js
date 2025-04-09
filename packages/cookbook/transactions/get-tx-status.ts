import {
  getTestnetRpcArchivalProvider,
} from '@near-js/client';

const TX_HASH = '9av2U6cova7LZPA9NPij6CTUrpBbgPG6LKVkyhcCqtk3';
// account ID associated with the transaction
const ACCOUNT_ID = 'sender.testnet';

export default async function getTransactionStatus(accountId: string = ACCOUNT_ID, transactionHash: string = TX_HASH) {
  // initialize testnet RPC provider
  const rpcProvider = getTestnetRpcArchivalProvider();

  const result = await rpcProvider.viewTransactionStatusWithReceipts(transactionHash, accountId, 'FINAL');

  console.log(JSON.stringify(result, null, 2));
}
